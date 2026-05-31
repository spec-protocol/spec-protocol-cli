import chalk from "chalk";
import { join } from "node:path";
import {
  assertProtocolInitialized,
  getAllArtifactInfos,
  type ArtifactInfo,
} from "../lib/task-progress.js";
import { pathExists, readTextFile } from "../lib/fs.js";
import { getTaskDir } from "../lib/paths.js";
import { validateTaskId } from "../lib/validate.js";
import {
  DEFAULT_LANGUAGE,
  getArtifactLabel,
  getFieldValueByKey,
  getSectionTextByKey,
  hasRealText,
  normalizeStatus,
  type SupportedLanguage,
} from "../lib/i18n.js";
import { readConfig } from "../lib/config.js";

export interface ValidateOptions {
  json?: boolean;
}

interface ValidationResult {
  taskId: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export async function runValidate(
  taskId: string,
  options: ValidateOptions = {},
  cwd: string = process.cwd(),
): Promise<number> {
  const idError = validateTaskId(taskId);
  if (idError) throw new Error(idError);

  await assertProtocolInitialized(cwd);

  const taskDir = getTaskDir(cwd, taskId);
  if (!(await pathExists(taskDir))) {
    throw new Error(
      `Tarefa "${taskId}" não encontrada. Execute: spec-protocol new ${taskId}`,
    );
  }

  const config = await readConfig(cwd);
  const language = config?.language ?? DEFAULT_LANGUAGE;
  const infos = await getAllArtifactInfos(taskDir);
  const result = await buildValidationResult(taskId, infos, taskDir, language);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return result.valid ? 0 : 1;
  }

  printValidationResult(result, taskId);
  return result.valid ? 0 : 1;
}

async function buildValidationResult(
  taskId: string,
  infos: ArtifactInfo[],
  taskDir: string,
  language: SupportedLanguage,
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const info of infos) {
    const { artifact, status } = info;
    const label = getArtifactLabel(artifact.id, language);

    if (artifact.critical && status !== "OK") {
      errors.push(
        `${artifact.file} (${label}) está ${status} — obrigatório para export`,
      );
    } else if (!artifact.critical && status !== "OK") {
      warnings.push(
        `${artifact.file} (${label}) está ${status} — recomendado`,
      );
    }
  }

  const spec = await readOptional(join(taskDir, "spec.md"));
  const plan = await readOptional(join(taskDir, "plan.md"));

  if (spec) {
    validateSpecContract(spec, errors, warnings);
  }

  const specStatus = spec
    ? normalizeStatus(getSectionTextByKey(spec, "spec.readinessStatus"))
    : "";
  if (specStatus === "PRONTO" || specStatus === "EXCEÇÃO APROVADA") {
    if (plan) {
      validatePlanContract(plan, specStatus, errors);
    }
  }

  return { taskId, valid: errors.length === 0, errors, warnings };
}

async function readOptional(path: string): Promise<string | null> {
  try {
    return await readTextFile(path);
  } catch {
    return null;
  }
}

function validateSpecContract(
  content: string,
  errors: string[],
  warnings: string[],
): void {
  const classification = getSectionTextByKey(content, "spec.classification");
  const workType = getFieldValueByKey(classification, "spec.workType");
  const riskLevel = getFieldValueByKey(classification, "spec.riskLevel");
  const objective = getSectionTextByKey(content, "spec.objective");
  const status = normalizeStatus(
    getSectionTextByKey(content, "spec.readinessStatus"),
  );

  if (!workType) errors.push("spec.md sem tipo de trabalho preenchido");
  if (!riskLevel) errors.push("spec.md sem nível de risco preenchido");
  if (!hasRealText(objective)) errors.push("spec.md sem objetivo preenchido");
  if (!status) errors.push("spec.md sem status de prontidão preenchido");

  if (status === "EXCEÇÃO APROVADA") {
    const decisions = getSectionTextByKey(content, "spec.confirmedDecisions");
    if (!hasRealText(decisions)) {
      errors.push("spec.md com EXCEÇÃO APROVADA sem decisões confirmadas");
    }
  }

  const pending = getSectionTextByKey(content, "spec.pendingDecisions", {
    stripPlaceholders: false,
  });
  if (/\[CRÍTICO\]/i.test(pending) && status === "PRONTO") {
    warnings.push(
      "spec.md está PRONTO, mas ainda contém decisão [CRÍTICO] pendente",
    );
  }
}

function validatePlanContract(
  content: string,
  specStatus: string,
  errors: string[],
): void {
  const decision = getSectionTextByKey(content, "plan.finalDecision");
  const planStatus = normalizeStatus(decision);
  const inputs = getSectionTextByKey(content, "plan.validatedInputs");
  const acceptance = getSectionTextByKey(content, "plan.acceptanceCriteria");

  if (!planStatus) errors.push("plan.md sem status em Decisão final");
  if (!hasRealText(inputs)) errors.push("plan.md sem insumos validados");
  if (!hasRealText(acceptance)) {
    errors.push("plan.md sem critérios de aceite finais");
  }

  if (specStatus === "EXCEÇÃO APROVADA") {
    const exception = getSectionTextByKey(content, "plan.exceptionMode");
    if (!hasRealText(exception)) {
      errors.push(
        "plan.md sem modo de exceção apesar de spec.md estar EXCEÇÃO APROVADA",
      );
    }
    if (!/respons[aá]vel|responsible/i.test(exception)) {
      errors.push("plan.md em exceção sem responsável pela decisão");
    }
    if (!/risco|risk|riesgo/i.test(exception)) {
      errors.push("plan.md em exceção sem riscos aceitos");
    }
  }
}

function printValidationResult(result: ValidationResult, taskId: string): void {
  console.log("");

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(chalk.green(`  ✓ ${taskId} — artefatos críticos preenchidos`));
    console.log(chalk.gray(`    Pronto para: spec-protocol export ${taskId}`));
    console.log("");
    return;
  }

  if (result.errors.length > 0) {
    console.log(
      chalk.red(`  ✗ ${taskId} — ${result.errors.length} bloqueio(s):`),
    );
    console.log("");
    for (const err of result.errors) {
      console.log(chalk.red(`    ✗ ${err}`));
    }
    console.log("");
  }

  if (result.warnings.length > 0) {
    console.log(chalk.yellow(`  ⚠ Avisos (${result.warnings.length}):`));
    for (const warn of result.warnings) {
      console.log(chalk.yellow(`    ~ ${warn}`));
    }
    console.log("");
  }

  if (!result.valid) {
    console.log(
      chalk.gray(`    Veja o progresso: spec-protocol status ${taskId}`),
    );
    console.log(chalk.gray(`    Na IDE: @rta-triagem`));
    console.log("");
  }
}

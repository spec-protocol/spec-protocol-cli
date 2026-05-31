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

  const infos = await getAllArtifactInfos(taskDir);
  const result = await buildValidationResult(taskId, infos, taskDir);

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
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const info of infos) {
    const { artifact, status } = info;

    if (artifact.critical && status !== "OK") {
      errors.push(
        `${artifact.file} (${artifact.name}) está ${status} — obrigatório para export`,
      );
    } else if (!artifact.critical && status !== "OK") {
      warnings.push(
        `${artifact.file} (${artifact.name}) está ${status} — recomendado`,
      );
    }
  }

  const spec = await readOptional(join(taskDir, "spec.md"));
  const plan = await readOptional(join(taskDir, "plan.md"));

  if (spec) {
    validateSpecContract(spec, errors, warnings);
  }

  const specStatus = spec ? normalizeStatus(getSectionText(spec, "Status de prontidão")) : "";
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
  const classification = getSectionText(content, "Classificação RTA");
  const workType = getFieldValue(classification, "Tipo de trabalho");
  const riskLevel = getFieldValue(classification, "Nível de risco");
  const objective = getSectionText(content, "Objetivo");
  const status = normalizeStatus(getSectionText(content, "Status de prontidão"));

  if (!workType) errors.push("spec.md sem Tipo de trabalho preenchido");
  if (!riskLevel) errors.push("spec.md sem Nível de risco preenchido");
  if (!hasRealText(objective)) errors.push("spec.md sem Objetivo preenchido");
  if (!status) errors.push("spec.md sem Status de prontidão preenchido");

  if (status === "EXCEÇÃO APROVADA") {
    const decisions = getSectionText(content, "Decisões confirmadas");
    if (!hasRealText(decisions)) {
      errors.push("spec.md com EXCEÇÃO APROVADA sem Decisões confirmadas");
    }
  }

  const pending = getSectionText(content, "Decisões pendentes");
  if (pending.includes("[CRÍTICO]") && status === "PRONTO") {
    warnings.push("spec.md está PRONTO, mas ainda contém decisão [CRÍTICO] pendente");
  }
}

function validatePlanContract(
  content: string,
  specStatus: string,
  errors: string[],
): void {
  const decision = getSectionText(content, "Decisão final");
  const planStatus = normalizeStatus(decision);
  const inputs = getSectionText(content, "Insumos validados");
  const acceptance = getSectionText(content, "Critérios de aceite finais");

  if (!planStatus) errors.push("plan.md sem Status em Decisão final");
  if (!hasRealText(inputs)) errors.push("plan.md sem Insumos validados");
  if (!hasRealText(acceptance)) errors.push("plan.md sem Critérios de aceite finais");

  if (specStatus === "EXCEÇÃO APROVADA") {
    const exception = getSectionText(content, "Modo de exceção");
    if (!hasRealText(exception)) {
      errors.push("plan.md sem Modo de exceção apesar de spec.md estar EXCEÇÃO APROVADA");
    }
    if (!/respons[aá]vel/i.test(exception)) {
      errors.push("plan.md em exceção sem responsável pela decisão");
    }
    if (!/risco/i.test(exception)) {
      errors.push("plan.md em exceção sem riscos aceitos");
    }
  }
}

function getSectionText(content: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(
    new RegExp(`^## ${escaped}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"),
  );
  return stripPlaceholders(match?.[1] ?? "");
}

function getFieldValue(section: string, field: string): string {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = section.match(new RegExp(`^-\\s*${escaped}:[ \\t]*([^\\n]+)$`, "mi"));
  const value = stripPlaceholders(match?.[1] ?? "").trim();
  if (!value || value.includes("/") || value.includes("[") || value.includes("...")) {
    return "";
  }
  return value;
}

function normalizeStatus(value: string): string {
  const status = stripPlaceholders(value).toUpperCase();
  if (status.includes("EXCEÇÃO APROVADA")) return "EXCEÇÃO APROVADA";
  if (status.includes("EXCEÇÃO NÃO RECOMENDADA")) return "EXCEÇÃO NÃO RECOMENDADA";
  if (status.includes("PRONTO") && !status.includes("PARCIALMENTE")) return "PRONTO";
  if (status.includes("PARCIALMENTE PRONTO")) return "PARCIALMENTE PRONTO";
  if (status.includes("NÃO PRONTO")) return "NÃO PRONTO";
  return "";
}

function hasRealText(value: string): boolean {
  const text = stripPlaceholders(value).trim();
  return text.length > 0 && text !== "...";
}

function stripPlaceholders(value: string): string {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\.\.\./g, "")
    .trim();
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
    console.log(chalk.red(`  ✗ ${taskId} — ${result.errors.length} bloqueio(s):`));
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

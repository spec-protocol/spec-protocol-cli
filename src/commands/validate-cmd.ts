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
  DECISION_TAGS,
  DEFAULT_LANGUAGE,
  EXCEPTION_CHECKS,
  getArtifactLabel,
  getFieldValueByKey,
  getSectionTextByKey,
  getValidateLabels,
  hasRealText,
  normalizeStatus,
  type SupportedLanguage,
  type ValidateLabels,
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
  const labels = getValidateLabels(language);
  const infos = await getAllArtifactInfos(taskDir);
  const result = await buildValidationResult(
    taskId,
    infos,
    taskDir,
    language,
    labels,
  );

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return result.valid ? 0 : 1;
  }

  printValidationResult(result, labels);
  return result.valid ? 0 : 1;
}

async function buildValidationResult(
  taskId: string,
  infos: ArtifactInfo[],
  taskDir: string,
  language: SupportedLanguage,
  labels: ValidateLabels,
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const info of infos) {
    const { artifact, status } = info;
    const label = getArtifactLabel(artifact.id, language);

    if (artifact.critical && status !== "OK") {
      errors.push(labels.artifactCritical(artifact.file, label, status));
    } else if (!artifact.critical && status !== "OK") {
      warnings.push(labels.artifactRecommended(artifact.file, label, status));
    }
  }

  const spec = await readOptional(join(taskDir, "spec.md"));
  const plan = await readOptional(join(taskDir, "plan.md"));

  if (spec) {
    validateSpecContract(spec, errors, warnings, labels);
  }

  const specStatus = spec
    ? normalizeStatus(getSectionTextByKey(spec, "spec.readinessStatus"))
    : "";
  if (specStatus === "PRONTO" || specStatus === "EXCEÇÃO APROVADA") {
    if (plan) {
      validatePlanContract(plan, specStatus, errors, labels);
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
  labels: ValidateLabels,
): void {
  const classification = getSectionTextByKey(content, "spec.classification");
  const workType = getFieldValueByKey(classification, "spec.workType");
  const riskLevel = getFieldValueByKey(classification, "spec.riskLevel");
  const objective = getSectionTextByKey(content, "spec.objective");
  const status = normalizeStatus(
    getSectionTextByKey(content, "spec.readinessStatus"),
  );

  if (!workType) errors.push(labels.specNoWorkType);
  if (!riskLevel) errors.push(labels.specNoRiskLevel);
  if (!hasRealText(objective)) errors.push(labels.specNoObjective);
  if (!status) errors.push(labels.specNoReadinessStatus);

  if (status === "EXCEÇÃO APROVADA") {
    const decisions = getSectionTextByKey(content, "spec.confirmedDecisions");
    if (!hasRealText(decisions)) {
      errors.push(labels.specExceptionNoDecisions);
    }
  }

  const pending = getSectionTextByKey(content, "spec.pendingDecisions", {
    stripPlaceholders: false,
  });
  if (DECISION_TAGS.CRITICAL.test(pending) && status === "PRONTO") {
    warnings.push(labels.specReadyWithCriticalPending);
  }
}

function validatePlanContract(
  content: string,
  specStatus: string,
  errors: string[],
  labels: ValidateLabels,
): void {
  const decision = getSectionTextByKey(content, "plan.finalDecision");
  const planStatus = normalizeStatus(decision);
  const inputs = getSectionTextByKey(content, "plan.validatedInputs");
  const acceptance = getSectionTextByKey(content, "plan.acceptanceCriteria");

  if (!planStatus) errors.push(labels.planNoFinalStatus);
  if (!hasRealText(inputs)) errors.push(labels.planNoValidatedInputs);
  if (!hasRealText(acceptance)) {
    errors.push(labels.planNoAcceptanceCriteria);
  }

  if (specStatus === "EXCEÇÃO APROVADA") {
    const exception = getSectionTextByKey(content, "plan.exceptionMode");
    if (!hasRealText(exception)) {
      errors.push(labels.planNoExceptionMode);
    }
    if (!EXCEPTION_CHECKS.owner.test(exception)) {
      errors.push(labels.planExceptionNoOwner);
    }
    if (!EXCEPTION_CHECKS.risks.test(exception)) {
      errors.push(labels.planExceptionNoRisks);
    }
  }
}

function printValidationResult(
  result: ValidationResult,
  labels: ValidateLabels,
): void {
  console.log("");

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(chalk.green(`  ${labels.successTitle(result.taskId)}`));
    console.log(chalk.gray(`    ${labels.readyForExport(result.taskId)}`));
    console.log("");
    return;
  }

  if (result.errors.length > 0) {
    console.log(
      chalk.red(
        `  ${labels.blocksTitle(result.taskId, result.errors.length)}`,
      ),
    );
    console.log("");
    for (const err of result.errors) {
      console.log(chalk.red(`    ✗ ${err}`));
    }
    console.log("");
  }

  if (result.warnings.length > 0) {
    console.log(chalk.yellow(`  ${labels.warningsTitle(result.warnings.length)}`));
    for (const warn of result.warnings) {
      console.log(chalk.yellow(`    ~ ${warn}`));
    }
    console.log("");
  }

  if (!result.valid) {
    console.log(chalk.gray(`    ${labels.seeProgress(result.taskId)}`));
    console.log(chalk.gray(`    ${labels.ideHint}`));
    console.log("");
  }
}

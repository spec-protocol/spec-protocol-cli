import chalk from "chalk";
import {
  assertProtocolInitialized,
  getAllStageInfos,
  type StageInfo,
} from "../lib/task-progress.js";
import { pathExists } from "../lib/fs.js";
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

/** Etapas críticas obrigatórias para export */
const CRITICAL_STAGES = [1, 5];
/** Etapas recomendadas (aviso, não bloqueante) */
const RECOMMENDED_STAGES = [2, 3];

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

  const infos = await getAllStageInfos(taskDir);
  const result = buildValidationResult(taskId, infos);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return result.valid ? 0 : 1;
  }

  printValidationResult(result, taskId);
  return result.valid ? 0 : 1;
}

function buildValidationResult(
  taskId: string,
  infos: StageInfo[],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const info of infos) {
    const { stage, status } = info;

    if (CRITICAL_STAGES.includes(stage.num) && status !== "OK") {
      errors.push(
        `Etapa ${stage.num} (${stage.name}) está ${status} — obrigatória para export`,
      );
    } else if (RECOMMENDED_STAGES.includes(stage.num) && status !== "OK") {
      warnings.push(
        `Etapa ${stage.num} (${stage.name}) está ${status} — recomendada`,
      );
    }
  }

  return { taskId, valid: errors.length === 0, errors, warnings };
}

function printValidationResult(result: ValidationResult, taskId: string): void {
  console.log("");

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(chalk.green(`  ✓ ${taskId} — todas as etapas críticas preenchidas`));
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
    console.log("");
  }
}

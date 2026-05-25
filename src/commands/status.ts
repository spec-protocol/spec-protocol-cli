import chalk from "chalk";
import { join } from "node:path";
import { STAGES } from "../constants.js";
import {
  assertProtocolInitialized,
  getAllStageInfos,
  type StageInfo,
  type StageStatus,
} from "../lib/task-progress.js";
import { pathExists } from "../lib/fs.js";
import { getTaskDir } from "../lib/paths.js";
import { validateTaskId } from "../lib/validate.js";

export async function runStatus(
  taskId: string,
  cwd: string = process.cwd(),
): Promise<void> {
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
  const completedCount = infos.filter((i) => i.status === "OK").length;

  console.log("");
  console.log(
    chalk.bold.cyan(`  Tarefa: ${taskId}`) +
      chalk.gray(`  (${completedCount}/${STAGES.length} etapas OK)`),
  );
  console.log(chalk.gray("  " + "─".repeat(60)));
  console.log("");

  for (const info of infos) {
    printStageRow(info, taskDir, cwd);
  }

  console.log("");
  printNextAction(infos, taskId);
  console.log("");
}

function printStageRow(info: StageInfo, taskDir: string, cwd: string): void {
  const { stage, status, artifactPath, answerPath } = info;
  const icon = statusIcon(status);
  const label = statusLabel(status);

  const relArtifact = artifactPath.replace(cwd + "/", "");
  const relAnswer = answerPath.replace(cwd + "/", "");

  console.log(`  ${icon} ${chalk.bold(`Etapa ${stage.num}`)} — ${stage.name}  ${label}`);
  console.log(`     ${chalk.gray("artifact:")} ${chalk.dim(relArtifact)}`);
  console.log(`     ${chalk.gray("answer:  ")} ${chalk.dim(relAnswer)}`);
  console.log("");
}

function statusIcon(s: StageStatus): string {
  if (s === "OK") return chalk.green("✓");
  if (s === "RASCUNHO") return chalk.yellow("~");
  return chalk.red("✗");
}

function statusLabel(s: StageStatus): string {
  if (s === "OK") return chalk.green("[OK]");
  if (s === "RASCUNHO") return chalk.yellow("[RASCUNHO]");
  return chalk.gray("[PENDENTE]");
}

function printNextAction(infos: StageInfo[], taskId: string): void {
  const next = infos.find((i) => i.status !== "OK");

  if (!next) {
    console.log(
      chalk.green("  ✓ Todas as etapas preenchidas!"),
    );
    console.log(
      chalk.gray(`    Próximo passo: spec-protocol validate ${taskId}`),
    );
    return;
  }

  console.log(chalk.yellow(`  → Próxima ação:`));
  console.log(
    chalk.white(
      `    Etapa ${next.stage.num} ${next.status === "RASCUNHO" ? "(rascunho)" : "pendente"} — cole a saída da IA no arquivo de resposta:`,
    ),
  );
  console.log(
    chalk.cyan(
      `    .spec-protocol/tasks/${taskId}/answers/${next.stage.answer}`,
    ),
  );
  console.log(
    chalk.gray(
      `    Ou abra direto: spec-protocol open ${taskId} --stage ${next.stage.num} --answer`,
    ),
  );
}

import chalk from "chalk";
import { ARTIFACTS } from "../constants.js";
import {
  assertProtocolInitialized,
  getAllArtifactInfos,
  type ArtifactInfo,
  type ArtifactStatus,
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

  const infos = await getAllArtifactInfos(taskDir);
  const completedCount = infos.filter((i) => i.status === "OK").length;

  console.log("");
  console.log(
    chalk.bold.cyan(`  Tarefa: ${taskId}`) +
      chalk.gray(`  (${completedCount}/${ARTIFACTS.length} artefatos OK)`),
  );
  console.log(chalk.gray("  " + "─".repeat(60)));
  console.log("");

  for (const info of infos) {
    printArtifactRow(info, cwd);
  }

  console.log("");
  printNextAction(infos, taskId);
  console.log("");
}

function printArtifactRow(info: ArtifactInfo, cwd: string): void {
  const { artifact, status, path } = info;
  const icon = statusIcon(status);
  const label = statusLabel(status);
  const relPath = path.replace(cwd + "/", "");
  const critical = artifact.critical ? chalk.gray(" [crítico]") : "";

  console.log(
    `  ${icon} ${chalk.bold(artifact.file)} — ${artifact.name}${critical}  ${label}`,
  );
  console.log(`     ${chalk.dim(relPath)}`);
  console.log("");
}

function statusIcon(s: ArtifactStatus): string {
  if (s === "OK") return chalk.green("✓");
  if (s === "RASCUNHO") return chalk.yellow("~");
  return chalk.red("✗");
}

function statusLabel(s: ArtifactStatus): string {
  if (s === "OK") return chalk.green("[OK]");
  if (s === "RASCUNHO") return chalk.yellow("[RASCUNHO]");
  return chalk.gray("[PENDENTE]");
}

function printNextAction(infos: ArtifactInfo[], taskId: string): void {
  const next = infos.find((i) => i.status !== "OK");

  if (!next) {
    console.log(chalk.green("  ✓ Todos os artefatos preenchidos!"));
    console.log(
      chalk.gray(`    Próximo passo: spec-protocol validate ${taskId}`),
    );
    return;
  }

  console.log(chalk.yellow(`  → Próxima ação:`));
  console.log(
    chalk.white(
      `    ${next.artifact.file} ${next.status === "RASCUNHO" ? "(rascunho)" : "pendente"} — refine na IDE com skills RTA`,
    ),
  );
  console.log(
    chalk.cyan(`    .spec-protocol/tasks/${taskId}/${next.artifact.file}`),
  );
  console.log(
    chalk.gray(`    Guia: @rta-triagem  |  Abrir: spec-protocol open ${taskId}`),
  );
}

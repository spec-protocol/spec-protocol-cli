import chalk from "chalk";
import { ARTIFACTS } from "../constants.js";
import {
  assertProtocolInitialized,
  getAllArtifactInfos,
  type ArtifactInfo,
  type ArtifactStatus,
} from "../lib/task-progress.js";
import { pathExists } from "../lib/fs.js";
import { getArtifactLabel, getStatusLabels, type StatusLabels } from "../lib/i18n.js";
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
      `Task "${taskId}" not found. Run: spec-protocol new ${taskId}`,
    );
  }

  const labels = getStatusLabels();
  const infos = await getAllArtifactInfos(taskDir);
  const completedCount = infos.filter((i) => i.status === "OK").length;

  console.log("");
  console.log(
    chalk.bold.cyan(`  ${labels.taskHeader(taskId, completedCount, ARTIFACTS.length)}`),
  );
  console.log(chalk.gray("  " + "─".repeat(60)));
  console.log("");

  for (const info of infos) {
    printArtifactRow(info, cwd, labels);
  }

  console.log("");
  printNextAction(infos, taskId, labels);
  console.log("");
}

function printArtifactRow(
  info: ArtifactInfo,
  cwd: string,
  labels: StatusLabels,
): void {
  const { artifact, status, path } = info;
  const icon = statusIcon(status);
  const label = statusLabel(status, labels);
  const relPath = path.replace(cwd + "/", "");
  const critical = artifact.critical ? chalk.gray(labels.criticalBadge) : "";
  const artifactLabel = getArtifactLabel(artifact.id);

  console.log(
    `  ${icon} ${chalk.bold(artifact.file)} — ${artifactLabel}${critical}  ${label}`,
  );
  console.log(`     ${chalk.dim(relPath)}`);
  console.log("");
}

function statusIcon(s: ArtifactStatus): string {
  if (s === "OK") return chalk.green("✓");
  if (s === "RASCUNHO") return chalk.yellow("~");
  return chalk.red("✗");
}

function statusLabel(s: ArtifactStatus, labels: StatusLabels): string {
  if (s === "OK") return chalk.green(labels.statusOk);
  if (s === "RASCUNHO") return chalk.yellow(labels.statusDraft);
  return chalk.gray(labels.statusPending);
}

function printNextAction(
  infos: ArtifactInfo[],
  taskId: string,
  labels: StatusLabels,
): void {
  const next = infos.find((i) => i.status !== "OK");

  if (!next) {
    console.log(chalk.green(`  ${labels.allFilled}`));
    console.log(chalk.gray(`    ${labels.nextValidate(taskId)}`));
    return;
  }

  console.log(chalk.yellow(`  ${labels.nextActionTitle}`));
  console.log(
    chalk.white(
      `    ${
        next.status === "RASCUNHO"
          ? labels.nextActionDraft(next.artifact.file)
          : labels.nextActionPending(next.artifact.file)
      }`,
    ),
  );
  console.log(
    chalk.cyan(`    .spec-protocol/tasks/${taskId}/${next.artifact.file}`),
  );
  console.log(
    chalk.gray(`    ${labels.refineHint} ${labels.openHint(taskId)}`),
  );
}

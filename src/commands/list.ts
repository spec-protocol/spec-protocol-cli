import chalk from "chalk";
import { getListLabels, getDateLocale } from "../lib/i18n.js";
import {
  assertProtocolInitialized,
  getTaskIds,
  getTaskSummary,
} from "../lib/task-progress.js";

export async function runList(cwd: string = process.cwd()): Promise<void> {
  await assertProtocolInitialized(cwd);

  const labels = getListLabels();
  const dateLocale = getDateLocale();
  const ids = await getTaskIds(cwd);

  if (ids.length === 0) {
    console.log(chalk.yellow(labels.empty));
    console.log(chalk.gray(`  ${labels.emptyHint}`));
    console.log("");
    return;
  }

  console.log("");
  console.log(
    chalk.bold(
      `  ${labels.headerId.padEnd(24)} ${labels.headerCreated.padEnd(12)} ${labels.headerProgress.padEnd(10)} ${labels.headerArtifacts}`,
    ),
  );
  console.log(chalk.gray("  " + "─".repeat(62)));

  for (const id of ids) {
    const summary = await getTaskSummary(cwd, id);

    const dateStr = summary.createdAt
      ? summary.createdAt.toLocaleDateString(dateLocale, {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "—";

    const bar = buildProgressBar(summary.percentComplete);
    const pct = `${summary.percentComplete}%`.padStart(4);
    const stagesStr = `${summary.completedCount}/${summary.totalCount}`;

    console.log(
      `  ${chalk.cyan(id.padEnd(24))} ${dateStr.padEnd(12)} ${bar} ${chalk.bold(pct)}  ${chalk.gray(stagesStr)}`,
    );
  }

  console.log("");
  console.log(chalk.gray(`  ${labels.taskCount(ids.length)}`));
  console.log(chalk.gray(`  ${labels.detailsHint}`));
  console.log("");
}

function buildProgressBar(pct: number): string {
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  if (pct === 100) return chalk.green(bar);
  if (pct >= 60) return chalk.yellow(bar);
  return chalk.red(bar);
}

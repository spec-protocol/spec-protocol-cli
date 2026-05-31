import chalk from "chalk";
import { assertProtocolInitialized, getTaskIds, getTaskSummary } from "../lib/task-progress.js";

export async function runList(cwd: string = process.cwd()): Promise<void> {
  await assertProtocolInitialized(cwd);

  const ids = await getTaskIds(cwd);

  if (ids.length === 0) {
    console.log(chalk.yellow("Nenhuma tarefa encontrada."));
    console.log(chalk.gray("  Crie uma com: spec-protocol new <ID-DA-TAREFA>"));
    console.log("");
    return;
  }

  console.log("");
  console.log(
    chalk.bold(
      `  ${"ID".padEnd(24)} ${"Criada em".padEnd(12)} ${"Progresso".padEnd(10)} Artefatos`,
    ),
  );
  console.log(chalk.gray("  " + "─".repeat(62)));

  for (const id of ids) {
    const summary = await getTaskSummary(cwd, id);

    const dateStr = summary.createdAt
      ? summary.createdAt.toLocaleDateString("pt-BR", {
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
  console.log(chalk.gray(`  ${ids.length} tarefa(s) encontrada(s).`));
  console.log(chalk.gray("  Detalhes: spec-protocol status <ID>"));
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

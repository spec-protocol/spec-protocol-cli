import chalk from "chalk";
import { join } from "node:path";
import {
  ANSWER_PLACEHOLDER,
  STAGES,
  SUMMARY_TEMPLATE,
} from "../constants.js";
import { pathExists, ensureDir, copyDirFiles, writeTextFile } from "../lib/fs.js";
import { getProtocolRoot, getTaskDir, getTemplatesDir } from "../lib/paths.js";
import { validateTaskId } from "../lib/validate.js";

function answerTemplate(stageNum: number, stageName: string): string {
  return `# Resposta — Etapa ${stageNum} — ${stageName}\n${ANSWER_PLACEHOLDER}\n`;
}

export async function runNew(
  taskId: string,
  cwd: string = process.cwd(),
): Promise<void> {
  const idError = validateTaskId(taskId);
  if (idError) {
    throw new Error(idError);
  }

  const protocolRoot = getProtocolRoot(cwd);
  if (!(await pathExists(protocolRoot))) {
    throw new Error(
      'Protocolo não inicializado. Execute primeiro: spec-protocol init',
    );
  }

  const taskDir = getTaskDir(cwd, taskId);
  if (await pathExists(taskDir)) {
    throw new Error(`Tarefa "${taskId}" já existe em .spec-protocol/tasks/${taskId}`);
  }

  const templatesDir = getTemplatesDir();
  if (!(await pathExists(templatesDir))) {
    throw new Error(`Templates não encontrados em: ${templatesDir}`);
  }

  const artifactsDir = join(taskDir, "artifacts");
  const answersDir = join(taskDir, "answers");

  await ensureDir(artifactsDir);
  await ensureDir(answersDir);

  await copyDirFiles(templatesDir, artifactsDir, (name) => name.endsWith(".md"));

  for (const stage of STAGES) {
    await writeTextFile(
      join(answersDir, stage.answer),
      answerTemplate(stage.num, stage.name),
    );
  }

  await writeTextFile(join(taskDir, "summary.md"), SUMMARY_TEMPLATE);

  console.log(chalk.green(`✓ Tarefa criada: .spec-protocol/tasks/${taskId}/`));
  console.log(chalk.gray("  artifacts/ — templates para rodar na IA"));
  console.log(chalk.gray("  answers/   — cole aqui as respostas da IA"));
  console.log("");
}

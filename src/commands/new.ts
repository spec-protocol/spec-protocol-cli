import chalk from "chalk";
import { join } from "node:path";
import { ARTIFACTS } from "../constants.js";
import { readConfig } from "../lib/config.js";
import { pathExists, ensureDir, readTextFile, writeTextFile } from "../lib/fs.js";
import {
  DEFAULT_LANGUAGE,
  getArtifactLabel,
  type SupportedLanguage,
} from "../lib/i18n.js";
import { getProtocolRoot, getTaskDir, getTemplatesDir } from "../lib/paths.js";
import { validateTaskId } from "../lib/validate.js";

async function loadArtifactTemplate(
  filename: string,
  taskId: string,
  language: SupportedLanguage,
): Promise<string> {
  const templatePath = join(getTemplatesDir(language), filename);
  if (!(await pathExists(templatePath))) {
    throw new Error(`Template não encontrado: ${templatePath}`);
  }
  const raw = await readTextFile(templatePath);
  return raw.replace(/\[TASK-ID\]/g, taskId);
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

  const config = await readConfig(cwd);
  const language = config?.language ?? DEFAULT_LANGUAGE;

  const taskDir = getTaskDir(cwd, taskId);
  if (await pathExists(taskDir)) {
    throw new Error(`Tarefa "${taskId}" já existe em .spec-protocol/tasks/${taskId}`);
  }

  const templatesDir = getTemplatesDir(language);
  if (!(await pathExists(templatesDir))) {
    throw new Error(`Templates não encontrados em: ${templatesDir}`);
  }

  await ensureDir(taskDir);

  for (const artifact of ARTIFACTS) {
    const content = await loadArtifactTemplate(artifact.file, taskId, language);
    await writeTextFile(join(taskDir, artifact.file), content);
  }

  console.log(chalk.green(`✓ Tarefa criada: .spec-protocol/tasks/${taskId}/`));
  for (const artifact of ARTIFACTS) {
    console.log(
      chalk.gray(
        `  ${artifact.file} — ${getArtifactLabel(artifact.id, language)}`,
      ),
    );
  }
  console.log("");
  console.log(chalk.gray("  Na IDE: @rta-triagem com o card do Jira"));
  console.log(chalk.gray("  Atualize spec.md / plan.md / tasks.md conforme as skills orientarem"));
  console.log("");
}

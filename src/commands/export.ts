import chalk from "chalk";
import { dirname } from "node:path";
import { readConfig } from "../lib/config.js";
import { buildSpecKitInput } from "../lib/export-builder.js";
import { ensureDir, pathExists, writeTextFile } from "../lib/fs.js";
import {
  getExportPath,
  getTaskDir,
  getProtocolRoot,
} from "../lib/paths.js";
import { validateTaskId } from "../lib/validate.js";

export async function runExport(
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
  if (!(await pathExists(taskDir))) {
    throw new Error(
      `Tarefa "${taskId}" não encontrada. Execute: spec-protocol new ${taskId}`,
    );
  }

  const config = await readConfig(cwd);
  const content = await buildSpecKitInput({ taskId, taskDir, config });
  const exportPath = getExportPath(cwd, taskId);

  await ensureDir(dirname(exportPath));
  await writeTextFile(exportPath, content);

  console.log(chalk.green(`✓ Export gerado:`));
  console.log(chalk.cyan(`  .spec-protocol/exports/${taskId}/spec-kit-input.md`));
  console.log("");
}

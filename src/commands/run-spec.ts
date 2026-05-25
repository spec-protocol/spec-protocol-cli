import chalk from "chalk";
import { readConfig } from "../lib/config.js";
import { pathExists } from "../lib/fs.js";
import {
  getExportPath,
  getProtocolRoot,
  resolveAbsolute,
} from "../lib/paths.js";
import { runSpecKit } from "../lib/run-spec.js";
import { validateTaskId } from "../lib/validate.js";

export async function runRunSpec(
  taskId: string,
  cwd: string = process.cwd(),
): Promise<number> {
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

  const exportPath = getExportPath(cwd, taskId);
  if (!(await pathExists(exportPath))) {
    throw new Error(
      `Export não encontrado para "${taskId}". Execute: spec-protocol export ${taskId}`,
    );
  }

  const config = await readConfig(cwd);
  if (!config) {
    throw new Error(
      "config.json não encontrado. Execute spec-protocol init.",
    );
  }

  const absoluteInput = resolveAbsolute(exportPath);
  console.log(
    chalk.gray(
      `Executando: ${config.specKit.command} ${[...config.specKit.args, absoluteInput].join(" ")}`,
    ),
  );
  console.log("");

  return runSpecKit(config, absoluteInput);
}

import chalk from "chalk";
import { spawn } from "node:child_process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { STAGES } from "../constants.js";
import {
  assertProtocolInitialized,
  getAllStageInfos,
} from "../lib/task-progress.js";
import { pathExists } from "../lib/fs.js";
import { getTaskDir } from "../lib/paths.js";
import { validateTaskId } from "../lib/validate.js";

const execFileAsync = promisify(execFile);

export interface OpenOptions {
  stage?: number;
  answer?: boolean;
}

export async function runOpen(
  taskId: string,
  options: OpenOptions = {},
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

  // Determina a etapa alvo
  let targetStageNum: number;
  if (options.stage !== undefined) {
    targetStageNum = options.stage;
    if (targetStageNum < 1 || targetStageNum > STAGES.length) {
      throw new Error(`Etapa inválida: ${targetStageNum}. Use 1 a ${STAGES.length}.`);
    }
  } else {
    const next = infos.find((i) => i.status !== "OK");
    if (!next) {
      // Todas OK — abre a última etapa
      targetStageNum = STAGES.length;
    } else {
      targetStageNum = next.stage.num;
    }
  }

  const targetInfo = infos.find((i) => i.stage.num === targetStageNum)!;
  const filePath = options.answer ? targetInfo.answerPath : targetInfo.artifactPath;

  if (!(await pathExists(filePath))) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }

  const editor = await detectEditor();
  console.log(chalk.gray(`  Abrindo com ${editor}: ${filePath}`));

  await openWithEditor(editor, filePath);
}

async function detectEditor(): Promise<string> {
  // 1. $EDITOR env var
  if (process.env.EDITOR) return process.env.EDITOR;

  // 2. cursor
  try {
    await execFileAsync("cursor", ["--version"]);
    return "cursor";
  } catch {}

  // 3. code (VS Code)
  try {
    await execFileAsync("code", ["--version"]);
    return "code";
  } catch {}

  // 4. macOS open (fallback universal)
  return "open";
}

function openWithEditor(editor: string, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(editor, [filePath], {
      detached: true,
      stdio: "ignore",
      shell: false,
    });
    child.unref();
    child.on("error", reject);
    // Não espera o processo fechar — apenas lança e retorna
    resolve();
  });
}

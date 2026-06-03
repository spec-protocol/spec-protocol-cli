import chalk from "chalk";
import { spawn } from "node:child_process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { ARTIFACTS } from "../constants.js";
import {
  assertProtocolInitialized,
  getNextIncompleteArtifact,
} from "../lib/task-progress.js";
import { pathExists } from "../lib/fs.js";
import { getTaskDir } from "../lib/paths.js";
import { validateTaskId } from "../lib/validate.js";

const execFileAsync = promisify(execFile);

export interface OpenOptions {
  artifact?: string;
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
      `Task "${taskId}" not found. Run: spec-protocol new ${taskId}`,
    );
  }

  let filePath: string;

  if (options.artifact) {
    const found = ARTIFACTS.find(
      (a) => a.id === options.artifact || a.file === options.artifact,
    );
    if (!found) {
      throw new Error(
        `Invalid artifact: ${options.artifact}. Use: spec, plan, tasks`,
      );
    }
    filePath = `${taskDir}/${found.file}`;
  } else {
    const next = await getNextIncompleteArtifact(taskDir);
    if (next) {
      filePath = next.path;
    } else {
      filePath = `${taskDir}/spec.md`;
    }
  }

  if (!(await pathExists(filePath))) {
    throw new Error(`File not found: ${filePath}`);
  }

  const editor = await detectEditor();
  console.log(chalk.gray(`  Opening with ${editor}: ${filePath}`));

  await openWithEditor(editor, filePath);
}

async function detectEditor(): Promise<string> {
  if (process.env.EDITOR) return process.env.EDITOR;

  try {
    await execFileAsync("cursor", ["--version"]);
    return "cursor";
  } catch {}

  try {
    await execFileAsync("code", ["--version"]);
    return "code";
  } catch {}

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
    resolve();
  });
}

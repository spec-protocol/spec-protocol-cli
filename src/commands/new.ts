import chalk from "chalk";
import { join } from "node:path";
import { ARTIFACTS } from "../constants.js";
import { pathExists, ensureDir, readTextFile, writeTextFile } from "../lib/fs.js";
import { getArtifactLabel } from "../lib/i18n.js";
import { getProtocolRoot, getTaskDir, getTemplatesDir } from "../lib/paths.js";
import { validateTaskId } from "../lib/validate.js";

async function loadArtifactTemplate(
  filename: string,
  taskId: string,
): Promise<string> {
  const templatePath = join(getTemplatesDir(), filename);
  if (!(await pathExists(templatePath))) {
    throw new Error(`Template not found: ${templatePath}`);
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
      "Protocol not initialized. Run first: spec-protocol init",
    );
  }

  const taskDir = getTaskDir(cwd, taskId);
  if (await pathExists(taskDir)) {
    throw new Error(
      `Task "${taskId}" already exists in .spec-protocol/tasks/${taskId}`,
    );
  }

  const templatesDir = getTemplatesDir();
  if (!(await pathExists(templatesDir))) {
    throw new Error(`Templates not found at: ${templatesDir}`);
  }

  await ensureDir(taskDir);

  for (const artifact of ARTIFACTS) {
    const content = await loadArtifactTemplate(artifact.file, taskId);
    await writeTextFile(join(taskDir, artifact.file), content);
  }

  console.log(chalk.green(`✓ Task created: .spec-protocol/tasks/${taskId}/`));
  for (const artifact of ARTIFACTS) {
    console.log(
      chalk.gray(
        `  ${artifact.file} — ${getArtifactLabel(artifact.id)}`,
      ),
    );
  }
  console.log("");
  console.log(chalk.gray("  In IDE: @spec-protocol-triage with the ticket/card"));
  console.log(
    chalk.gray("  Update spec.md / plan.md / tasks.md as skills guide you"),
  );
  console.log("");
}

import chalk from "chalk";
import { relative } from "node:path";
import { ARTIFACTS } from "../constants.js";
import {
  assertProtocolInitialized,
  getAllArtifactInfos,
  getNextIncompleteArtifact,
} from "../lib/task-progress.js";
import { pathExists, readTextFile, writeTextFile } from "../lib/fs.js";
import { getContextLabels, hasSpecClassification } from "../lib/i18n.js";
import { getTaskDir } from "../lib/paths.js";
import { validateTaskId } from "../lib/validate.js";

export interface ContextOptions {
  artifact?: string;
  save?: boolean;
}

export async function runContext(
  taskId: string,
  options: ContextOptions = {},
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

  const labels = getContextLabels();
  const infos = await getAllArtifactInfos(taskDir);

  let targetArtifactId: string;
  if (options.artifact) {
    const found = ARTIFACTS.find(
      (a) => a.id === options.artifact || a.file === options.artifact,
    );
    if (!found) {
      throw new Error(
        `Invalid artifact: ${options.artifact}. Use: spec, plan, tasks`,
      );
    }
    targetArtifactId = found.id;
  } else {
    const next = await getNextIncompleteArtifact(taskDir);
    if (!next) {
      console.log(chalk.green(`  ✓ ${labels.allFilled}`));
      console.log(chalk.gray(`    ${labels.nextValidate} ${taskId}`));
      console.log("");
      return;
    }
    targetArtifactId = next.artifact.id;
  }

  const targetInfo = infos.find((i) => i.artifact.id === targetArtifactId)!;
  const specContent = await readOptional(`${taskDir}/spec.md`);
  const contextContent = buildContextGuide({
    taskId,
    artifact: targetInfo.artifact,
    artifactPath: targetInfo.path,
    allInfos: infos,
    specContent,
    cwd,
  });

  if (options.save) {
    const savePath = `${taskDir}/context-${targetInfo.artifact.id}.md`;
    await writeTextFile(savePath, contextContent);
    console.log(chalk.green(`  ✓ Guide saved to:`));
    console.log(
      chalk.cyan(
        `    .spec-protocol/tasks/${taskId}/context-${targetInfo.artifact.id}.md`,
      ),
    );
    console.log("");
  } else {
    console.log("");
    console.log(contextContent);
  }
}

function buildContextGuide(opts: {
  taskId: string;
  artifact: (typeof ARTIFACTS)[number];
  artifactPath: string;
  allInfos: Awaited<ReturnType<typeof getAllArtifactInfos>>;
  specContent: string | null;
  cwd: string;
}): string {
  const { taskId, artifact, artifactPath, allInfos, specContent, cwd } = opts;
  const labels = getContextLabels();
  const relArtifact = relative(cwd, artifactPath);
  const filledOthers = allInfos
    .filter((i) => i.artifact.id !== artifact.id && i.status === "OK")
    .map((i) => relative(cwd, i.path));

  const skillHint = skillForArtifact(artifact.id, specContent);

  const lines: string[] = [
    `# ${labels.title} — ${taskId} / ${artifact.file}`,
    `> ${labels.generatedBy}`,
    "",
    `## ${labels.skillSection}`,
    "",
    `- **${labels.entryPoint}:** \`@spec-protocol-triage\``,
    `- **${labels.forArtifact}:** \`${skillHint}\``,
    "",
    `## ${labels.filesSection}`,
    "",
    `- **${labels.targetArtifact}:** \`@${relArtifact}\``,
  ];

  if (filledOthers.length > 0) {
    lines.push(`- **${labels.otherArtifacts}:**`);
    for (const p of filledOthers) {
      lines.push(`  - \`@${p}\``);
    }
  }

  lines.push("", `## ${labels.instructionSection}`, "");
  for (const paragraph of labels.instructionBody) {
    lines.push(paragraph);
  }
  lines.push(labels.copyOutput.replace("{artifact}", `\`${relArtifact}\``), "");

  lines.push(
    `## ${labels.afterSection}`,
    "",
    `\`spec-protocol status ${taskId}\``,
    `\`spec-protocol validate ${taskId}\` ${labels.validateWhenReady}`,
  );

  return lines.join("\n");
}

async function readOptional(path: string): Promise<string | null> {
  try {
    return await readTextFile(path);
  } catch {
    return null;
  }
}

function skillForArtifact(id: string, specContent: string | null): string {
  const hints = getContextLabels().skillHints;

  switch (id) {
    case "spec":
      return hasSpecClassification(specContent)
        ? hints.specWithClassification
        : hints.specNoClassification;
    case "plan":
      return hints.plan;
    case "tasks":
      return hints.tasks;
    default:
      return "@spec-protocol-triage";
  }
}

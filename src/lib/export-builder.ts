import { join } from "node:path";
import { ARTIFACTS } from "../constants.js";
import { readTextFile } from "./fs.js";
import type { ProtocolConfig } from "./config.js";
import { getArtifactLabel, getExportLabels } from "./i18n.js";

function isPlaceholderOnly(content: string): boolean {
  const stripped = content
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^#.*$/gm, "")
    .replace(/^##.*$/gm, "")
    .replace(/^\s*-\s+[^:\n]+:\s*$/gm, "")
    .replace(/^- \[ \].*$/gm, "")
    .replace(/^\[TASK-ID\]/g, "")
    .trim();
  return stripped.length === 0;
}

function section(title: string, body: string | null, emptyLabel: string): string {
  if (!body || isPlaceholderOnly(body)) {
    return `## ${title}\n\n${emptyLabel}\n`;
  }
  return `## ${title}\n\n${body.trim()}\n`;
}

async function readArtifact(
  taskDir: string,
  filename: string,
): Promise<string | null> {
  try {
    return await readTextFile(join(taskDir, filename));
  } catch {
    return null;
  }
}

export async function buildSpecKitInput(options: {
  taskId: string;
  taskDir: string;
  config: ProtocolConfig | null;
}): Promise<string> {
  const { taskId, taskDir, config } = options;
  const labels = getExportLabels();
  const exportedAt = new Date().toISOString();

  const spec = await readArtifact(taskDir, "spec.md");
  const plan = await readArtifact(taskDir, "plan.md");
  const tasks = await readArtifact(taskDir, "tasks.md");

  const meta = [
    `# ${labels.title}`,
    "",
    `## ${labels.metadata}`,
    "",
    `- **${labels.task}:** ${taskId}`,
    `- **${labels.squad}:** ${config?.squad ?? "—"}`,
    `- **${labels.ide}:** ${config?.ide ?? "—"}`,
    `- **${labels.exportedAt}:** ${exportedAt}`,
    "",
  ].join("\n");

  const parts = [
    meta,
    section(labels.specSection, spec, labels.emptySection),
    section(labels.planSection, plan, labels.emptySection),
    section(labels.tasksSection, tasks, labels.emptySection),
    `## ${labels.appendix}`,
    "",
  ];

  for (const artifact of ARTIFACTS) {
    const content = await readArtifact(taskDir, artifact.file);
    parts.push(
      `### ${getArtifactLabel(artifact.id)} — ${artifact.file}`,
    );
    parts.push("");
    if (content && !isPlaceholderOnly(content)) {
      parts.push(content.trim());
    } else {
      parts.push(labels.notFilled);
    }
    parts.push("");
  }

  parts.push("---");
  parts.push("");
  parts.push(labels.footer);

  return parts.join("\n");
}

export { isPlaceholderOnly };

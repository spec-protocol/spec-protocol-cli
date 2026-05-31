import { join } from "node:path";
import { ARTIFACTS } from "../constants.js";
import { readTextFile } from "./fs.js";
import type { ProtocolConfig } from "./config.js";

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

function section(title: string, body: string | null): string {
  if (!body || isPlaceholderOnly(body)) {
    return `## ${title}\n\n_(sem conteúdo preenchido)_\n`;
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
  const exportedAt = new Date().toISOString();

  const spec = await readArtifact(taskDir, "spec.md");
  const plan = await readArtifact(taskDir, "plan.md");
  const tasks = await readArtifact(taskDir, "tasks.md");

  const meta = [
    "# Spec-Kit Input — RTA / AI Spec Protocol",
    "",
    "## Metadados",
    "",
    `- **Tarefa:** ${taskId}`,
    `- **Squad:** ${config?.squad ?? "—"}`,
    `- **IDE:** ${config?.ide ?? "—"}`,
    `- **Exportado em:** ${exportedAt}`,
    "",
  ].join("\n");

  const parts = [
    meta,
    section("Especificação consolidada (spec.md)", spec),
    section("Plano técnico (plan.md)", plan),
    section("Checklist de implementação (tasks.md)", tasks),
    "## Anexo — Artefatos completos",
    "",
  ];

  for (const artifact of ARTIFACTS) {
    const content = await readArtifact(taskDir, artifact.file);
    parts.push(`### ${artifact.name} — ${artifact.file}`);
    parts.push("");
    if (content && !isPlaceholderOnly(content)) {
      parts.push(content.trim());
    } else {
      parts.push("_(não preenchido)_");
    }
    parts.push("");
  }

  parts.push("---");
  parts.push("");
  parts.push(
    "_Gerado por spec-protocol export. Use como insumo para GitHub Spec-Kit._",
  );

  return parts.join("\n");
}

export { isPlaceholderOnly };

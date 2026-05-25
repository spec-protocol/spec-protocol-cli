import { join } from "node:path";
import { STAGES, ANSWER_PLACEHOLDER } from "../constants.js";
import { readTextFile } from "./fs.js";
import type { ProtocolConfig } from "./config.js";

function isPlaceholderOnly(content: string): boolean {
  const stripped = content
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^#.*$/gm, "")
    .trim();
  return stripped.length === 0;
}

function section(title: string, body: string | null): string {
  if (!body || isPlaceholderOnly(body)) {
    return `## ${title}\n\n_(sem conteúdo preenchido)_\n`;
  }
  return `## ${title}\n\n${body.trim()}\n`;
}

async function readAnswer(
  answersDir: string,
  filename: string,
): Promise<string | null> {
  try {
    return await readTextFile(join(answersDir, filename));
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
  const answersDir = join(taskDir, "answers");
  const exportedAt = new Date().toISOString();

  const answers: Record<number, string | null> = {};
  for (const stage of STAGES) {
    answers[stage.num] = await readAnswer(answersDir, stage.answer);
  }

  const meta = [
    "# Spec-Kit Input — AI Spec Protocol",
    "",
    "## Metadados",
    "",
    `- **Tarefa:** ${taskId}`,
    `- **Squad:** ${config?.squad ?? "—"}`,
    `- **IDE:** ${config?.ide ?? "—"}`,
    `- **Exportado em:** ${exportedAt}`,
    "",
  ].join("\n");

  const resumo =
    answers[1] ?? answers[2]
      ? [answers[1], answers[2]].filter(Boolean).join("\n\n---\n\n")
      : null;

  const mapa = [answers[1], answers[2]].filter(Boolean).join("\n\n") || null;
  const dor = answers[3];
  const devolutiva = answers[4];
  const revalidacao = answers[5];

  const parts = [
    meta,
    section("Resumo da demanda", resumo),
    section("Mapa de módulos e arquivos afetados", mapa),
    section("Status Definition of Ready (Etapa 3)", dor),
    section("Devolutiva ao PO (Etapa 4)", devolutiva),
    section("Critérios de aceite finais (Etapa 5)", revalidacao),
    section("Checklist técnica de implementação (Etapa 5)", revalidacao),
    "## Anexo — Respostas completas por etapa",
    "",
  ];

  for (const stage of STAGES) {
    const content = answers[stage.num];
    parts.push(`### Etapa ${stage.num} — ${stage.name}`);
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

export { isPlaceholderOnly, ANSWER_PLACEHOLDER };

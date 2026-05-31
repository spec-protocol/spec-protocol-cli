export const PROTOCOL_DIR = ".spec-protocol";

/** Pasta legada (pré-migração), sem ponto inicial. */
export const LEGACY_PROTOCOL_DIR = "spec-protocol";

export const AGENTS_DIR = ".agents";
export const AGENTS_SKILLS_DIR = ".agents/skills";

export const TASK_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

export const IDE_OPTIONS = [
  "Cursor",
  "VS Code",
  "JetBrains",
  "Outro",
] as const;

export type IdeOption = (typeof IDE_OPTIONS)[number];

export interface ArtifactDefinition {
  id: "spec" | "plan" | "tasks";
  file: string;
  /** Bloqueia export se não preenchido */
  critical: boolean;
}

export const ARTIFACTS: ArtifactDefinition[] = [
  {
    id: "spec",
    file: "spec.md",
    critical: true,
  },
  {
    id: "plan",
    file: "plan.md",
    critical: true,
  },
  {
    id: "tasks",
    file: "tasks.md",
    critical: false,
  },
];

/** Skills RTA instaladas em .agents/skills pelo init */
export const RTA_SKILL_DIRS = [
  "rta-triagem",
  "rta-analise",
  "rta-dor",
  "rta-po",
  "rta-revalidacao",
  "rta-plan",
  "rta-excecao",
] as const;

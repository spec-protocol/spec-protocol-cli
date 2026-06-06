export const PROTOCOL_DIR = ".spec-protocol";

/** Legacy folder (pre-migration), no leading dot. */
export const LEGACY_PROTOCOL_DIR = "spec-protocol";

export const AGENTS_DIR = ".agents";
export const AGENTS_SKILLS_DIR = ".agents/skills";

export const TASK_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

export const IDE_OPTIONS = [
  "Cursor",
  "VS Code",
  "JetBrains",
  "Other",
] as const;

export type IdeOption = (typeof IDE_OPTIONS)[number];

export interface ArtifactDefinition {
  id: "spec" | "plan" | "tasks";
  file: string;
  /** Blocks export when not filled */
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

/** Skills installed in .agents/skills by init */
export const SPEC_PROTOCOL_SKILL_DIRS = [
  "spec-protocol-help",
  "spec-protocol-triage",
  "spec-protocol-analyze",
  "spec-protocol-dor",
  "spec-protocol-po",
  "spec-protocol-revalidate",
  "spec-protocol-plan",
  "spec-protocol-exception",
] as const;

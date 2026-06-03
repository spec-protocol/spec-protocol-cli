export type CanonicalStatus =
  | "READY"
  | "PARTIALLY READY"
  | "NOT READY"
  | "EXCEPTION APPROVED"
  | "EXCEPTION NOT RECOMMENDED";

/** Pending [CRITICAL] tag (legacy PT aliases accepted in 2.0.0). */
export const DECISION_TAGS = {
  CRITICAL: /\[CRITICAL\]|\[CRÍTICO\]|\[CRITICO\]/i,
} as const;

/** Substrings expected in plan.md exception section. */
export const EXCEPTION_CHECKS = {
  owner:
    /respons[aá]vel|responsible|responsable|decision owner|propietario|dueño/i,
  risks: /risco|risk|riesgo/i,
} as const;

export type SectionKey =
  | "spec.classification"
  | "spec.objective"
  | "spec.readinessStatus"
  | "spec.confirmedDecisions"
  | "spec.pendingDecisions"
  | "plan.finalDecision"
  | "plan.validatedInputs"
  | "plan.acceptanceCriteria"
  | "plan.exceptionMode";

export type FieldKey = "spec.workType" | "spec.riskLevel" | "spec.triageConfidence";

const TAXONOMY_TAG =
  "CRITICAL|CRÍTICO|CRITICO|RISK|RISCO|HYPOTHESIS|HIPÓTESE|OBSERVATION|OBSERVAÇÃO";

/** EN canonical headings plus legacy aliases for existing artifacts. */
const SECTION_HEADINGS: Record<SectionKey, string[]> = {
  "spec.classification": [
    "Spec Protocol Classification",
    "AISP Classification",
    "Classificação AISP",
    "Clasificación AISP",
    "RTA Classification",
    "Classificação RTA",
    "Clasificación RTA",
  ],
  "spec.objective": ["Objective", "Objetivo"],
  "spec.readinessStatus": [
    "Readiness status",
    "Status de prontidão",
    "Estado de preparación",
  ],
  "spec.confirmedDecisions": [
    "Confirmed decisions",
    "Decisões confirmadas",
    "Decisiones confirmadas",
  ],
  "spec.pendingDecisions": [
    "Pending decisions",
    "Decisões pendentes",
    "Decisiones pendientes",
  ],
  "plan.finalDecision": [
    "Final decision",
    "Decisão final",
    "Decisión final",
  ],
  "plan.validatedInputs": [
    "Validated inputs",
    "Insumos validados",
  ],
  "plan.acceptanceCriteria": [
    "Final acceptance criteria",
    "Final acceptance criteria (Given/When/Then)",
    "Critérios de aceite finais",
    "Criterios de aceptación finales",
  ],
  "plan.exceptionMode": [
    "Exception mode",
    "Exception mode (if applicable)",
    "Modo de exceção",
    "Modo de excepción",
  ],
};

const FIELD_LABELS: Record<FieldKey, string[]> = {
  "spec.workType": ["Work type", "Tipo de trabalho", "Tipo de trabajo"],
  "spec.riskLevel": ["Risk level", "Nível de risco", "Nivel de riesgo"],
  "spec.triageConfidence": [
    "Triage confidence",
    "Confiança da triagem",
    "Confianza de la clasificación",
  ],
};

const ARTIFACT_LABELS: Record<"spec" | "plan" | "tasks", string> = {
  spec: "Consolidated specification",
  plan: "Technical plan",
  tasks: "Implementation checklist",
};

export type ValidateLabels = {
  artifactCritical: (file: string, label: string, status: string) => string;
  artifactRecommended: (file: string, label: string, status: string) => string;
  specNoWorkType: string;
  specNoRiskLevel: string;
  specNoObjective: string;
  specNoReadinessStatus: string;
  specExceptionNoDecisions: string;
  specReadyWithCriticalPending: string;
  planNoFinalStatus: string;
  planNoValidatedInputs: string;
  planNoAcceptanceCriteria: string;
  planNoExceptionMode: string;
  planExceptionNoOwner: string;
  planExceptionNoRisks: string;
  successTitle: (taskId: string) => string;
  readyForExport: (taskId: string) => string;
  blocksTitle: (taskId: string, count: number) => string;
  warningsTitle: (count: number) => string;
  seeProgress: (taskId: string) => string;
  ideHint: string;
};

export type StatusLabels = {
  taskHeader: (taskId: string, completed: number, total: number) => string;
  criticalBadge: string;
  statusOk: string;
  statusDraft: string;
  statusPending: string;
  allFilled: string;
  nextValidate: (taskId: string) => string;
  nextActionTitle: string;
  nextActionDraft: (file: string) => string;
  nextActionPending: (file: string) => string;
  refineHint: string;
  openHint: (taskId: string) => string;
};

export type ListLabels = {
  headerId: string;
  headerCreated: string;
  headerProgress: string;
  headerArtifacts: string;
  empty: string;
  emptyHint: string;
  taskCount: (count: number) => string;
  detailsHint: string;
};

const VALIDATE_LABELS: ValidateLabels = {
  artifactCritical: (file, label, status) =>
    `${file} (${label}) is ${status} — required for export`,
  artifactRecommended: (file, label, status) =>
    `${file} (${label}) is ${status} — recommended`,
  specNoWorkType: "spec.md missing work type",
  specNoRiskLevel: "spec.md missing risk level",
  specNoObjective: "spec.md missing objective",
  specNoReadinessStatus: "spec.md missing readiness status",
  specExceptionNoDecisions:
    "spec.md has EXCEPTION APPROVED without confirmed decisions",
  specReadyWithCriticalPending:
    "spec.md is READY but still has pending [CRITICAL] decision",
  planNoFinalStatus: "plan.md missing status in Final decision",
  planNoValidatedInputs: "plan.md missing validated inputs",
  planNoAcceptanceCriteria: "plan.md missing final acceptance criteria",
  planNoExceptionMode:
    "plan.md missing exception mode while spec.md is EXCEPTION APPROVED",
  planExceptionNoOwner: "plan.md exception missing decision owner",
  planExceptionNoRisks: "plan.md exception missing accepted risks",
  successTitle: (taskId) => `✓ ${taskId} — critical artifacts filled`,
  readyForExport: (taskId) => `Ready for: spec-protocol export ${taskId}`,
  blocksTitle: (taskId, count) => `✗ ${taskId} — ${count} blocking issue(s):`,
  warningsTitle: (count) => `⚠ Warnings (${count}):`,
  seeProgress: (taskId) => `See progress: spec-protocol status ${taskId}`,
  ideHint: "In IDE: @spec-protocol-triage",
};

const STATUS_LABELS: StatusLabels = {
  taskHeader: (taskId, completed, total) =>
    `Task: ${taskId}  (${completed}/${total} artifacts OK)`,
  criticalBadge: " [critical]",
  statusOk: "[OK]",
  statusDraft: "[DRAFT]",
  statusPending: "[PENDING]",
  allFilled: "✓ All artifacts filled!",
  nextValidate: (taskId) => `Next step: spec-protocol validate ${taskId}`,
  nextActionTitle: "→ Next action:",
  nextActionDraft: (file) =>
    `${file} (draft) — refine in IDE with Spec Protocol skills`,
  nextActionPending: (file) =>
    `${file} pending — refine in IDE with Spec Protocol skills`,
  refineHint: "Guide: @spec-protocol-triage  |  Open: spec-protocol open",
  openHint: (taskId) => `spec-protocol open ${taskId}`,
};

const LIST_LABELS: ListLabels = {
  headerId: "ID",
  headerCreated: "Created",
  headerProgress: "Progress",
  headerArtifacts: "Artifacts",
  empty: "No tasks found.",
  emptyHint: "Create one with: spec-protocol new <TASK-ID>",
  taskCount: (count) => `${count} task(s) found.`,
  detailsHint: "Details: spec-protocol status <ID>",
};

const EXPORT_LABELS = {
  title: "Spec-Kit Input — AI Spec Protocol",
  metadata: "Metadata",
  task: "Task",
  squad: "Squad",
  ide: "IDE",
  exportedAt: "Exported at",
  specSection: "Consolidated specification (spec.md)",
  planSection: "Technical plan (plan.md)",
  tasksSection: "Implementation checklist (tasks.md)",
  appendix: "Appendix — Full artifacts",
  emptySection: "_(no content filled)_",
  notFilled: "_(not filled)_",
  footer:
    "_Generated by spec-protocol export. Use as input for GitHub Spec-Kit._",
};

const CONTEXT_LABELS = {
  title: "Spec Protocol Guide",
  generatedBy:
    "Generated by spec-protocol-cli — use in IDE with @spec-protocol-* skills",
  skillSection: "1. Recommended skill",
  entryPoint: "Entry point",
  forArtifact: "For this artifact",
  filesSection: "2. Files to reference with @",
  targetArtifact: "Target artifact",
  otherArtifacts: "Other completed artifacts",
  instructionSection: "3. Instruction",
  instructionBody: [
    "Paste the ticket/card in chat. Invoke the Spec Protocol skill indicated above.",
    "The skill guides analysis, preserves recorded decisions, and suggests copyable content for the artifact.",
  ],
  copyOutput: "Copy/refine the output into `{artifact}`.",
  afterSection: "4. Next",
  validateWhenReady: "(when spec.md and plan.md are OK)",
  allFilled: "All artifacts are filled!",
  nextValidate: "Next step: spec-protocol validate",
  skillHints: {
    specNoClassification:
      "@spec-protocol-triage (spec.md has no classification yet)",
    specWithClassification:
      "@spec-protocol-analyze → @spec-protocol-dor (spec.md already classified)",
    plan: "@spec-protocol-plan (only if spec.md is READY or EXCEPTION APPROVED)",
    tasks:
      "@spec-protocol-plan (only after plan.md and spec.md are ready)",
  },
};

export function getValidateLabels(): ValidateLabels {
  return VALIDATE_LABELS;
}

export function getStatusLabels(): StatusLabels {
  return STATUS_LABELS;
}

export function getListLabels(): ListLabels {
  return LIST_LABELS;
}

export function getArtifactLabel(id: "spec" | "plan" | "tasks"): string {
  return ARTIFACT_LABELS[id];
}

export function getExportLabels() {
  return EXPORT_LABELS;
}

export function getContextLabels() {
  return CONTEXT_LABELS;
}

export function getDateLocale(): string {
  return "en-US";
}

export function getSectionHeadings(key: SectionKey): string[] {
  return SECTION_HEADINGS[key];
}

export function getFieldLabels(key: FieldKey): string[] {
  return FIELD_LABELS[key];
}

export function findSectionContent(
  content: string,
  heading: string,
): string | null {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(
    new RegExp(`^## ${escaped}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"),
  );
  return match ? match[1] : null;
}

export function getSectionTextByKey(
  content: string,
  key: SectionKey,
  options: { stripPlaceholders?: boolean } = {},
): string {
  const strip = options.stripPlaceholders ?? true;
  for (const heading of getSectionHeadings(key)) {
    const raw = findSectionContent(content, heading);
    if (raw !== null) {
      return strip ? stripPlaceholders(raw) : stripComments(raw);
    }
  }
  return "";
}

export function getFieldValueByKey(section: string, key: FieldKey): string {
  for (const field of getFieldLabels(key)) {
    const value = getFieldValue(section, field);
    if (value) return value;
  }
  return "";
}

function getFieldValue(section: string, field: string): string {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = section.match(
    new RegExp(`^-\\s*${escaped}:[ \\t]*([^\\n]+)$`, "mi"),
  );
  const value = stripPlaceholders(match?.[1] ?? "").trim();
  if (
    !value ||
    (value.includes("[") &&
      !new RegExp(`^\\[(${TAXONOMY_TAG})\\]`, "i").test(value)) ||
    value.includes("...")
  ) {
    return "";
  }
  return value;
}

export function normalizeStatus(value: string): CanonicalStatus | "" {
  const status = stripPlaceholders(value).toUpperCase();

  if (
    status.includes("EXCEPTION APPROVED") ||
    status.includes("EXCEÇÃO APROVADA") ||
    status.includes("EXCEPCIÓN APROBADA")
  ) {
    return "EXCEPTION APPROVED";
  }

  if (
    status.includes("EXCEPTION NOT RECOMMENDED") ||
    status.includes("EXCEÇÃO NÃO RECOMENDADA") ||
    status.includes("EXCEPCIÓN NO RECOMENDADA")
  ) {
    return "EXCEPTION NOT RECOMMENDED";
  }

  if (
    status.includes("PARTIALLY READY") ||
    status.includes("PARCIALMENTE PRONTO") ||
    status.includes("PARCIALMENTE LISTO")
  ) {
    return "PARTIALLY READY";
  }

  if (
    status.includes("NOT READY") ||
    status.includes("NÃO PRONTO") ||
    status.includes("NO LISTO")
  ) {
    return "NOT READY";
  }

  if (
    (status.includes("READY") ||
      status.includes("PRONTO") ||
      /\bLISTO\b/.test(status)) &&
    !status.includes("PARTIALLY") &&
    !status.includes("PARCIAL") &&
    !status.includes("NOT") &&
    !status.includes("NÃO") &&
    !status.includes("NO LISTO")
  ) {
    return "READY";
  }

  return "";
}

export function hasRealText(value: string): boolean {
  const text = stripPlaceholders(value).trim();
  return text.length > 0 && text !== "...";
}

export function stripPlaceholders(value: string): string {
  return stripComments(value)
    .replace(new RegExp(`\\[(?!${TAXONOMY_TAG})[^\\]]+\\]`, "gi"), "")
    .replace(/\.\.\./g, "")
    .trim();
}

function stripComments(value: string): string {
  return value.replace(/<!--[\s\S]*?-->/g, "").trim();
}

export function hasSpecClassification(specContent: string | null): boolean {
  if (!specContent) return false;

  for (const typeLabel of getFieldLabels("spec.workType")) {
    for (const riskLabel of getFieldLabels("spec.riskLevel")) {
      const type = specContent
        .match(new RegExp(`${typeLabel}:\\s*([^\\n<]+)`, "i"))?.[1]
        ?.trim();
      const risk = specContent
        .match(new RegExp(`${riskLabel}:\\s*([^\\n<]+)`, "i"))?.[1]
        ?.trim();
      if (type && risk) return true;
    }
  }

  return false;
}

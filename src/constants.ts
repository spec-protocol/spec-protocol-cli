export const PROTOCOL_DIR = ".spec-protocol";

/** Pasta legada (pré-migração), sem ponto inicial. */
export const LEGACY_PROTOCOL_DIR = "spec-protocol";

export const TASK_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

export const IDE_OPTIONS = [
  "Cursor",
  "VS Code",
  "JetBrains",
  "Outro",
] as const;

export type IdeOption = (typeof IDE_OPTIONS)[number];

export interface StageDefinition {
  num: number;
  artifact: string;
  answer: string;
  name: string;
}

export const STAGES: StageDefinition[] = [
  {
    num: 1,
    artifact: "1_Analise_Inicial.md",
    answer: "1_Analise_Inicial_resposta.md",
    name: "Análise Inicial",
  },
  {
    num: 2,
    artifact: "2_Triagem_Tecnica.md",
    answer: "2_Triagem_Tecnica_resposta.md",
    name: "Triagem Técnica",
  },
  {
    num: 3,
    artifact: "3_Checklist_DoR.md",
    answer: "3_Checklist_DoR_resposta.md",
    name: "Checklist DoR",
  },
  {
    num: 4,
    artifact: "4_Template_Devolutiva_PO.md",
    answer: "4_Template_Devolutiva_PO_resposta.md",
    name: "Devolutiva ao PO",
  },
  {
    num: 5,
    artifact: "5_Revalidacao_Com_Resposta_PO.md",
    answer: "5_Revalidacao_Com_Resposta_PO_resposta.md",
    name: "Revalidação com Resposta do PO",
  },
];

export const ANSWER_PLACEHOLDER =
  "<!-- Cole aqui a saída final da IA -->";

export const SUMMARY_TEMPLATE = `# Resumo da tarefa

<!-- Opcional: resumo em linguagem de negócio para stakeholders -->
`;

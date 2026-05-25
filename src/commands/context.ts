import chalk from "chalk";
import { join, relative } from "node:path";
import { STAGES } from "../constants.js";
import {
  assertProtocolInitialized,
  getNextIncompleteStage,
  getAllStageInfos,
} from "../lib/task-progress.js";
import { pathExists, writeTextFile } from "../lib/fs.js";
import { getTaskDir } from "../lib/paths.js";
import { validateTaskId } from "../lib/validate.js";

export interface ContextOptions {
  stage?: number;
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
      `Tarefa "${taskId}" não encontrada. Execute: spec-protocol new ${taskId}`,
    );
  }

  const infos = await getAllStageInfos(taskDir);

  // Determina a etapa alvo
  let targetStageNum: number;
  if (options.stage !== undefined) {
    targetStageNum = options.stage;
    if (targetStageNum < 1 || targetStageNum > STAGES.length) {
      throw new Error(`Etapa inválida: ${targetStageNum}. Use 1 a ${STAGES.length}.`);
    }
  } else {
    const next = infos.find((i) => i.status !== "OK");
    if (!next) {
      console.log(chalk.green("  ✓ Todas as etapas estão preenchidas!"));
      console.log(chalk.gray(`    Próximo passo: spec-protocol validate ${taskId}`));
      console.log("");
      return;
    }
    targetStageNum = next.stage.num;
  }

  const targetInfo = infos.find((i) => i.stage.num === targetStageNum)!;
  const stage = targetInfo.stage;

  // Monta contextos anteriores (respostas OK)
  const priorAnswers = infos
    .filter((i) => i.stage.num < targetStageNum && i.status === "OK")
    .map((i) => i.answerPath);

  const contextContent = buildContextGuide({
    taskId,
    stage,
    artifactPath: targetInfo.artifactPath,
    priorAnswerPaths: priorAnswers,
    cwd,
  });

  if (options.save) {
    const savePath = join(taskDir, `context-stage-${stage.num}.md`);
    await writeTextFile(savePath, contextContent);
    console.log(chalk.green(`  ✓ Roteiro salvo em:`));
    console.log(chalk.cyan(`    .spec-protocol/tasks/${taskId}/context-stage-${stage.num}.md`));
    console.log("");
  } else {
    console.log("");
    console.log(contextContent);
  }
}

function buildContextGuide(opts: {
  taskId: string;
  stage: typeof STAGES[number];
  artifactPath: string;
  priorAnswerPaths: string[];
  cwd: string;
}): string {
  const { taskId, stage, artifactPath, priorAnswerPaths, cwd } = opts;
  const relArtifact = relative(cwd, artifactPath);
  const relPriors = priorAnswerPaths.map((p) => relative(cwd, p));

  const lines: string[] = [
    `# Roteiro de contexto — ${taskId} / Etapa ${stage.num}`,
    `> Gerado por spec-protocol-cli — cole este roteiro no seu chat de IA`,
    "",
    `## Etapa ${stage.num} — ${stage.name}`,
    "",
    "### 1. Arquivos a referenciar com @",
    "",
    `- **Template da etapa:** \`@${relArtifact}\``,
  ];

  if (relPriors.length > 0) {
    lines.push("- **Respostas anteriores (contexto acumulado):**");
    for (const p of relPriors) {
      lines.push(`  - \`@${p}\``);
    }
  }

  lines.push(
    "",
    "### 2. Instrução para a IA",
    "",
    `Abra o arquivo de template acima (\`@${relArtifact}\`) no Cursor (ou cole o conteúdo no chat).`,
    `${relPriors.length > 0 ? "Referencie também as respostas anteriores listadas acima para manter contexto cumulativo. " : ""}`,
    "Peça para a IA preencher o template conforme as instruções internas do arquivo.",
    "",
    "### 3. Após receber a resposta",
    "",
    `Cole o output da IA em:`,
    `\`\`\``,
    `.spec-protocol/tasks/${taskId}/answers/${STAGES.find((s) => s.num === stage.num)?.answer}`,
    `\`\`\``,
    "",
    `Depois verifique: \`spec-protocol status ${taskId}\``,
  );

  return lines.join("\n");
}

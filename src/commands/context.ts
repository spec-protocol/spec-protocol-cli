import chalk from "chalk";
import { relative } from "node:path";
import { ARTIFACTS } from "../constants.js";
import {
  assertProtocolInitialized,
  getAllArtifactInfos,
  getNextIncompleteArtifact,
} from "../lib/task-progress.js";
import { pathExists, readTextFile, writeTextFile } from "../lib/fs.js";
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
      `Tarefa "${taskId}" não encontrada. Execute: spec-protocol new ${taskId}`,
    );
  }

  const infos = await getAllArtifactInfos(taskDir);

  let targetArtifactId: string;
  if (options.artifact) {
    const found = ARTIFACTS.find(
      (a) => a.id === options.artifact || a.file === options.artifact,
    );
    if (!found) {
      throw new Error(
        `Artefato inválido: ${options.artifact}. Use: spec, plan, tasks`,
      );
    }
    targetArtifactId = found.id;
  } else {
    const next = await getNextIncompleteArtifact(taskDir);
    if (!next) {
      console.log(chalk.green("  ✓ Todos os artefatos estão preenchidos!"));
      console.log(chalk.gray(`    Próximo passo: spec-protocol validate ${taskId}`));
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
    console.log(chalk.green(`  ✓ Roteiro salvo em:`));
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
  const relArtifact = relative(cwd, artifactPath);
  const filledOthers = allInfos
    .filter((i) => i.artifact.id !== artifact.id && i.status === "OK")
    .map((i) => relative(cwd, i.path));

  const skillHint = skillForArtifact(artifact.id, specContent);

  const lines: string[] = [
    `# Roteiro RTA — ${taskId} / ${artifact.file}`,
    `> Gerado por spec-protocol-cli — use na IDE com skills RTA`,
    "",
    "## 1. Skill recomendada",
    "",
    `- **Ponto de entrada:** \`@rta-triagem\``,
    `- **Para este artefato:** \`${skillHint}\``,
    "",
    "## 2. Arquivos a referenciar com @",
    "",
    `- **Artefato alvo:** \`@${relArtifact}\``,
  ];

  if (filledOthers.length > 0) {
    lines.push("- **Outros artefatos já preenchidos:**");
    for (const p of filledOthers) {
      lines.push(`  - \`@${p}\``);
    }
  }

  lines.push(
    "",
    "## 3. Instrução",
    "",
    "Cole o card do Jira no chat. Invoque a skill RTA indicada acima.",
    "A skill orienta análise, preserva decisões já registradas e sugere conteúdo copiável para o artefato.",
    "Copie/refine a saída em `" + relArtifact + "`.",
    "",
    "## 4. Depois",
    "",
    `\`spec-protocol status ${taskId}\``,
    `\`spec-protocol validate ${taskId}\` (quando spec.md e plan.md estiverem OK)`,
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
  switch (id) {
    case "spec":
      return hasClassification(specContent)
        ? "@rta-analise → @rta-dor (spec.md já tem classificação)"
        : "@rta-triagem (spec.md ainda sem classificação)";
    case "plan":
      return "@rta-plan (somente se spec.md estiver PRONTO ou EXCEÇÃO APROVADA)";
    case "tasks":
      return "@rta-plan (somente após plan.md e spec.md prontos)";
    default:
      return "@rta-triagem";
  }
}

function hasClassification(specContent: string | null): boolean {
  if (!specContent) return false;
  const type = specContent.match(/Tipo de trabalho:\s*([^\n<]+)/i)?.[1]?.trim();
  const risk = specContent.match(/Nível de risco:\s*([^\n<]+)/i)?.[1]?.trim();
  return Boolean(type && risk);
}

import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { STAGES, type StageDefinition } from "../constants.js";
import { isPlaceholderOnly } from "./export-builder.js";
import { pathExists, readTextFile } from "./fs.js";
import { getProtocolRoot, getTaskDir } from "./paths.js";

export type StageStatus = "OK" | "RASCUNHO" | "PENDENTE";

export interface StageInfo {
  stage: StageDefinition;
  status: StageStatus;
  artifactPath: string;
  answerPath: string;
}

export interface TaskSummary {
  id: string;
  createdAt: Date | null;
  stages: StageInfo[];
  completedCount: number;
  totalCount: number;
  percentComplete: number;
}

/** Garante que o protocolo foi inicializado; lança erro caso contrário. */
export async function assertProtocolInitialized(
  cwd: string = process.cwd(),
): Promise<void> {
  const root = getProtocolRoot(cwd);
  if (!(await pathExists(root))) {
    throw new Error(
      "Protocolo não inicializado. Execute: spec-protocol init",
    );
  }
}

/** Retorna os IDs de todas as tarefas em .spec-protocol/tasks/ */
export async function getTaskIds(cwd: string = process.cwd()): Promise<string[]> {
  const tasksDir = join(getProtocolRoot(cwd), "tasks");
  if (!(await pathExists(tasksDir))) return [];
  const entries = await readdir(tasksDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

/** Retorna o status de uma etapa: OK, RASCUNHO ou PENDENTE */
export async function getStageStatus(
  taskDir: string,
  stage: StageDefinition,
): Promise<StageStatus> {
  const answerPath = join(taskDir, "answers", stage.answer);
  if (!(await pathExists(answerPath))) return "PENDENTE";
  try {
    const content = await readTextFile(answerPath);
    return isPlaceholderOnly(content) ? "RASCUNHO" : "OK";
  } catch {
    return "PENDENTE";
  }
}

/** Retorna info completa de todas as etapas de uma tarefa */
export async function getAllStageInfos(taskDir: string): Promise<StageInfo[]> {
  return Promise.all(
    STAGES.map(async (stage) => {
      const status = await getStageStatus(taskDir, stage);
      return {
        stage,
        status,
        artifactPath: join(taskDir, "artifacts", stage.artifact),
        answerPath: join(taskDir, "answers", stage.answer),
      };
    }),
  );
}

/** Retorna a primeira etapa incompleta (não OK), ou undefined se todas OK */
export async function getNextIncompleteStage(
  taskDir: string,
): Promise<StageInfo | undefined> {
  const infos = await getAllStageInfos(taskDir);
  return infos.find((i) => i.status !== "OK");
}

/** Retorna resumo completo de uma tarefa */
export async function getTaskSummary(
  cwd: string,
  taskId: string,
): Promise<TaskSummary> {
  const taskDir = getTaskDir(cwd, taskId);
  const stages = await getAllStageInfos(taskDir);
  const completedCount = stages.filter((s) => s.status === "OK").length;

  let createdAt: Date | null = null;
  try {
    const s = await stat(taskDir);
    createdAt = s.birthtime;
  } catch {
    /* ignora */
  }

  return {
    id: taskId,
    createdAt,
    stages,
    completedCount,
    totalCount: stages.length,
    percentComplete: Math.round((completedCount / stages.length) * 100),
  };
}

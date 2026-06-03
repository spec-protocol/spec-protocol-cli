import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { ARTIFACTS, type ArtifactDefinition } from "../constants.js";
import { isPlaceholderOnly } from "./export-builder.js";
import { pathExists, readTextFile } from "./fs.js";
import { getProtocolRoot, getTaskDir } from "./paths.js";

export type ArtifactStatus = "OK" | "RASCUNHO" | "PENDENTE";

export interface ArtifactInfo {
  artifact: ArtifactDefinition;
  status: ArtifactStatus;
  path: string;
}

export interface TaskSummary {
  id: string;
  createdAt: Date | null;
  artifacts: ArtifactInfo[];
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
      "Protocol not initialized. Run: spec-protocol init",
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

/** Retorna o status de um artefato: OK, RASCUNHO ou PENDENTE */
export async function getArtifactStatus(
  taskDir: string,
  artifact: ArtifactDefinition,
): Promise<ArtifactStatus> {
  const filePath = join(taskDir, artifact.file);
  if (!(await pathExists(filePath))) return "PENDENTE";
  try {
    const content = await readTextFile(filePath);
    return isPlaceholderOnly(content) ? "RASCUNHO" : "OK";
  } catch {
    return "PENDENTE";
  }
}

/** Retorna info completa de todos os artefatos de uma tarefa */
export async function getAllArtifactInfos(
  taskDir: string,
): Promise<ArtifactInfo[]> {
  return Promise.all(
    ARTIFACTS.map(async (artifact) => {
      const status = await getArtifactStatus(taskDir, artifact);
      return {
        artifact,
        status,
        path: join(taskDir, artifact.file),
      };
    }),
  );
}

/** Retorna o primeiro artefato incompleto (não OK), ou undefined se todos OK */
export async function getNextIncompleteArtifact(
  taskDir: string,
): Promise<ArtifactInfo | undefined> {
  const infos = await getAllArtifactInfos(taskDir);
  return infos.find((i) => i.status !== "OK");
}

/** Retorna resumo completo de uma tarefa */
export async function getTaskSummary(
  cwd: string,
  taskId: string,
): Promise<TaskSummary> {
  const taskDir = getTaskDir(cwd, taskId);
  const artifacts = await getAllArtifactInfos(taskDir);
  const completedCount = artifacts.filter((a) => a.status === "OK").length;

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
    artifacts,
    completedCount,
    totalCount: artifacts.length,
    percentComplete: Math.round((completedCount / artifacts.length) * 100),
  };
}

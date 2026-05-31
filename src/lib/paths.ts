import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { AGENTS_SKILLS_DIR, PROTOCOL_DIR } from "../constants.js";

/** Raiz do pacote npm (contém templates/ e dist/). */
export function getPackageRoot(): string {
  const dir = dirname(fileURLToPath(import.meta.url));
  // Bundle tsup: dist/index.js → raiz é o pai de dist/
  if (dir.endsWith(`${sep}dist`) || dir.endsWith("/dist")) {
    return join(dir, "..");
  }
  // Desenvolvimento: src/lib/*.ts
  return join(dir, "..", "..");
}

export function getTemplatesDir(): string {
  return join(getPackageRoot(), "templates");
}

/** Pack de skills RTA embutido no pacote npm */
export function getSkillPackDir(): string {
  return join(getPackageRoot(), ".agents", "skills");
}

export function getProtocolRoot(cwd: string = process.cwd()): string {
  return join(cwd, PROTOCOL_DIR);
}

export function getConfigPath(cwd: string = process.cwd()): string {
  return join(getProtocolRoot(cwd), "config.json");
}

export function getTaskDir(cwd: string, taskId: string): string {
  return join(getProtocolRoot(cwd), "tasks", taskId);
}

export function getAgentsSkillsDir(cwd: string = process.cwd()): string {
  return join(cwd, AGENTS_SKILLS_DIR);
}

export function getExportPath(cwd: string, taskId: string): string {
  return join(
    getProtocolRoot(cwd),
    "exports",
    taskId,
    "spec-kit-input.md",
  );
}

export function resolveAbsolute(path: string): string {
  return resolve(path);
}

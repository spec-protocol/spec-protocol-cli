import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { AGENTS_SKILLS_DIR, PROTOCOL_DIR } from "../constants.js";

/** npm package root (contains templates/ and dist/). */
export function getPackageRoot(): string {
  const dir = dirname(fileURLToPath(import.meta.url));
  if (dir.endsWith(`${sep}dist`) || dir.endsWith("/dist")) {
    return join(dir, "..");
  }
  return join(dir, "..", "..");
}

export function getTemplatesDir(): string {
  return join(getPackageRoot(), "templates");
}

/** Skill pack bundled in the npm package */
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

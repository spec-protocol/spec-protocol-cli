import { join } from "node:path";
import { RTA_SKILL_DIRS } from "../constants.js";
import { copyDirRecursive, pathExists } from "./fs.js";
import { getAgentsSkillsDir, getSkillPackDir } from "./paths.js";

export interface SkillInstallResult {
  installed: string[];
  skipped: string[];
  missing: string[];
}

/** Copia skills RTA do pacote para .agents/skills no projeto alvo. Idempotente. */
export async function installRtaSkills(
  cwd: string = process.cwd(),
): Promise<SkillInstallResult> {
  const packDir = getSkillPackDir();
  const targetSkillsDir = getAgentsSkillsDir(cwd);
  const result: SkillInstallResult = {
    installed: [],
    skipped: [],
    missing: [],
  };

  if (!(await pathExists(packDir))) {
    throw new Error(`Pack de skills não encontrado em: ${packDir}`);
  }

  for (const skillDir of RTA_SKILL_DIRS) {
    const source = join(packDir, skillDir);
    const target = join(targetSkillsDir, skillDir);

    if (!(await pathExists(source))) {
      result.missing.push(skillDir);
      continue;
    }

    const skillFile = join(target, "SKILL.md");
    if (await pathExists(skillFile)) {
      result.skipped.push(skillDir);
      continue;
    }

    await copyDirRecursive(source, target);
    result.installed.push(skillDir);
  }

  return result;
}

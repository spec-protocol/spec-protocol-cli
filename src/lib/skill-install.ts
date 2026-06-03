import { join } from "node:path";
import { SPEC_PROTOCOL_SKILL_DIRS } from "../constants.js";
import { copyDirRecursive, pathExists } from "./fs.js";
import { getAgentsSkillsDir, getSkillPackDir } from "./paths.js";

export interface SkillInstallResult {
  installed: string[];
  skipped: string[];
  missing: string[];
}

/** Copy Spec Protocol skills from package to .agents/skills. Idempotent. */
export async function installSpecProtocolSkills(
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
    throw new Error(`Skill pack not found at: ${packDir}`);
  }

  for (const skillDir of SPEC_PROTOCOL_SKILL_DIRS) {
    const source = join(packDir, skillDir);
    const target = join(targetSkillsDir, skillDir);

    if (!(await pathExists(source))) {
      result.missing.push(skillDir);
      continue;
    }

    const skillFile = join(target, "SKILL.md");
    const existedBefore = await pathExists(skillFile);

    if (!existedBefore) {
      await copyDirRecursive(source, target);
      result.installed.push(skillDir);
    } else {
      result.skipped.push(skillDir);
    }
  }

  return result;
}

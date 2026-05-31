import { join } from "node:path";
import { RTA_SKILL_DIRS } from "../constants.js";
import {
  DEFAULT_LANGUAGE,
  upsertSkillLanguageInstruction,
  type SupportedLanguage,
} from "./i18n.js";
import { copyDirRecursive, pathExists, readTextFile, writeTextFile } from "./fs.js";
import { getAgentsSkillsDir, getSkillPackDir } from "./paths.js";

export interface SkillInstallResult {
  installed: string[];
  updated: string[];
  skipped: string[];
  missing: string[];
}

/** Copia skills RTA do pacote para .agents/skills no projeto alvo. Idempotente. */
export async function installRtaSkills(
  cwd: string = process.cwd(),
  language: SupportedLanguage = DEFAULT_LANGUAGE,
): Promise<SkillInstallResult> {
  const packDir = getSkillPackDir();
  const targetSkillsDir = getAgentsSkillsDir(cwd);
  const result: SkillInstallResult = {
    installed: [],
    updated: [],
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
    const existedBefore = await pathExists(skillFile);

    if (!existedBefore) {
      await copyDirRecursive(source, target);
      result.installed.push(skillDir);
    }

    if (!(await pathExists(skillFile))) {
      continue;
    }

    const currentSkill = await readTextFile(skillFile);
    const localizedSkill = upsertSkillLanguageInstruction(
      currentSkill,
      language,
    );

    if (localizedSkill !== currentSkill) {
      await writeTextFile(skillFile, localizedSkill);
      if (existedBefore) {
        result.updated.push(skillDir);
      }
    } else if (existedBefore) {
      result.skipped.push(skillDir);
    }
  }

  return result;
}

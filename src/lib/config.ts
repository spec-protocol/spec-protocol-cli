import { readFile, writeFile } from "node:fs/promises";
import { getConfigPath } from "./paths.js";
import type { IdeOption } from "../constants.js";
import {
  DEFAULT_LANGUAGE,
  resolveLanguage,
  type SupportedLanguage,
} from "./i18n.js";

export interface SpecKitConfig {
  command: string;
  args: string[];
}

export interface ProtocolConfig {
  squad: string;
  ide: IdeOption | string;
  language: SupportedLanguage;
  specKit: SpecKitConfig;
  createdAt: string;
}

export async function readConfig(
  cwd: string = process.cwd(),
): Promise<ProtocolConfig | null> {
  const configPath = getConfigPath(cwd);
  try {
    const raw = await readFile(configPath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<ProtocolConfig>;
    return {
      squad: parsed.squad ?? "Squad",
      ide: parsed.ide ?? "Cursor",
      language: resolveLanguage(parsed.language),
      specKit: parsed.specKit ?? { command: "specify", args: [] },
      createdAt: parsed.createdAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function writeConfig(
  config: ProtocolConfig,
  cwd: string = process.cwd(),
): Promise<void> {
  const configPath = getConfigPath(cwd);
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
}

export function defaultConfig(
  squad: string,
  ide: string,
  language: SupportedLanguage = DEFAULT_LANGUAGE,
): ProtocolConfig {
  return {
    squad,
    ide,
    language,
    specKit: {
      command: "specify",
      args: [],
    },
    createdAt: new Date().toISOString(),
  };
}

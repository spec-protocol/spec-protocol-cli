import chalk from "chalk";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { pathExists } from "../lib/fs.js";
import {
  getAgentsSkillsDir,
  getPackageRoot,
  getProtocolRoot,
  getConfigPath,
  getTemplatesDir,
} from "../lib/paths.js";
import { LEGACY_PROTOCOL_DIR, RTA_SKILL_DIRS } from "../constants.js";
import {
  DEFAULT_LANGUAGE,
  getLanguageConfigIssue,
  resolveLanguage,
  SUPPORTED_LANGUAGES,
} from "../lib/i18n.js";

const execFileAsync = promisify(execFile);

interface CheckResult {
  label: string;
  ok: boolean;
  message: string;
  action?: string;
  blocking: boolean;
}

export async function runDoctor(cwd: string = process.cwd()): Promise<void> {
  console.log("");
  console.log(chalk.bold.cyan("  spec-protocol doctor — Health Check"));
  console.log(chalk.gray("  " + "─".repeat(50)));
  console.log("");

  const checks: CheckResult[] = await Promise.all([
    checkNode(),
    checkProtocolDir(cwd),
    checkConfigJson(cwd),
    checkConfigLanguage(cwd),
    checkArtifactTemplates(),
    checkRtaSkills(cwd),
    checkSkillPack(),
    checkSpecify(),
    checkLegacyDir(cwd),
    checkGitignore(cwd),
  ]);

  let hasErrors = false;

  for (const check of checks) {
    const icon = check.ok
      ? chalk.green("✓")
      : check.blocking
        ? chalk.red("✗")
        : chalk.yellow("⚠");

    const label = check.label.padEnd(36);
    const msg = check.ok
      ? chalk.green(check.message)
      : check.blocking
        ? chalk.red(check.message)
        : chalk.yellow(check.message);

    console.log(`  ${icon} ${label} ${msg}`);

    if (!check.ok && check.action) {
      console.log(`    ${chalk.gray("→")} ${chalk.dim(check.action)}`);
    }

    if (!check.ok && check.blocking) hasErrors = true;
  }

  console.log("");

  if (hasErrors) {
    console.log(chalk.red("  ✗ Corrija os itens acima antes de continuar."));
  } else {
    console.log(chalk.green("  ✓ Ambiente OK — pronto para usar o RTA."));
  }

  console.log("");
}

async function checkNode(): Promise<CheckResult> {
  const version = process.version;
  const major = parseInt(version.slice(1).split(".")[0], 10);
  const ok = major >= 18;
  return {
    label: "Node.js >= 18",
    ok,
    message: ok ? version : `${version} (requer >= 18)`,
    action: ok ? undefined : "Atualize o Node.js: https://nodejs.org",
    blocking: true,
  };
}

async function checkProtocolDir(cwd: string): Promise<CheckResult> {
  const root = getProtocolRoot(cwd);
  const ok = await pathExists(root);
  return {
    label: ".spec-protocol/ existe",
    ok,
    message: ok ? "encontrada" : "não encontrada",
    action: ok ? undefined : "spec-protocol init",
    blocking: true,
  };
}

async function checkConfigJson(cwd: string): Promise<CheckResult> {
  const configPath = getConfigPath(cwd);
  if (!(await pathExists(configPath))) {
    return {
      label: "config.json válido",
      ok: false,
      message: "não encontrado",
      action: "spec-protocol init",
      blocking: true,
    };
  }
  try {
    const raw = await readFile(configPath, "utf-8");
    JSON.parse(raw);
    return { label: "config.json válido", ok: true, message: "OK", blocking: false };
  } catch {
    return {
      label: "config.json válido",
      ok: false,
      message: "JSON inválido",
      action: "spec-protocol init (recria o config)",
      blocking: true,
    };
  }
}

async function checkConfigLanguage(cwd: string): Promise<CheckResult> {
  const configPath = getConfigPath(cwd);
  if (!(await pathExists(configPath))) {
    return {
      label: "config.language",
      ok: false,
      message: "config.json ausente",
      action: "spec-protocol init",
      blocking: false,
    };
  }
  try {
    const raw = await readFile(configPath, "utf-8");
    const parsed = JSON.parse(raw) as { language?: unknown };
    const issue = getLanguageConfigIssue(parsed.language);
    if (issue === "missing") {
      return {
        label: "config.language",
        ok: false,
        message: `ausente — usando ${DEFAULT_LANGUAGE}`,
        action: "spec-protocol init (backfill)",
        blocking: false,
      };
    }
    if (issue === "invalid") {
      const normalized = resolveLanguage(parsed.language);
      return {
        label: "config.language",
        ok: false,
        message: `inválido: ${JSON.stringify(parsed.language)} → use ${normalized}`,
        action: "spec-protocol init ou edite config.json",
        blocking: false,
      };
    }
    return {
      label: "config.language",
      ok: true,
      message: String(parsed.language),
      blocking: false,
    };
  } catch {
    return {
      label: "config.language",
      ok: false,
      message: "não foi possível ler config.json",
      blocking: false,
    };
  }
}

async function checkArtifactTemplates(): Promise<CheckResult> {
  const required = ["spec.md", "plan.md", "tasks.md"];
  const missing: string[] = [];

  for (const language of SUPPORTED_LANGUAGES) {
    const templatesDir = getTemplatesDir(language);
    for (const file of required) {
      if (!(await pathExists(join(templatesDir, file)))) {
        missing.push(`${language}/${file}`);
      }
    }
  }

  const ok = missing.length === 0;
  return {
    label: "templates artefatos i18n",
    ok,
    message: ok
      ? "pt-BR/en/es spec/plan/tasks OK"
      : `faltam: ${missing.join(", ")}`,
    action: ok ? undefined : "Reinstale: npm install -g spec-protocol-cli",
    blocking: true,
  };
}

async function checkRtaSkills(cwd: string): Promise<CheckResult> {
  const skillsDir = getAgentsSkillsDir(cwd);
  const missing: string[] = [];
  for (const skill of RTA_SKILL_DIRS) {
    const skillPath = join(skillsDir, skill, "SKILL.md");
    if (!(await pathExists(skillPath))) {
      missing.push(skill);
    }
  }
  const ok = missing.length === 0;
  return {
    label: ".agents/skills RTA instaladas",
    ok,
    message: ok
      ? `${RTA_SKILL_DIRS.length} skills`
      : `faltam ${missing.length}: ${missing.slice(0, 2).join(", ")}…`,
    action: ok ? undefined : "spec-protocol init",
    blocking: false,
  };
}

async function checkSkillPack(): Promise<CheckResult> {
  const packDir = join(getPackageRoot(), ".agents", "skills");
  const ok = await pathExists(join(packDir, "rta-triagem", "SKILL.md"));
  return {
    label: "skill pack no pacote npm",
    ok,
    message: ok ? "encontrado" : "não encontrado",
    action: ok ? undefined : "Reinstale: npm install -g spec-protocol-cli",
    blocking: true,
  };
}

async function checkSpecify(): Promise<CheckResult> {
  try {
    await execFileAsync("specify", ["--version"]);
    return { label: "specify no PATH (Spec-Kit)", ok: true, message: "encontrado", blocking: false };
  } catch {
    return {
      label: "specify no PATH (Spec-Kit)",
      ok: false,
      message: "não encontrado (opcional)",
      action: "Instale o GitHub Spec-Kit para usar run-spec",
      blocking: false,
    };
  }
}

async function checkLegacyDir(cwd: string): Promise<CheckResult> {
  const legacyPath = join(cwd, LEGACY_PROTOCOL_DIR);
  const exists = await pathExists(legacyPath);
  return {
    label: "Pasta legada spec-protocol/",
    ok: !exists,
    message: exists ? "encontrada — migração necessária" : "não encontrada (OK)",
    action: exists ? "mv spec-protocol .spec-protocol" : undefined,
    blocking: false,
  };
}

async function checkGitignore(cwd: string): Promise<CheckResult> {
  const gitignorePath = join(cwd, ".gitignore");
  if (!(await pathExists(gitignorePath))) {
    return {
      label: ".gitignore configurado",
      ok: false,
      message: ".gitignore não existe",
      action: "spec-protocol init (cria/atualiza automaticamente)",
      blocking: false,
    };
  }
  const content = await readFile(gitignorePath, "utf-8");
  const ok = content.includes(".spec-protocol");
  return {
    label: ".gitignore configurado",
    ok,
    message: ok ? "menciona .spec-protocol" : "não menciona .spec-protocol",
    action: ok ? undefined : "spec-protocol init (ou adicione manualmente ao .gitignore)",
    blocking: false,
  };
}

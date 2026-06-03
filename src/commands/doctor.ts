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
import { LEGACY_PROTOCOL_DIR, SPEC_PROTOCOL_SKILL_DIRS } from "../constants.js";

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
    checkArtifactTemplates(),
    checkSpecProtocolSkills(cwd),
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
    console.log(chalk.red("  ✗ Fix the items above before continuing."));
  } else {
    console.log(chalk.green("  ✓ Environment OK — ready to use Spec Protocol."));
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
    message: ok ? version : `${version} (requires >= 18)`,
    action: ok ? undefined : "Update Node.js: https://nodejs.org",
    blocking: true,
  };
}

async function checkProtocolDir(cwd: string): Promise<CheckResult> {
  const root = getProtocolRoot(cwd);
  const ok = await pathExists(root);
  return {
    label: ".spec-protocol/ exists",
    ok,
    message: ok ? "found" : "not found",
    action: ok ? undefined : "spec-protocol init",
    blocking: true,
  };
}

async function checkConfigJson(cwd: string): Promise<CheckResult> {
  const configPath = getConfigPath(cwd);
  if (!(await pathExists(configPath))) {
    return {
      label: "config.json valid",
      ok: false,
      message: "not found",
      action: "spec-protocol init",
      blocking: true,
    };
  }
  try {
    const raw = await readFile(configPath, "utf-8");
    JSON.parse(raw);
    return { label: "config.json valid", ok: true, message: "OK", blocking: false };
  } catch {
    return {
      label: "config.json valid",
      ok: false,
      message: "invalid JSON",
      action: "spec-protocol init (recreates config)",
      blocking: true,
    };
  }
}

async function checkArtifactTemplates(): Promise<CheckResult> {
  const required = ["spec.md", "plan.md", "tasks.md"];
  const templatesDir = getTemplatesDir();
  const missing: string[] = [];

  for (const file of required) {
    if (!(await pathExists(join(templatesDir, file)))) {
      missing.push(file);
    }
  }

  const ok = missing.length === 0;
  return {
    label: "artifact templates",
    ok,
    message: ok ? "spec/plan/tasks OK" : `missing: ${missing.join(", ")}`,
    action: ok ? undefined : "Reinstall: npm install -g spec-protocol-cli",
    blocking: true,
  };
}

async function checkSpecProtocolSkills(cwd: string): Promise<CheckResult> {
  const skillsDir = getAgentsSkillsDir(cwd);
  const missing: string[] = [];
  for (const skill of SPEC_PROTOCOL_SKILL_DIRS) {
    const skillPath = join(skillsDir, skill, "SKILL.md");
    if (!(await pathExists(skillPath))) {
      missing.push(skill);
    }
  }
  const ok = missing.length === 0;
  return {
    label: ".agents/skills installed",
    ok,
    message: ok
      ? `${SPEC_PROTOCOL_SKILL_DIRS.length} skills`
      : `missing ${missing.length}: ${missing.slice(0, 2).join(", ")}…`,
    action: ok ? undefined : "spec-protocol init",
    blocking: false,
  };
}

async function checkSkillPack(): Promise<CheckResult> {
  const packDir = join(getPackageRoot(), ".agents", "skills");
  const ok = await pathExists(
    join(packDir, "spec-protocol-triage", "SKILL.md"),
  );
  return {
    label: "skill pack in npm package",
    ok,
    message: ok ? "found" : "not found",
    action: ok ? undefined : "Reinstall: npm install -g spec-protocol-cli",
    blocking: true,
  };
}

async function checkSpecify(): Promise<CheckResult> {
  try {
    await execFileAsync("specify", ["--version"]);
    return {
      label: "specify on PATH (Spec-Kit)",
      ok: true,
      message: "found",
      blocking: false,
    };
  } catch {
    return {
      label: "specify on PATH (Spec-Kit)",
      ok: false,
      message: "not found (optional)",
      action: "Install GitHub Spec-Kit to use run-spec",
      blocking: false,
    };
  }
}

async function checkLegacyDir(cwd: string): Promise<CheckResult> {
  const legacyPath = join(cwd, LEGACY_PROTOCOL_DIR);
  const exists = await pathExists(legacyPath);
  return {
    label: "legacy spec-protocol/ folder",
    ok: !exists,
    message: exists ? "found — migration required" : "not found (OK)",
    action: exists ? "mv spec-protocol .spec-protocol" : undefined,
    blocking: false,
  };
}

async function checkGitignore(cwd: string): Promise<CheckResult> {
  const gitignorePath = join(cwd, ".gitignore");
  if (!(await pathExists(gitignorePath))) {
    return {
      label: ".gitignore configured",
      ok: false,
      message: ".gitignore missing",
      action: "spec-protocol init (creates/updates automatically)",
      blocking: false,
    };
  }
  const content = await readFile(gitignorePath, "utf-8");
  const ok = content.includes(".spec-protocol");
  return {
    label: ".gitignore configured",
    ok,
    message: ok ? "mentions .spec-protocol" : "does not mention .spec-protocol",
    action: ok ? undefined : "spec-protocol init (or add manually to .gitignore)",
    blocking: false,
  };
}

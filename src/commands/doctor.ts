import chalk from "chalk";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { pathExists } from "../lib/fs.js";
import { getPackageRoot, getProtocolRoot, getConfigPath } from "../lib/paths.js";
import { LEGACY_PROTOCOL_DIR } from "../constants.js";

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
    checkTemplates(),
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
    console.log(chalk.green("  ✓ Ambiente OK — pronto para usar o protocolo."));
  }

  console.log("");
}

async function checkNode(): Promise<CheckResult> {
  const version = process.version; // e.g. "v20.11.0"
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

async function checkTemplates(): Promise<CheckResult> {
  const templatesDir = join(getPackageRoot(), "templates");
  const ok = await pathExists(templatesDir);
  return {
    label: "templates/ no pacote",
    ok,
    message: ok ? "encontrados" : "não encontrados",
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

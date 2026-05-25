import chalk from "chalk";
import { input, select } from "@inquirer/prompts";
import { printBanner } from "../banner.js";
import { IDE_OPTIONS, LEGACY_PROTOCOL_DIR } from "../constants.js";
import { defaultConfig, readConfig, writeConfig } from "../lib/config.js";
import { join } from "node:path";
import { ensureDir, pathExists } from "../lib/fs.js";
import { getProtocolRoot } from "../lib/paths.js";
import { updateGitignore } from "../lib/gitignore.js";

export interface InitOptions {
  noGitignore?: boolean;
}

export async function runInit(
  cwd: string = process.cwd(),
  options: InitOptions = {},
): Promise<void> {
  printBanner({ hint: false });

  const legacyRoot = join(cwd, LEGACY_PROTOCOL_DIR);
  const protocolRoot = getProtocolRoot(cwd);
  const legacyExists = await pathExists(legacyRoot);
  const newExists = await pathExists(protocolRoot);

  if (legacyExists && !newExists) {
    console.log(
      chalk.yellow(
        "⚠ Detectada pasta legada ./spec-protocol/ (sem ponto).\n" +
          "  Migre com: mv spec-protocol .spec-protocol\n" +
          "  Ou apague se foi apenas um teste.",
      ),
    );
    console.log("");
  }

  const exists = await pathExists(protocolRoot);
  let config = await readConfig(cwd);

  if (exists && config) {
    console.log(
      chalk.yellow(
        `⚠ ${protocolRoot} já existe. config.json não será sobrescrito.`,
      ),
    );
  } else {
    const squad = await input({
      message: "Nome da squad/time:",
      default: "Squad",
      validate: (v) => (v.trim() ? true : "Informe o nome da squad."),
    });

    const ide = await select({
      message: "IDE principal:",
      choices: IDE_OPTIONS.map((name) => ({ name, value: name })),
    });

    config = defaultConfig(squad.trim(), ide);
    await ensureDir(protocolRoot);
    await writeConfig(config, cwd);

    console.log("");
    console.log(
      chalk.green(`✓ Squad configurada: ${chalk.bold(config.squad)}`),
    );
    console.log(chalk.green(`✓ IDE: ${config.ide}`));
  }

  await ensureDir(`${protocolRoot}/tasks`);
  await ensureDir(`${protocolRoot}/exports`);

  // Atualizar .gitignore do repo alvo
  const gitignoreResult = await updateGitignore(cwd, options.noGitignore);
  if (gitignoreResult === "created") {
    console.log(chalk.green("✓ .gitignore criado com snippet do protocolo"));
  } else if (gitignoreResult === "appended") {
    console.log(chalk.green("✓ .gitignore atualizado com snippet do protocolo"));
  } else if (gitignoreResult === "already-configured") {
    console.log(chalk.gray("  .gitignore já configurado"));
  } else if (gitignoreResult === "skipped") {
    console.log(chalk.gray("  .gitignore ignorado (--no-gitignore)"));
  }

  console.log("");
  console.log(chalk.green(`✓ Protocolo inicializado em ./.spec-protocol/`));
  console.log(chalk.gray("  Próximo passo: spec-protocol new <ID-DA-TAREFA>"));
  console.log("");
}

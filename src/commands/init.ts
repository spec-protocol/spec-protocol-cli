import chalk from "chalk";
import { input, select } from "@inquirer/prompts";
import { printBanner } from "../banner.js";
import { IDE_OPTIONS, LEGACY_PROTOCOL_DIR } from "../constants.js";
import { defaultConfig, readConfig, writeConfig } from "../lib/config.js";
import { join } from "node:path";
import { ensureDir, pathExists } from "../lib/fs.js";
import { getProtocolRoot } from "../lib/paths.js";
import { updateGitignore } from "../lib/gitignore.js";
import { installSpecProtocolSkills } from "../lib/skill-install.js";

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
        "⚠ Legacy folder ./spec-protocol/ detected (no leading dot).\n" +
          "  Migrate with: mv spec-protocol .spec-protocol\n" +
          "  Or delete if it was only a test.",
      ),
    );
    console.log("");
  }

  const exists = await pathExists(protocolRoot);
  let config = await readConfig(cwd);

  if (exists && config) {
    console.log(
      chalk.yellow(
        `⚠ ${protocolRoot} already exists. config.json will not be overwritten.`,
      ),
    );
  } else {
    const squad = await input({
      message: "Squad / team name:",
      default: "Squad",
      validate: (v) => (v.trim() ? true : "Enter a squad name."),
    });

    const ide = await select({
      message: "Primary IDE:",
      choices: IDE_OPTIONS.map((name) => ({ name, value: name })),
    });

    config = defaultConfig(squad.trim(), ide);
    await ensureDir(protocolRoot);
    await writeConfig(config, cwd);

    console.log("");
    console.log(
      chalk.green(`✓ Squad configured: ${chalk.bold(config.squad)}`),
    );
    console.log(chalk.green(`✓ IDE: ${config.ide}`));
  }

  await ensureDir(`${protocolRoot}/tasks`);
  await ensureDir(`${protocolRoot}/exports`);

  const skillResult = await installSpecProtocolSkills(cwd);
  if (skillResult.installed.length > 0) {
    console.log(
      chalk.green(
        `✓ Spec Protocol skills installed: ${skillResult.installed.join(", ")}`,
      ),
    );
  }
  if (skillResult.skipped.length > 0) {
    console.log(
      chalk.gray(
        `  Skills already present: ${skillResult.skipped.join(", ")}`,
      ),
    );
  }
  if (skillResult.missing.length > 0) {
    console.log(
      chalk.yellow(
        `⚠ Skills missing from package: ${skillResult.missing.join(", ")}`,
      ),
    );
  }

  const gitignoreResult = await updateGitignore(cwd, options.noGitignore);
  if (gitignoreResult === "created") {
    console.log(chalk.green("✓ .gitignore created with protocol snippet"));
  } else if (gitignoreResult === "appended") {
    console.log(chalk.green("✓ .gitignore updated with protocol snippet"));
  } else if (gitignoreResult === "already-configured") {
    console.log(chalk.gray("  .gitignore already configured"));
  } else if (gitignoreResult === "skipped") {
    console.log(chalk.gray("  .gitignore skipped (--no-gitignore)"));
  }

  console.log("");
  console.log(chalk.green(`✓ Spec Protocol initialized in ./.spec-protocol/`));
  console.log(chalk.green(`✓ Skills in ./.agents/skills/spec-protocol-*`));
  console.log(chalk.gray("  Next step: spec-protocol new <TASK-ID>"));
  console.log(chalk.gray("  In IDE: use @spec-protocol-triage as entry point"));
  console.log("");
}

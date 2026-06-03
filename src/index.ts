import { createRequire } from "node:module";
import { Command } from "commander";
import chalk from "chalk";

const { version } = createRequire(import.meta.url)("../package.json") as {
  version: string;
};
import { printBanner } from "./banner.js";
import { runInit } from "./commands/init.js";
import { runNew } from "./commands/new.js";
import { runExport } from "./commands/export.js";
import { runRunSpec } from "./commands/run-spec.js";
import { runList } from "./commands/list.js";
import { runStatus } from "./commands/status.js";
import { runValidate } from "./commands/validate-cmd.js";
import { runDoctor } from "./commands/doctor.js";
import { runContext } from "./commands/context.js";
import { runOpen } from "./commands/open.js";

const program = new Command();

program
  .name("spec-protocol")
  .description("AI Spec Protocol — assisted technical refinement")
  .version(version);

program
  .command("init")
  .description("Initialize .spec-protocol/ and install Spec Protocol skills")
  .option("--no-gitignore", "Skip .gitignore update")
  .action(async (opts) => {
    try {
      await runInit(process.cwd(), { noGitignore: !opts.gitignore });
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("new")
  .description("Create spec.md, plan.md, and tasks.md for a task")
  .argument("<task-id>", "Task ID (e.g. JIRA-123)")
  .action(async (taskId: string) => {
    try {
      await runNew(taskId);
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("export")
  .description("Generate consolidated spec-kit-input.md for Spec-Kit")
  .argument("<task-id>", "Task ID")
  .action(async (taskId: string) => {
    try {
      await runExport(taskId);
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("run-spec")
  .description("Run Spec-Kit (specify) with the task export")
  .argument("<task-id>", "Task ID")
  .action(async (taskId: string) => {
    try {
      const code = await runRunSpec(taskId);
      process.exit(code);
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("list")
  .description("List all tasks in .spec-protocol/tasks/")
  .action(async () => {
    try {
      await runList();
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("status")
  .description("Show spec/plan/tasks artifact progress")
  .argument("<task-id>", "Task ID")
  .action(async (taskId: string) => {
    try {
      await runStatus(taskId);
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("validate")
  .description("Validate critical artifacts before export (exit 0/1 — CI)")
  .argument("<task-id>", "Task ID")
  .option("--json", "JSON output for CI/scripts")
  .action(async (taskId: string, opts) => {
    try {
      const code = await runValidate(taskId, { json: opts.json });
      process.exit(code);
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("doctor")
  .description("Health check for environment and project")
  .action(async () => {
    try {
      await runDoctor();
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("context")
  .description("Generate IDE guide with skills and artifacts")
  .argument("<task-id>", "Task ID")
  .option("--artifact <id>", "Artifact: spec, plan, or tasks; default: next incomplete")
  .option("--save", "Save to context-{artifact}.md in the task folder")
  .action(async (taskId: string, opts) => {
    try {
      await runContext(taskId, { artifact: opts.artifact, save: opts.save });
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("open")
  .description("Open spec.md, plan.md, or tasks.md in the editor")
  .argument("<task-id>", "Task ID")
  .option("--artifact <id>", "Artifact: spec, plan, or tasks; default: next incomplete")
  .action(async (taskId: string, opts) => {
    try {
      await runOpen(taskId, { artifact: opts.artifact });
    } catch (err) {
      exitWithError(err);
    }
  });

function exitWithError(err: unknown): never {
  const message = err instanceof Error ? err.message : String(err);
  console.error(chalk.red(`✗ ${message}`));
  process.exit(1);
}

const ALL_COMMANDS = [
  "init", "new", "export", "run-spec",
  "list", "status", "validate", "doctor", "context", "open",
];

const args = process.argv.slice(2);
const hasSubcommand =
  args.length > 0 &&
  !args[0].startsWith("-") &&
  ALL_COMMANDS.includes(args[0]);

if (!hasSubcommand && args.length === 0) {
  printBanner();
  program.help();
} else {
  program.parse(process.argv);
}

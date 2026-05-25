import { Command } from "commander";
import chalk from "chalk";
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
  .description("AI Spec Protocol — especificação assistida por IA (AISP)")
  .version("0.1.0");

// ─── v0.1 ────────────────────────────────────────────────────────────────────

program
  .command("init")
  .description("Inicializa ./.spec-protocol no repositório atual")
  .option("--no-gitignore", "Pula a atualização do .gitignore")
  .action(async (opts) => {
    try {
      await runInit(process.cwd(), { noGitignore: !opts.gitignore });
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("new")
  .description("Cria estrutura de pastas e artefatos para uma tarefa")
  .argument("<task-id>", "ID da tarefa (ex.: JIRA-123)")
  .action(async (taskId: string) => {
    try {
      await runNew(taskId);
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("export")
  .description("Gera spec-kit-input.md consolidado para o Spec-Kit")
  .argument("<task-id>", "ID da tarefa")
  .action(async (taskId: string) => {
    try {
      await runExport(taskId);
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("run-spec")
  .description("Executa o CLI do Spec-Kit (specify) com o export da tarefa")
  .argument("<task-id>", "ID da tarefa")
  .action(async (taskId: string) => {
    try {
      const code = await runRunSpec(taskId);
      process.exit(code);
    } catch (err) {
      exitWithError(err);
    }
  });

// ─── v1.1 ────────────────────────────────────────────────────────────────────

program
  .command("list")
  .description("Lista todas as tarefas em .spec-protocol/tasks/")
  .action(async () => {
    try {
      await runList();
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("status")
  .description("Exibe o painel de progresso das 5 etapas de uma tarefa")
  .argument("<task-id>", "ID da tarefa")
  .action(async (taskId: string) => {
    try {
      await runStatus(taskId);
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("validate")
  .description("Valida etapas críticas antes do export (exit code 0/1 — útil em CI)")
  .argument("<task-id>", "ID da tarefa")
  .option("--json", "Saída em JSON para integração com CI/scripts")
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
  .description("Health check do ambiente e do projeto")
  .action(async () => {
    try {
      await runDoctor();
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("context")
  .description("Gera roteiro de contexto para colar no Cursor/IA")
  .argument("<task-id>", "ID da tarefa")
  .option("--stage <n>", "Etapa específica (1–5); padrão: próxima incompleta", parseInt)
  .option("--save", "Salva o roteiro em context-stage-N.md na pasta da tarefa")
  .action(async (taskId: string, opts) => {
    try {
      await runContext(taskId, { stage: opts.stage, save: opts.save });
    } catch (err) {
      exitWithError(err);
    }
  });

program
  .command("open")
  .description("Abre artifact ou answer no editor detectado (Cursor, VS Code…)")
  .argument("<task-id>", "ID da tarefa")
  .option("--stage <n>", "Etapa específica (1–5); padrão: próxima incompleta", parseInt)
  .option("--answer", "Abre o arquivo de resposta em vez do artifact")
  .action(async (taskId: string, opts) => {
    try {
      await runOpen(taskId, { stage: opts.stage, answer: opts.answer });
    } catch (err) {
      exitWithError(err);
    }
  });

// ─── helpers ─────────────────────────────────────────────────────────────────

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

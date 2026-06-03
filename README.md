# AI Spec Protocol CLI

[![npm version](https://img.shields.io/npm/v/spec-protocol-cli?logo=npm&color=brightgreen)](https://www.npmjs.com/package/spec-protocol-cli)
[![license](https://img.shields.io/npm/l/spec-protocol-cli?color=blue)](https://github.com/spec-protocol/spec-protocol-cli/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/spec-protocol-cli?color=yellow)](https://nodejs.org)

CLI para adoção do **AI Spec Protocol / Protocolo de Especificações Assistidas por IA**, com fluxo **AISP** para refinamento técnico antes da implementação.

## Idiomas / Languages

- [Português](#português)
- [English](#english)

---

## Português

### AISP - Protocolo de Especificações / RTA Refinamento Técnico Assistido Por IA
#### AISP - AI Spec Protocol / IA-ATR AI-Assisted Technical Refinement

O fluxo **AISP (AI Spec Protocol / AI-Assisted Technical Refinement)** é o refinamento técnico assistido por IA guiado pelo **AI Spec Protocol**. Ele ajuda times de software a reduzir incerteza antes da implementação, usando skills de IA e artefatos versionáveis no próprio repositório.

Com a CLI, você prepara o projeto para trabalhar com `spec.md`, `plan.md` e `tasks.md`, instalando também as skills Spec Protocol em `.agents/skills/`.

### Recursos principais

- **Skills AISP na IDE**: pack instalado em `.agents/skills/` para uso com Cursor, Antigravity e ferramentas compatíveis.
- **Artefatos do protocolo**: `spec.md`, `plan.md` e `tasks.md` em `.spec-protocol/tasks/<ID>/`.
- **Validação CI**: `validate` exige `spec.md` e `plan.md` preenchidos antes do export.
- **Spec-Kit**: `export` consolida artefatos em `spec-kit-input.md`.
- **Seguro por design**: `spawn`/`execFile` sem shell arbitrário.

### Skills instaladas

O comando `spec-protocol init` instala **sete** skills no pack npm. A skill `@spec-protocol-help` existe neste repositório para onboarding na IDE e **não** é copiada pelo `init`.

| Skill                       | Função                                                          |
| --------------------------- | --------------------------------------------------------------- |
| `@spec-protocol-triage`     | Classifica tipo, risco e fluxo recomendado                      |
| `@spec-protocol-analyze`    | Cruza card e codebase para atualizar `spec.md`                  |
| `@spec-protocol-dor`        | Decide prontidão proporcional ao risco                          |
| `@spec-protocol-po`         | Gera coespecificação com decisões A/B para o PO                 |
| `@spec-protocol-revalidate` | Revalida respostas do PO e fecha lacunas                        |
| `@spec-protocol-plan`       | Gera/refina `plan.md` e `tasks.md`                              |
| `@spec-protocol-exception`  | Registra bypass formal com risco aceito                         |
| `@spec-protocol-help`       | Onboarding do Spec Protocol na IDE (fluxo, skills, CLI) — só no repo |

### Convenções AISP

`@spec-protocol-triage` é a entrada principal. Ela classifica tipo de trabalho e risco; demandas de baixo risco só pulam para `@spec-protocol-plan` quando têm objetivo claro, escopo delimitado, critério testável e nenhuma decisão `[CRITICAL]` pendente.

Use uma taxonomia única em todos os artefatos (inglês canônico; aliases PT aceitos pelo `validate` na 2.0.0):

- `[CRITICAL]`: bloqueia início ou pode mudar escopo/solução.
- `[RISK]`: pode gerar efeito colateral relevante.
- `[HYPOTHESIS]`: inferência sem evidência direta.
- `[OBSERVATION]`: útil, mas não bloqueia.

`EXCEPTION APPROVED` só é válida quando `@spec-protocol-exception` registra motivo, riscos aceitos, responsável pela decisão e revisão pós-entrega.

### Fluxo de trabalho

```text
1. spec-protocol init
   Cria .spec-protocol/ e instala .agents/skills/spec-protocol-*

2. spec-protocol new JIRA-123
   Cria spec.md, plan.md e tasks.md para a demanda

3. IDE + skills Spec Protocol
   Use @spec-protocol-triage como entrada; @spec-protocol-help para visão geral do fluxo

4. spec-protocol export
   Gera spec-kit-input.md a partir dos artefatos

5. spec-protocol run-spec JIRA-123
   Executa Spec-Kit com spec-kit-input.md
```

### Instalação

Use a CLI de forma pontual:

```bash
npx spec-protocol-cli init
yarn dlx spec-protocol-cli init
```

Ou instale globalmente:

```bash
npm install -g spec-protocol-cli
yarn global add spec-protocol-cli
```

### Referência rápida de comandos

O executável da CLI responde pelo comando `spec-protocol`.

| Comando                                                     | Descrição                                                   |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| `spec-protocol` ou `spec-protocol --help`                   | Lista subcomandos e opções (help do Commander)              |
| `spec-protocol init [--no-gitignore]`                       | Inicializa `.spec-protocol/` e instala skills Spec Protocol |
| `spec-protocol new <task-id>`                               | Cria `spec.md`, `plan.md` e `tasks.md`                      |
| `spec-protocol list`                                        | Lista tarefas e progresso dos artefatos                     |
| `spec-protocol status <task-id>`                            | Exibe painel de preenchimento dos artefatos                 |
| `spec-protocol context <task-id>`                           | Mostra roteiro AISP e skills sugeridas para a IDE            |
| `spec-protocol open <task-id> [--artifact spec,plan,tasks]` | Abre artefato no editor                                     |
| `spec-protocol validate <task-id>`                          | Valida artefatos críticos para CI                           |
| `spec-protocol export <task-id>`                            | Gera `spec-kit-input.md`                                    |
| `spec-protocol run-spec <task-id>`                          | Executa Spec-Kit com o export                               |
| `spec-protocol doctor`                                      | Executa health check do protocolo, skills e templates       |

### Configuração

Após executar `init`, a CLI cria `.spec-protocol/config.json`:

```json
{
  "squad": "Nome da Squad",
  "ide": "Cursor",
  "specKit": {
    "command": "specify",
    "args": []
  },
  "createdAt": "2026-05-24T22:00:00.000Z"
}
```

- `squad`: nome da squad que assina as especificações geradas.
- `ide`: editor preferencial de desenvolvimento (`Cursor`, `VS Code`, `JetBrains`, `Other`).
- `specKit`: executável e argumentos para rodar o Spec-Kit.

### Taxonomia e locale

- CLI, templates e `validate` usam taxonomia **em inglês** (`[CRITICAL]`, `READY`, headings EN).
- Idioma do chat com o usuário é decisão do agente na IDE; a CLI não persiste locale.
- Nomes técnicos: `spec.md`, `plan.md`, `tasks.md`, `@spec-protocol-`*.

### Upgrade (2.0.0+)

- Reinstale: `npm install -g spec-protocol-cli@2.0.1`
- Rode `spec-protocol init` para instalar skills `spec-protocol-*` (substituem `rta-*` legadas).
- Recrie tarefas com headings/tags antigos se o `validate` falhar; aliases PT ainda aceitos na 2.0.0.
- Campo `config.language` legado é ignorado.
- Valide com `spec-protocol doctor`.
- **Não suportado:** tarefas com subpastas `artifacts/` e `answers/`. Recrie com `spec-protocol new <ID>`.

### Desenvolvimento local

```bash
git clone https://github.com/spec-protocol/spec-protocol-cli.git
cd spec-protocol-cli
npm install
npm run build
npm link
```

Após o `npm link`, o binário local fica disponível como `spec-protocol`.

### Segurança

- **Whitelist de arquivos**: o pacote npm publica `dist/`, `templates/`, skills Spec Protocol em `.agents/skills/spec-protocol-*/`, `README.md` e `LICENSE`.
- **Prevenção de execução de shell**: chamadas a processos filhos usam vetores de argumentos e `shell: false`.
- **Auditoria**: dependências devem ser verificadas com `npm audit` antes da publicação.

### Licença

Este projeto é licenciado sob os termos da [Licença MIT](LICENSE).

### Governança do projeto

- [Convenção de versionamento](VERSIONING.md)
- [Como contribuir](CONTRIBUTING.md)

---

## English

### AISP - AI Spec Protocol / AI-Assisted Technical Refinement

The **AISP (AI Spec Protocol / AI-Assisted Technical Refinement)** workflow is AI-assisted technical refinement guided by the **AI Spec Protocol**. It helps software teams reduce uncertainty before implementation by using AI skills and versioned artifacts inside the repository.

The CLI prepares your project to work with `spec.md`, `plan.md`, and `tasks.md`, and installs the Spec Protocol skills under `.agents/skills/`.

### Key features

- **AI refinement skills in the IDE**: skill pack installed in `.agents/skills/` for Cursor, Antigravity, and compatible tools.
- **Protocol artifacts**: `spec.md`, `plan.md`, and `tasks.md` under `.spec-protocol/tasks/<ID>/`.
- **CI validation**: `validate` requires filled `spec.md` and `plan.md` before export.
- **Spec-Kit bridge**: `export` consolidates artifacts into `spec-kit-input.md`.
- **Secure by design**: `spawn`/`execFile` without arbitrary shell execution.

### Installed skills

`spec-protocol init` installs **seven** skills from the npm pack. `@spec-protocol-help` lives in this repository for IDE onboarding and is **not** copied by `init`.

| Skill                       | Purpose                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `@spec-protocol-triage`     | Classifies work type, risk, and recommended flow                 |
| `@spec-protocol-analyze`    | Cross-checks card and codebase to update `spec.md`               |
| `@spec-protocol-dor`        | Decides readiness proportionally to risk                         |
| `@spec-protocol-po`         | Generates co-specification with A/B decisions for the PO         |
| `@spec-protocol-revalidate` | Revalidates PO responses and closes gaps                         |
| `@spec-protocol-plan`       | Generates/refines `plan.md` and `tasks.md`                       |
| `@spec-protocol-exception`  | Records formal bypass with accepted risk                         |
| `@spec-protocol-help`       | Spec Protocol IDE onboarding (flow, skills, CLI) — repository only |

### AISP conventions

`@spec-protocol-triage` is the main entry point. It classifies work type and risk; low-risk tasks only skip to `@spec-protocol-plan` when they have a clear objective, bounded scope, at least one testable criterion, and no pending `[CRITICAL]` decision.

Use a single taxonomy across all artifacts (English canonical; PT aliases accepted by `validate` in 2.0.0):

- `[CRITICAL]`: blocks start or may change scope/solution.
- `[RISK]`: may cause relevant side effects.
- `[HYPOTHESIS]`: inference without direct evidence.
- `[OBSERVATION]`: useful, but does not block.

`EXCEPTION APPROVED` is valid only when `@spec-protocol-exception` records reason, accepted risks, decision owner, and post-delivery review.

### Workflow

```text
1. spec-protocol init
   Creates .spec-protocol/ and installs .agents/skills/spec-protocol-*

2. spec-protocol new JIRA-123
   Creates spec.md, plan.md, and tasks.md for the task

3. IDE + Spec Protocol skills
   Start with @spec-protocol-triage; use @spec-protocol-help for a full flow overview

4. spec-protocol export
   Generates spec-kit-input.md from the artifacts

5. spec-protocol run-spec JIRA-123
   Runs Spec-Kit with spec-kit-input.md
```

### Installation

Run directly:

```bash
npx spec-protocol-cli init
yarn dlx spec-protocol-cli init
```

Or install globally:

```bash
npm install -g spec-protocol-cli
yarn global add spec-protocol-cli
```

### Command reference

The CLI executable is `spec-protocol`.

| Command                                                     | Description                                                     |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| `spec-protocol` or `spec-protocol --help`                   | Lists subcommands and options (Commander help)                  |
| `spec-protocol init [--no-gitignore]`                       | Initializes `.spec-protocol/` and installs Spec Protocol skills |
| `spec-protocol new <task-id>`                               | Creates `spec.md`, `plan.md`, and `tasks.md`                    |
| `spec-protocol list`                                        | Lists tasks and artifact progress                               |
| `spec-protocol status <task-id>`                            | Shows artifact completion status                                |
| `spec-protocol context <task-id>`                           | Shows AISP guidance and suggested IDE skills                     |
| `spec-protocol open <task-id> [--artifact spec,plan,tasks]` | Opens an artifact in the editor                                 |
| `spec-protocol validate <task-id>`                          | Validates critical artifacts for CI                             |
| `spec-protocol export <task-id>`                            | Generates `spec-kit-input.md`                                   |
| `spec-protocol run-spec <task-id>`                          | Runs Spec-Kit with the generated export                         |
| `spec-protocol doctor`                                      | Runs a health check for protocol, skills, and templates         |

### Configuration

After `init`, the CLI creates `.spec-protocol/config.json`:

```json
{
  "squad": "Team Name",
  "ide": "Cursor",
  "specKit": {
    "command": "specify",
    "args": []
  },
  "createdAt": "2026-05-24T22:00:00.000Z"
}
```

- `squad`: team responsible for the generated specifications.
- `ide`: preferred development editor (`Cursor`, `VS Code`, `JetBrains`, `Other`).
- `specKit`: executable and arguments used to run Spec-Kit.

### Taxonomy and locale

- CLI, templates, and `validate` use **English** taxonomy (`[CRITICAL]`, `READY`, EN headings).
- Chat language with the user is the agent's choice in the IDE; the CLI does not persist locale.
- Technical names: `spec.md`, `plan.md`, `tasks.md`, `@spec-protocol-`*.

### Upgrade (2.0.0+)

- Reinstall: `npm install -g spec-protocol-cli@2.0.1`
- Run `spec-protocol init` to install `spec-protocol-*` skills (replace legacy `rta-*`).
- Recreate tasks with old headings/tags if `validate` fails; PT aliases still accepted in 2.0.0.
- Legacy `config.language` field is ignored.
- Validate with `spec-protocol doctor`.
- **Not supported:** tasks with `artifacts/` and `answers/` subfolders. Recreate with `spec-protocol new <ID>`.

### Local development

```bash
git clone https://github.com/spec-protocol/spec-protocol-cli.git
cd spec-protocol-cli
npm install
npm run build
npm link
```

After `npm link`, the local binary is available as `spec-protocol`.

### Security

- **File whitelist**: the npm package publishes `dist/`, `templates/`, Spec Protocol skills under `.agents/skills/spec-protocol-*/`, `README.md`, and `LICENSE`.
- **Shell execution prevention**: child process calls use argument arrays and `shell: false`.
- **Audit**: dependencies should be checked with `npm audit` before publication.

### License

This project is licensed under the [MIT License](LICENSE).

### Project governance

- [Versioning policy](VERSIONING.md)
- [How to contribute](CONTRIBUTING.md)

---

## 📄 Licença e Isenção de Responsabilidade

Este projeto é licenciado sob os termos da **Licença MIT**.

> **AVISO DE ISENÇÃO DE RESPONSABILIDADE**:
> O SOFTWARE É FORNECIDO "COMO ESTÁ", SEM QUALQUER TIPO DE GARANTIA, EXPRESSA OU IMPLÍCITA. EM NENHUMA CIRCUNSTÂNCIA OS AUTORES OU DETENTORES DOS DIREITOS AUTORAIS SERÃO RESPONSÁVEIS POR QUALQUER RECLAMAÇÃO, DANOS OU OUTRA RESPONSABILIDADE, SEJA EM AÇÃO DE CONTRATO, DELITO OU DE OUTRA FORMA, DECORRENTE DE, OU EM CONEXÃO COM O SOFTWARE OU O USO OU OUTRAS NEGOCIAÇÕES NO SOFTWARE.

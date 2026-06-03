# AI Spec Protocol CLI

[![npm version](https://img.shields.io/npm/v/spec-protocol-cli?logo=npm&color=brightgreen)](https://www.npmjs.com/package/spec-protocol-cli)
[![license](https://img.shields.io/npm/l/spec-protocol-cli?color=blue)](https://github.com/spec-protocol/spec-protocol-cli/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/spec-protocol-cli?color=yellow)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/spec-protocol/spec-protocol-cli/pulls)

CLI para adoção do **AI Spec Protocol / Protocolo de Especificações Assistidas por IA**, com fluxo **AISP** para refinamento técnico antes da implementação.

## Idiomas / Languages / Español

- [Português](#português)
- [English](#english)
- [Español](#español)

---

## Português

### AISP - AI Spec Protocol / AI-Assisted Technical Refinement

O fluxo **AISP (AI Spec Protocol / AI-Assisted Technical Refinement)** é o refinamento técnico assistido por IA guiado pelo **AI Spec Protocol**. Ele ajuda times de software a reduzir incerteza antes da implementação, usando skills de IA e artefatos versionáveis no próprio repositório.

Com a CLI, você prepara o projeto para trabalhar com `spec.md`, `plan.md` e `tasks.md`, instalando também as skills Spec Protocol em `.agents/skills/`.

### Recursos principais

- **Skills AISP na IDE**: pack instalado em `.agents/skills/` para uso com Cursor, Antigravity e ferramentas compatíveis.
- **Artefatos do protocolo**: `spec.md`, `plan.md` e `tasks.md` em `.spec-protocol/tasks/<ID>/`.
- **Validação CI**: `validate` exige `spec.md` e `plan.md` preenchidos antes do export.
- **Spec-Kit**: `export` consolida artefatos em `spec-kit-input.md`.
- **Seguro por design**: `spawn`/`execFile` sem shell arbitrário.

### Skills instaladas


| Skill                       | Função                                          |
| --------------------------- | ----------------------------------------------- |
| `@spec-protocol-triage`     | Classifica tipo, risco e fluxo recomendado      |
| `@spec-protocol-analyze`    | Cruza card e codebase para atualizar `spec.md`  |
| `@spec-protocol-dor`        | Decide prontidão proporcional ao risco          |
| `@spec-protocol-po`         | Gera coespecificação com decisões A/B para o PO |
| `@spec-protocol-revalidate` | Revalida respostas do PO e fecha lacunas        |
| `@spec-protocol-plan`       | Gera/refina `plan.md` e `tasks.md`              |
| `@spec-protocol-exception`  | Registra bypass formal com risco aceito         |


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
   Use @spec-protocol-triage como entrada e siga o fluxo por risco

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
| `spec-protocol init [--no-gitignore]`                       | Inicializa `.spec-protocol/` e instala skills Spec Protocol |
| `spec-protocol new <task-id>`                               | Cria `spec.md`, `plan.md` e `tasks.md`                      |
| `spec-protocol list`                                        | Lista tarefas e progresso dos artefatos                     |
| `spec-protocol status <task-id>`                            | Exibe painel de preenchimento dos artefatos                 |
| `spec-protocol context <task-id>`                           | Mostra roteiro AISP e skills sugeridas para a IDE            |
| `spec-protocol open <task-id> [--artifact spec|plan|tasks]` | Abre artefato no editor                                     |
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

- Reinstale: `npm install -g spec-protocol-cli@2.0.0`
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


| Skill                       | Purpose                                                  |
| --------------------------- | -------------------------------------------------------- |
| `@spec-protocol-triage`     | Classifies work type, risk, and recommended flow         |
| `@spec-protocol-analyze`    | Cross-checks card and codebase to update `spec.md`       |
| `@spec-protocol-dor`        | Decides readiness proportionally to risk                 |
| `@spec-protocol-po`         | Generates co-specification with A/B decisions for the PO |
| `@spec-protocol-revalidate` | Revalidates PO responses and closes gaps                 |
| `@spec-protocol-plan`       | Generates/refines `plan.md` and `tasks.md`               |
| `@spec-protocol-exception`  | Records formal bypass with accepted risk                 |


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
   Start with @spec-protocol-triage and follow the risk-based flow

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
| `spec-protocol init [--no-gitignore]`                       | Initializes `.spec-protocol/` and installs Spec Protocol skills |
| `spec-protocol new <task-id>`                               | Creates `spec.md`, `plan.md`, and `tasks.md`                    |
| `spec-protocol list`                                        | Lists tasks and artifact progress                               |
| `spec-protocol status <task-id>`                            | Shows artifact completion status                                |
| `spec-protocol context <task-id>`                           | Shows AISP guidance and suggested IDE skills                     |
| `spec-protocol open <task-id> [--artifact spec|plan|tasks]` | Opens an artifact in the editor                                 |
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

- Reinstall: `npm install -g spec-protocol-cli@2.0.0`
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

---

## Español

### AISP - AI Spec Protocol / AI-Assisted Technical Refinement

El flujo **AISP (AI Spec Protocol / AI-Assisted Technical Refinement)** es el refinamiento técnico asistido por IA guiado por el **AI Spec Protocol**. Ayuda a equipos de software a reducir incertidumbre antes de la implementación mediante skills de IA y artefactos versionables dentro del repositorio.

La CLI prepara el proyecto para trabajar con `spec.md`, `plan.md` y `tasks.md`, y instala las skills Spec Protocol en `.agents/skills/`.

### Funcionalidades principales

- **Skills AISP en la IDE**: pack instalado en `.agents/skills/` para Cursor, Antigravity y herramientas compatibles.
- **Artefactos del protocolo**: `spec.md`, `plan.md` y `tasks.md` en `.spec-protocol/tasks/<ID>/`.
- **Validación CI**: `validate` exige `spec.md` y `plan.md` completos antes del export.
- **Puente con Spec-Kit**: `export` consolida artefactos en `spec-kit-input.md`.
- **Seguro por diseño**: `spawn`/`execFile` sin ejecución arbitraria de shell.

### Skills instaladas


| Skill                       | Función                                               |
| --------------------------- | ----------------------------------------------------- |
| `@spec-protocol-triage`     | Clasifica tipo de trabajo, riesgo y flujo recomendado |
| `@spec-protocol-analyze`    | Cruza card y codebase para actualizar `spec.md`       |
| `@spec-protocol-dor`        | Decide preparación proporcional al riesgo             |
| `@spec-protocol-po`         | Genera coespecificación con decisiones A/B para el PO |
| `@spec-protocol-revalidate` | Revalida respuestas del PO y cierra brechas           |
| `@spec-protocol-plan`       | Genera/refina `plan.md` y `tasks.md`                  |
| `@spec-protocol-exception`  | Registra bypass formal con riesgo aceptado            |


### Convenciones AISP

`@spec-protocol-triage` es el punto de entrada principal. Clasifica tipo de trabajo y riesgo; las demandas de bajo riesgo solo saltan a `@spec-protocol-plan` cuando tienen objetivo claro, alcance delimitado, criterio testeable y ninguna decisión `[CRITICAL]` pendiente.

Use una taxonomía única en todos los artefactos (inglés canónico; aliases PT aceptados por `validate` en 2.0.0):

- `[CRITICAL]`: bloquea inicio o puede cambiar alcance/solución.
- `[RISK]`: puede generar efecto colateral relevante.
- `[HYPOTHESIS]`: inferencia sin evidencia directa.
- `[OBSERVATION]`: útil, pero no bloquea.

`EXCEPTION APPROVED` solo es válida cuando `@spec-protocol-exception` registra motivo, riesgos aceptados, responsable de la decisión y revisión post-entrega.

### Flujo de trabajo

```text
1. spec-protocol init
   Crea .spec-protocol/ y instala .agents/skills/spec-protocol-*

2. spec-protocol new JIRA-123
   Crea spec.md, plan.md y tasks.md para la demanda

3. IDE + skills Spec Protocol
   Use @spec-protocol-triage como entrada y siga el flujo por riesgo

4. spec-protocol export
   Genera spec-kit-input.md a partir de los artefactos

5. spec-protocol run-spec JIRA-123
   Ejecuta Spec-Kit con spec-kit-input.md
```

### Instalación

Ejecute directamente:

```bash
npx spec-protocol-cli init
yarn dlx spec-protocol-cli init
```

O instale globalmente:

```bash
npm install -g spec-protocol-cli
yarn global add spec-protocol-cli
```

### Referencia rápida de comandos

El ejecutable de la CLI es `spec-protocol`.


| Comando                                                     | Descripción                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| `spec-protocol init [--no-gitignore]`                       | Inicializa `.spec-protocol/` e instala skills Spec Protocol |
| `spec-protocol new <task-id>`                               | Crea `spec.md`, `plan.md` y `tasks.md`                      |
| `spec-protocol list`                                        | Lista demandas y progreso de artefactos                     |
| `spec-protocol status <task-id>`                            | Muestra estado de completitud de los artefactos             |
| `spec-protocol context <task-id>`                           | Muestra guía AISP y skills sugeridas para la IDE             |
| `spec-protocol open <task-id> [--artifact spec|plan|tasks]` | Abre un artefacto en el editor                              |
| `spec-protocol validate <task-id>`                          | Valida artefactos críticos para CI                          |
| `spec-protocol export <task-id>`                            | Genera `spec-kit-input.md`                                  |
| `spec-protocol run-spec <task-id>`                          | Ejecuta Spec-Kit con el export generado                     |
| `spec-protocol doctor`                                      | Ejecuta health check de protocolo, skills y templates       |


### Configuración

Después de `init`, la CLI crea `.spec-protocol/config.json`:

```json
{
  "squad": "Nombre del equipo",
  "ide": "Cursor",
  "specKit": {
    "command": "specify",
    "args": []
  },
  "createdAt": "2026-05-24T22:00:00.000Z"
}
```

- `squad`: equipo responsable por las especificaciones generadas.
- `ide`: editor preferido (`Cursor`, `VS Code`, `JetBrains`, `Other`).
- `specKit`: ejecutable y argumentos para ejecutar Spec-Kit.

### Taxonomía y locale

- CLI, templates y `validate` usan taxonomía **en inglés** (`[CRITICAL]`, `READY`, headings EN).
- El idioma del chat con el usuario lo decide el agente en la IDE; la CLI no persiste locale.
- Nombres técnicos: `spec.md`, `plan.md`, `tasks.md`, `@spec-protocol-`*.

### Actualización (2.0.0+)

- Reinstale: `npm install -g spec-protocol-cli@2.0.0`
- Ejecute `spec-protocol init` para instalar skills `spec-protocol-*` (reemplazan `rta-*` legadas).
- Recree tareas con headings/tags antiguos si `validate` falla; aliases PT aún aceptados en 2.0.0.
- Campo `config.language` legado se ignora.
- Valide con `spec-protocol doctor`.
- **No soportado:** tareas con subcarpetas `artifacts/` y `answers/`. Recree con `spec-protocol new <ID>`.

### Desarrollo local

```bash
git clone https://github.com/spec-protocol/spec-protocol-cli.git
cd spec-protocol-cli
npm install
npm run build
npm link
```

Después de `npm link`, el binario local queda disponible como `spec-protocol`.

### Seguridad

- **Whitelist de archivos**: el paquete npm publica `dist/`, `templates/`, skills Spec Protocol en `.agents/skills/spec-protocol-*/`, `README.md` y `LICENSE`.
- **Prevención de ejecución de shell**: las llamadas a procesos hijos usan arrays de argumentos y `shell: false`.
- **Auditoría**: las dependencias deben verificarse con `npm audit` antes de publicar.

### Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

## 🛡️ Segurança

A segurança e integridade do seu repositório de código são nossas maiores prioridades:

- **Whitelist de Arquivos**: O empacotamento para publicação no npm utiliza a regra estrita `files` do `package.json`. Apenas a pasta `dist/` (compilada), a pasta de `templates/`, o `README.md` e o `LICENSE` são enviados. Arquivos locais de configuração, arquivos `.env`, chaves privadas e o código-fonte original ficam 100% de fora do pacote final.
- **Prevenção de Execução de Shell**: Nenhuma chamada a processos filhos (como abertura de editores via `open` ou execução do Spec-Kit via `specify`) realiza avaliação arbitrária de string no shell (parâmetro `shell: false`). As chamadas são diretas usando vetores de argumentos (`spawn`/`execFile`), prevenindo riscos de command injection.
- **Nota de Auditoria**: Mantemos nossas dependências livres de vulnerabilidades críticas através de auditorias recorrentes do `npm audit`.

---

## 📄 Licença e Isenção de Responsabilidade

Este projeto é licenciado sob os termos da **Licença MIT**.

> **AVISO DE ISENÇÃO DE RESPONSABILIDADE**:
> O SOFTWARE É FORNECIDO "COMO ESTÁ", SEM QUALQUER TIPO DE GARANTIA, EXPRESSA OU IMPLÍCITA. EM NENHUMA CIRCUNSTÂNCIA OS AUTORES OU DETENTORES DOS DIREITOS AUTORAIS SERÃO RESPONSÁVEIS POR QUALQUER RECLAMAÇÃO, DANOS OU OUTRA RESPONSABILIDADE, SEJA EM AÇÃO DE CONTRATO, DELITO OU DE OUTRA FORMA, DECORRENTE DE, OU EM CONEXÃO COM O SOFTWARE OU O USO OU OUTRAS NEGOCIAÇÕES NO SOFTWARE.


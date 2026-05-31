# AI Spec Protocol CLI

[![npm version](https://img.shields.io/npm/v/spec-protocol-cli?logo=npm&color=brightgreen)](https://www.npmjs.com/package/spec-protocol-cli)
[![license](https://img.shields.io/npm/l/spec-protocol-cli?color=blue)](https://github.com/spec-protocol/spec-protocol-cli/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/spec-protocol-cli?color=yellow)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/spec-protocol/spec-protocol-cli/pulls)

CLI para adoção do **AI Spec Protocol / Protocolo de Especificações Assistidas por IA**, com fluxo **RTA / AI-ATR** para refinamento técnico antes da implementação.

## Idiomas / Languages / Español

- [Português](#português)
- [English](#english)
- [Español](#español)

---

## Português

### RTA / AI-ATR — Refinamento Técnico Assistido por IA

O par **RTA / AI-ATR (Refinamento Técnico Assistido por IA / AI-Assisted Technical Refinement)** é o fluxo operacional guiado pelo **Protocolo de Especificações Assistidas por IA**. Ele ajuda times de software a reduzir incerteza antes da implementação, usando skills de IA e artefatos versionáveis no próprio repositório.

Com a CLI, você prepara o projeto para trabalhar com `spec.md`, `plan.md` e `tasks.md`, instalando também as skills RTA em `.agents/skills/`.

### Recursos principais

- **Skills RTA na IDE**: pack instalado em `.agents/skills/` para uso com Cursor, Antigravity e ferramentas compatíveis.
- **Artefatos do protocolo**: `spec.md`, `plan.md` e `tasks.md` em `.spec-protocol/tasks/<ID>/`.
- **Validação CI**: `validate` exige `spec.md` e `plan.md` preenchidos antes do export.
- **Spec-Kit**: `export` consolida artefatos em `spec-kit-input.md`.
- **Seguro por design**: `spawn`/`execFile` sem shell arbitrário.

### Skills instaladas

| Skill | Função |
| :--- | :--- |
| `@rta-triagem` | Classifica tipo, risco e fluxo recomendado |
| `@rta-analise` | Cruza card e codebase para atualizar `spec.md` |
| `@rta-dor` | Decide prontidão proporcional ao risco |
| `@rta-po` | Gera coespecificação com decisões A/B para o PO |
| `@rta-revalidacao` | Revalida respostas do PO e fecha lacunas |
| `@rta-plan` | Gera/refina `plan.md` e `tasks.md` |
| `@rta-excecao` | Registra bypass formal com risco aceito |

### Convenções RTA

`@rta-triagem` é a entrada principal. Ela classifica tipo de trabalho e risco; demandas de baixo risco só pulam para `@rta-plan` quando têm objetivo claro, escopo delimitado, critério testável e nenhuma decisão `[CRÍTICO]` pendente.

Use uma taxonomia única em todos os artefatos:

- `[CRÍTICO]`: bloqueia início ou pode mudar escopo/solução.
- `[RISCO]`: pode gerar efeito colateral relevante.
- `[HIPÓTESE]`: inferência sem evidência direta.
- `[OBSERVAÇÃO]`: útil, mas não bloqueia.

`EXCEÇÃO APROVADA` só é válida quando `@rta-excecao` registra motivo, riscos aceitos, responsável pela decisão e revisão pós-entrega.

### Fluxo de trabalho

```text
1. spec-protocol init
   Cria .spec-protocol/ e instala .agents/skills/rta-*

2. spec-protocol new JIRA-123
   Cria spec.md, plan.md e tasks.md para a demanda

3. IDE + skills RTA
   Use @rta-triagem como entrada e siga o fluxo por risco

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

| Comando | Descrição |
| :--- | :--- |
| `spec-protocol init [--no-gitignore]` | Inicializa `.spec-protocol/`, instala skills RTA e pergunta idioma (`pt-BR`, `en`, `es`) |
| `spec-protocol new <task-id>` | Cria `spec.md`, `plan.md` e `tasks.md` |
| `spec-protocol list` | Lista tarefas e progresso dos artefatos |
| `spec-protocol status <task-id>` | Exibe painel de preenchimento dos artefatos |
| `spec-protocol context <task-id>` | Mostra roteiro RTA e skills sugeridas para a IDE |
| `spec-protocol open <task-id> [--artifact spec\|plan\|tasks]` | Abre artefato no editor |
| `spec-protocol validate <task-id>` | Valida artefatos críticos para CI |
| `spec-protocol export <task-id>` | Gera `spec-kit-input.md` |
| `spec-protocol run-spec <task-id>` | Executa Spec-Kit com o export |
| `spec-protocol doctor` | Executa health check do protocolo, skills e templates |

### Configuração

Após executar `init`, a CLI cria `.spec-protocol/config.json`:

```json
{
  "squad": "Nome da Squad",
  "ide": "Cursor",
  "language": "pt-BR",
  "specKit": {
    "command": "specify",
    "args": []
  },
  "createdAt": "2026-05-24T22:00:00.000Z"
}
```

- `squad`: nome da squad que assina as especificações geradas.
- `ide`: editor preferencial de desenvolvimento (`Cursor`, `VS Code`, `JetBrains`, `Outro`).
- `language`: idioma do projeto (`pt-BR`, `en`, `es`). Escolhido no `init`. Projetos antigos sem esse campo usam fallback `pt-BR`.
- `specKit`: executável e argumentos para rodar o Spec-Kit.

### Idiomas (i18n)

- No `init`, escolha entre **Português (Brasil)**, **English** ou **Español**.
- A escolha afeta templates gerados por `new`, roteiros do `context`, labels do `export`, `status`, `validate`, `list`, labels de artefatos e instrução de idioma nas skills instaladas.
- Nomes técnicos permanecem iguais: `spec.md`, `plan.md`, `tasks.md`, `@rta-*`.
- Tags RTA (`[CRÍTICO]`, `[RISCO]`, etc.) permanecem em português em todos os idiomas.
- Rode `spec-protocol init` novamente para sincronizar o bloco de idioma nas skills já instaladas.

### Upgrade (1.0.1+)

- Reinstale o pacote para obter templates em `templates/{pt-BR,en,es}/`: `npm install -g spec-protocol-cli@latest`
- Valide com `spec-protocol doctor` (checa templates i18n e `config.language`)
- **Não suportado:** tarefas no formato antigo com subpastas `artifacts/` e `answers/`. Recrie com `spec-protocol new <ID>` e preencha `spec.md`, `plan.md` e `tasks.md` na raiz da pasta da tarefa.

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

- **Whitelist de arquivos**: o pacote npm publica `dist/`, `templates/`, skills RTA em `.agents/skills/rta-*/`, `README.md` e `LICENSE`.
- **Prevenção de execução de shell**: chamadas a processos filhos usam vetores de argumentos e `shell: false`.
- **Auditoria**: dependências devem ser verificadas com `npm audit` antes da publicação.

### Licença

Este projeto é licenciado sob os termos da [Licença MIT](LICENSE).

---

## English

### RTA / AI-ATR — AI-Assisted Technical Refinement

The **RTA / AI-ATR (Refinamento Técnico Assistido por IA / AI-Assisted Technical Refinement)** pair is the operational workflow guided by the **AI Spec Protocol**. It helps software teams reduce uncertainty before implementation by using AI skills and versioned artifacts inside the repository.

The CLI prepares your project to work with `spec.md`, `plan.md`, and `tasks.md`, and installs the RTA skills under `.agents/skills/`.

### Key features

- **AI refinement skills in the IDE**: skill pack installed in `.agents/skills/` for Cursor, Antigravity, and compatible tools.
- **Protocol artifacts**: `spec.md`, `plan.md`, and `tasks.md` under `.spec-protocol/tasks/<ID>/`.
- **CI validation**: `validate` requires filled `spec.md` and `plan.md` before export.
- **Spec-Kit bridge**: `export` consolidates artifacts into `spec-kit-input.md`.
- **Secure by design**: `spawn`/`execFile` without arbitrary shell execution.

### Installed skills

| Skill | Purpose |
| :--- | :--- |
| `@rta-triagem` | Classifies work type, risk, and recommended flow |
| `@rta-analise` | Cross-checks card and codebase to update `spec.md` |
| `@rta-dor` | Decides readiness proportionally to risk |
| `@rta-po` | Generates co-specification with A/B decisions for the PO |
| `@rta-revalidacao` | Revalidates PO responses and closes gaps |
| `@rta-plan` | Generates/refines `plan.md` and `tasks.md` |
| `@rta-excecao` | Records formal bypass with accepted risk |

### RTA conventions

`@rta-triagem` is the main entry point. It classifies work type and risk; low-risk tasks only skip to `@rta-plan` when they have a clear objective, bounded scope, at least one testable criterion, and no pending `[CRÍTICO]` decision.

Use a single taxonomy across all artifacts:

- `[CRÍTICO]`: blocks start or may change scope/solution.
- `[RISCO]`: may cause relevant side effects.
- `[HIPÓTESE]`: inference without direct evidence.
- `[OBSERVAÇÃO]`: useful, but does not block.

`EXCEÇÃO APROVADA` is valid only when `@rta-excecao` records reason, accepted risks, decision owner, and post-delivery review.

### Workflow

```text
1. spec-protocol init
   Creates .spec-protocol/ and installs .agents/skills/rta-*

2. spec-protocol new JIRA-123
   Creates spec.md, plan.md, and tasks.md for the task

3. IDE + RTA skills
   Start with @rta-triagem and follow the risk-based flow

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

| Command | Description |
| :--- | :--- |
| `spec-protocol init [--no-gitignore]` | Initializes `.spec-protocol/`, installs RTA skills, and prompts for language (`pt-BR`, `en`, `es`) |
| `spec-protocol new <task-id>` | Creates `spec.md`, `plan.md`, and `tasks.md` |
| `spec-protocol list` | Lists tasks and artifact progress |
| `spec-protocol status <task-id>` | Shows artifact completion status |
| `spec-protocol context <task-id>` | Shows RTA guidance and suggested IDE skills |
| `spec-protocol open <task-id> [--artifact spec\|plan\|tasks]` | Opens an artifact in the editor |
| `spec-protocol validate <task-id>` | Validates critical artifacts for CI |
| `spec-protocol export <task-id>` | Generates `spec-kit-input.md` |
| `spec-protocol run-spec <task-id>` | Runs Spec-Kit with the generated export |
| `spec-protocol doctor` | Runs a health check for protocol, skills, and templates |

### Configuration

After `init`, the CLI creates `.spec-protocol/config.json`:

```json
{
  "squad": "Team Name",
  "ide": "Cursor",
  "language": "en",
  "specKit": {
    "command": "specify",
    "args": []
  },
  "createdAt": "2026-05-24T22:00:00.000Z"
}
```

- `squad`: team responsible for the generated specifications.
- `ide`: preferred development editor (`Cursor`, `VS Code`, `JetBrains`, `Other`).
- `language`: project language (`pt-BR`, `en`, `es`). Selected during `init`. Legacy configs without this field fall back to `pt-BR`.
- `specKit`: executable and arguments used to run Spec-Kit.

### Languages (i18n)

- During `init`, choose **Português (Brasil)**, **English**, or **Español**.
- The choice affects templates from `new`, `context` guides, `export` labels, `status`, `validate`, `list`, artifact labels, and language instructions in installed skills.
- Technical names stay unchanged: `spec.md`, `plan.md`, `tasks.md`, `@rta-*`.
- RTA taxonomy tags (`[CRÍTICO]`, `[RISCO]`, etc.) stay in Portuguese in all languages.
- Run `spec-protocol init` again to sync the language block on already installed skills.

### Upgrade (1.0.1+)

- Reinstall the package for `templates/{pt-BR,en,es}/`: `npm install -g spec-protocol-cli@latest`
- Validate with `spec-protocol doctor` (i18n templates and `config.language`)
- **Not supported:** legacy tasks with `artifacts/` and `answers/` subfolders. Recreate with `spec-protocol new <ID>` and fill `spec.md`, `plan.md`, and `tasks.md` at the task folder root.

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

- **File whitelist**: the npm package publishes `dist/`, `templates/`, RTA skills under `.agents/skills/rta-*/`, `README.md`, and `LICENSE`.
- **Shell execution prevention**: child process calls use argument arrays and `shell: false`.
- **Audit**: dependencies should be checked with `npm audit` before publication.

### License

This project is licensed under the [MIT License](LICENSE).

---

## Español

### RTA / AI-ATR — Refinamiento Técnico Asistido por IA

El par **RTA / AI-ATR (Refinamiento Técnico Asistido por IA / AI-Assisted Technical Refinement)** es el flujo operativo guiado por el **Protocolo de Especificaciones Asistidas por IA**. Ayuda a equipos de software a reducir incertidumbre antes de la implementación mediante skills de IA y artefactos versionables dentro del repositorio.

La CLI prepara el proyecto para trabajar con `spec.md`, `plan.md` y `tasks.md`, y instala las skills RTA en `.agents/skills/`.

### Funcionalidades principales

- **Skills RTA en la IDE**: pack instalado en `.agents/skills/` para Cursor, Antigravity y herramientas compatibles.
- **Artefactos del protocolo**: `spec.md`, `plan.md` y `tasks.md` en `.spec-protocol/tasks/<ID>/`.
- **Validación CI**: `validate` exige `spec.md` y `plan.md` completos antes del export.
- **Puente con Spec-Kit**: `export` consolida artefactos en `spec-kit-input.md`.
- **Seguro por diseño**: `spawn`/`execFile` sin ejecución arbitraria de shell.

### Skills instaladas

| Skill | Función |
| :--- | :--- |
| `@rta-triagem` | Clasifica tipo de trabajo, riesgo y flujo recomendado |
| `@rta-analise` | Cruza card y codebase para actualizar `spec.md` |
| `@rta-dor` | Decide preparación proporcional al riesgo |
| `@rta-po` | Genera coespecificación con decisiones A/B para el PO |
| `@rta-revalidacao` | Revalida respuestas del PO y cierra brechas |
| `@rta-plan` | Genera/refina `plan.md` y `tasks.md` |
| `@rta-excecao` | Registra bypass formal con riesgo aceptado |

### Convenciones RTA

`@rta-triagem` es el punto de entrada principal. Clasifica tipo de trabajo y riesgo; las demandas de bajo riesgo solo saltan a `@rta-plan` cuando tienen objetivo claro, alcance delimitado, criterio testeable y ninguna decisión `[CRÍTICO]` pendiente.

Use una taxonomía única en todos los artefactos:

- `[CRÍTICO]`: bloquea inicio o puede cambiar alcance/solución.
- `[RISCO]`: puede generar efecto colateral relevante.
- `[HIPÓTESE]`: inferencia sin evidencia directa.
- `[OBSERVAÇÃO]`: útil, pero no bloquea.

`EXCEÇÃO APROVADA` solo es válida cuando `@rta-excecao` registra motivo, riesgos aceptados, responsable de la decisión y revisión post-entrega.

### Flujo de trabajo

```text
1. spec-protocol init
   Crea .spec-protocol/ y instala .agents/skills/rta-*

2. spec-protocol new JIRA-123
   Crea spec.md, plan.md y tasks.md para la demanda

3. IDE + skills RTA
   Use @rta-triagem como entrada y siga el flujo por riesgo

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

| Comando | Descripción |
| :--- | :--- |
| `spec-protocol init [--no-gitignore]` | Inicializa `.spec-protocol/`, instala skills RTA y pregunta idioma (`pt-BR`, `en`, `es`) |
| `spec-protocol new <task-id>` | Crea `spec.md`, `plan.md` y `tasks.md` |
| `spec-protocol list` | Lista demandas y progreso de artefactos |
| `spec-protocol status <task-id>` | Muestra estado de completitud de los artefactos |
| `spec-protocol context <task-id>` | Muestra guía RTA y skills sugeridas para la IDE |
| `spec-protocol open <task-id> [--artifact spec\|plan\|tasks]` | Abre un artefacto en el editor |
| `spec-protocol validate <task-id>` | Valida artefactos críticos para CI |
| `spec-protocol export <task-id>` | Genera `spec-kit-input.md` |
| `spec-protocol run-spec <task-id>` | Ejecuta Spec-Kit con el export generado |
| `spec-protocol doctor` | Ejecuta health check de protocolo, skills y templates |

### Configuración

Después de `init`, la CLI crea `.spec-protocol/config.json`:

```json
{
  "squad": "Nombre del equipo",
  "ide": "Cursor",
  "language": "es",
  "specKit": {
    "command": "specify",
    "args": []
  },
  "createdAt": "2026-05-24T22:00:00.000Z"
}
```

- `squad`: equipo responsable por las especificaciones generadas.
- `ide`: editor preferido (`Cursor`, `VS Code`, `JetBrains`, `Otro`).
- `language`: idioma del proyecto (`pt-BR`, `en`, `es`). Elegido en `init`. Proyectos antiguos sin este campo usan fallback `pt-BR`.
- `specKit`: ejecutable y argumentos para ejecutar Spec-Kit.

### Idiomas (i18n)

- En `init`, elija **Português (Brasil)**, **English** o **Español**.
- La elección afecta templates de `new`, guías de `context`, labels de `export`, `status`, `validate`, `list`, labels de artefactos e instrucciones de idioma en skills instaladas.
- Los nombres técnicos permanecen iguales: `spec.md`, `plan.md`, `tasks.md`, `@rta-*`.
- Las tags RTA (`[CRÍTICO]`, `[RISCO]`, etc.) permanecen en portugués en todos los idiomas.
- Ejecute `spec-protocol init` de nuevo para sincronizar el bloque de idioma en skills ya instaladas.

### Actualización (1.0.1+)

- Reinstale el paquete para obtener `templates/{pt-BR,en,es}/`: `npm install -g spec-protocol-cli@latest`
- Valide con `spec-protocol doctor` (templates i18n y `config.language`)
- **No soportado:** tareas en formato antiguo con subcarpetas `artifacts/` y `answers/`. Recree con `spec-protocol new <ID>` y complete `spec.md`, `plan.md` y `tasks.md` en la raíz de la tarea.

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

- **Whitelist de archivos**: el paquete npm publica `dist/`, `templates/`, skills RTA en `.agents/skills/rta-*/`, `README.md` y `LICENSE`.
- **Prevención de ejecución de shell**: las llamadas a procesos hijos usan arrays de argumentos y `shell: false`.
- **Auditoría**: las dependencias deben verificarse con `npm audit` antes de publicar.

### Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).


## 🛡️ Segurança

A segurança e integridade do seu repositório de código são nossas maiores prioridades:
*   **Whitelist de Arquivos**: O empacotamento para publicação no npm utiliza a regra estrita `files` do `package.json`. Apenas a pasta `dist/` (compilada), a pasta de `templates/`, o `README.md` e o `LICENSE` são enviados. Arquivos locais de configuração, arquivos `.env`, chaves privadas e o código-fonte original ficam 100% de fora do pacote final.
*   **Prevenção de Execução de Shell**: Nenhuma chamada a processos filhos (como abertura de editores via `open` ou execução do Spec-Kit via `specify`) realiza avaliação arbitrária de string no shell (parâmetro `shell: false`). As chamadas são diretas usando vetores de argumentos (`spawn`/`execFile`), prevenindo riscos de command injection.
*   **Nota de Auditoria**: Mantemos nossas dependências livres de vulnerabilidades críticas através de auditorias recorrentes do `npm audit`.

---

## 📄 Licença e Isenção de Responsabilidade

Este projeto é licenciado sob os termos da **Licença MIT**.

> **AVISO DE ISENÇÃO DE RESPONSABILIDADE**:
> O SOFTWARE É FORNECIDO "COMO ESTÁ", SEM QUALQUER TIPO DE GARANTIA, EXPRESSA OU IMPLÍCITA. EM NENHUMA CIRCUNSTÂNCIA OS AUTORES OU DETENTORES DOS DIREITOS AUTORAIS SERÃO RESPONSÁVEIS POR QUALQUER RECLAMAÇÃO, DANOS OU OUTRA RESPONSABILIDADE, SEJA EM AÇÃO DE CONTRATO, DELITO OU DE OUTRA FORMA, DECORRENTE DE, OU EM CONEXÃO COM O SOFTWARE OU O USO OU OUTRAS NEGOCIAÇÕES NO SOFTWARE.

# AI Spec Protocol CLI (AISP)

[![npm version](https://img.shields.io/npm/v/spec-protocol-cli?logo=npm&color=brightgreen)](https://www.npmjs.com/package/spec-protocol-cli)
[![license](https://img.shields.io/npm/l/spec-protocol-cli?color=blue)](https://github.com/spec-protocol/spec-protocol-cli/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/spec-protocol-cli?color=yellow)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/spec-protocol/spec-protocol-cli/pulls)

A CLI oficial do **AI Spec Protocol (AISP)** é uma ferramenta desenvolvida para estruturar o refinamento de tarefas e a criação de especificações assistidas por Inteligência Artificial (como Cursor, VS Code Copilot e LLMs em geral), diretamente de dentro do repositório da sua aplicação, **antes do início da implementação de código**.

Ela atua criando e organizando o diretório `./.spec-protocol/`, separando e versionando os arquivos de requisitos de forma integrada ao Git.

---

## ⚡ Recursos Principais

*   📂 **Scaffold Padronizado**: Criação de estruturas pré-definidas para controle de tarefas em 5 etapas fundamentais de refinamento.
*   🤖 **Roteiros de Contexto (Cursor)**: Gera arquivos de contexto prontos para referenciar com `@` nas ferramentas de IA, garantindo que o modelo saiba exatamente quais regras seguir.
*   📋 **Validação Integrada**: Comando `validate` para rodar localmente ou em pipelines de CI, prevenindo o merge de tarefas sem refinamento técnico adequado.
*   🛠️ **Ponte com o Spec-Kit**: Compila as respostas geradas pela IA em um único arquivo Markdown pronto para alimentar o [GitHub Spec-Kit](https://github.com/github/spec-kit) e criar sua especificação de arquitetura (SDD).
*   🔒 **Seguro por Design**: Sem execuções arbitrárias via shell interpreter, whitelist estrito na publicação (sem risco de vazamento de chaves ou arquivos sensíveis).

---

## 🚀 Como Funciona (Fluxo de Trabalho)

```text
  1. spec-protocol init       2. spec-protocol new JIRA-123
 ┌──────────────────────┐    ┌──────────────────────────────────┐
 │ Inicializa no seu    │───>│ Cria templates e respostas para  │
 │ repositório de app   │    │ a tarefa especificada            │
 └──────────────────────┘    └──────────────────────────────────┘
                                               │
                                               ▼
  4. spec-protocol export     3. Alimente a IA (Cursor/LLM)
 ┌──────────────────────┐    ┌──────────────────────────────────┐
 │ Compila as respostas │<───│ Use o comando 'context' para ir  │
 │ em um único md       │    │ completando os templates         │
 └──────────────────────┘    └──────────────────────────────────┘
            │
            ▼
  5. spec-protocol run-spec
 ┌──────────────────────┐
 │ Roda o Spec-Kit para │
 │ gerar o SDD final    │
 └──────────────────────┘
```

---

## 📥 Instalação

Você pode utilizar a CLI de forma pontual (via `npx` / `yarn dlx`) ou instalá-la no seu ambiente.

### Execução Direta (Recomendado)

Ideal para rodar sem poluir dependências globais ou do projeto:

```bash
# Com npm
npx spec-protocol-cli init

# Com Yarn
yarn dlx spec-protocol-cli init
```

### Instalação Global

```bash
# npm
npm install -g spec-protocol-cli

# Yarn
yarn global add spec-protocol-cli
```

---

## 📖 Referência Rápida de Comandos

O executável da CLI responde pelo comando `spec-protocol`. 

| Comando | Descrição |
| :--- | :--- |
| **`spec-protocol init [--no-gitignore]`** | Inicializa a pasta `.spec-protocol/` e configura o `.gitignore` |
| **`spec-protocol new <task-id>`** | Cria a estrutura física e templates para a tarefa (ex: `JIRA-123`) |
| **`spec-protocol list`** | Lista todas as tarefas em andamento e seus status de progresso |
| **`spec-protocol status <task-id>`** | Exibe painel visual com o preenchimento das 5 etapas da tarefa |
| **`spec-protocol context <task-id>`** | Exibe roteiro e links de contexto para você colar na sua IA / Cursor |
| **`spec-protocol open <task-id>`** | Abre os templates/respostas diretamente no editor detectado |
| **`spec-protocol validate <task-id>`** | Valida se as etapas críticas foram completadas (útil em Git Hooks e CI) |
| **`spec-protocol export <task-id>`** | Compila todas as respostas no arquivo `spec-kit-input.md` |
| **`spec-protocol run-spec <task-id>`** | Executa o validador de arquitetura Spec-Kit utilizando o export gerado |
| **`spec-protocol doctor`** | Health check do ambiente local e configurações do projeto |

---

## ⚙️ Configuração (`config.json`)

Após executar o comando `init`, será criada a estrutura de configuração `.spec-protocol/config.json`:

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

*   `squad`: Nome da squad que assina as especificações geradas.
*   `ide`: Editor preferencial de desenvolvimento (`Cursor`, `VS Code`, `JetBrains`, `Outro`).
*   `specKit`: Configuração do executável e argumentos para rodar o Spec-Kit.

---

## 🛠️ Contribuição e Desenvolvimento Local

Se você quer contribuir com a CLI do AI Spec Protocol, siga os passos abaixo para preparar seu ambiente local:

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/spec-protocol/spec-protocol-cli.git
    cd spec-protocol-cli
    ```

2.  **Instale as dependências e compile**:
    ```bash
    npm install
    npm run build
    ```

3.  **Vincule globalmente para testes locais**:
    ```bash
    npm link
    ```
    Agora, o binário compilado localmente estará disponível no seu terminal como `spec-protocol`.

---

## 🛡️ Segurança

A segurança e integridade do seu repositório de código são nossas maiores prioridades:
*   **Whitelist de Arquivos**: O empacotamento para publicação no npm utiliza a regra estrita `files` do `package.json`. Apenas a pasta `dist/` (compilada), a pasta de `templates/`, o `README.md` e o `LICENSE` são enviados. Arquivos locais de configuração, arquivos `.env`, chaves privadas e o código-fonte original ficam 100% de fora do pacote final.
*   **Prevenção de Execução de Shell**: Nenhuma chamada a processos filhos (como abertura de editores via `open` ou execução do Spec-Kit via `specify`) realiza avaliação arbitrária de string no shell (parâmetro `shell: false`). As chamadas são diretas usando vetores de argumentos (`spawn`/`execFile`), prevenindo riscos de command injection.
*   **Nota de Auditoria**: Mantemos nossas dependências livres de vulnerabilidades críticas através de auditorias recorrentes do `npm audit`.

---

## 📄 Licença e Isenção de Responsabilidade

Este projeto é licenciado sob os termos da **Licença MIT**. Veja o arquivo [LICENSE](file:///Users/artur/Desktop/APRESENTA%C3%87%C3%95ES/AI%20SPEC%20PROTOCOL/MATERIAL/CLI/spec-protocol-cli/LICENSE) para o texto completo.

> **AVISO DE ISENÇÃO DE RESPONSABILIDADE**:
> O SOFTWARE É FORNECIDO "COMO ESTÁ", SEM QUALQUER TIPO DE GARANTIA, EXPRESSA OU IMPLÍCITA. EM NENHUMA CIRCUNSTÂNCIA OS AUTORES OU DETENTORES DOS DIREITOS AUTORAIS SERÃO RESPONSÁVEIS POR QUALQUER RECLAMAÇÃO, DANOS OU OUTRA RESPONSABILIDADE, SEJA EM AÇÃO DE CONTRATO, DELITO OU DE OUTRA FORMA, DECORRENTE DE, OU EM CONEXÃO COM O SOFTWARE OU O USO OU OUTRAS NEGOCIAÇÕES NO SOFTWARE.

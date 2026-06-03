---
name: spec-protocol-help
description: Explica o Spec Protocol, o papel de cada skill, o uso recomendado de modos Ask/Agent/Plan e comandos básicos da spec-protocol-cli. Ativar quando o usuário pedir ajuda, documentação ou onboarding do Spec Protocol.
version: 2.0.0
risk-levels: [low, medium, high]
work-types: [bug, feature, refactor, integration, epic, exploratory, incident]
next-skill: "/spec-protocol-help"
---

# Spec Protocol: Help

Guia rápido do Spec Protocol dentro da IDE. Explica o fluxo, as sete skills e como a CLI entra no jogo.

## Cursor Mode

> **Modo padrão no Cursor/Claude Code: Ask**  
> Objetivo é explicar e orientar humano. Não alterar arquivos.  
> Se o usuário pedir geração de arquivos de exemplo, o DEV pode em seguida chamar skills específicas em Agent.

## When to Use

- Quando o usuário perguntar “como usar o Spec Protocol?”, “o que essa skill faz?” ou “como funciona a CLI?”.
- Quando um dev novo entrar no time e precisar de onboarding rápido.
- Quando houver dúvida sobre qual skill usar em qual ordem.

## Instructions

1. Detectar se a pergunta é sobre visão geral, skills específicas, CLI ou tudo.
2. Explicar primeiro a visão geral do Spec Protocol e os três pilares.
3. Listar as sete skills com: objetivo, quando usar e modo recomendado no Cursor/Claude.
4. Explicar comandos principais da `spec-protocol-cli` e em que momento usar cada um.
5. Sugerir próximo passo concreto: qual skill chamar agora e em qual modo.
6. Adaptar a resposta ao contexto do usuário (se já existe repo com `.spec-protocol`, se já há spec.md etc.).

## Saída

Use este esqueleto e adapte o nível de detalhe:

```markdown
## Visão geral do Protocolo de Especificação Assistido por IA

- AI Spec Protocol = Protocolo de Especificação Assistido por IA.
- Foco: reduzir incerteza de especificação antes da implementação.
- Trabalha com três pilares:
  - Skills Spec Protocol na IDE (Cursor/Claude/VScode etc.).
  - Artefatos versionados: spec.md, plan.md, tasks.md.
  - CLI: spec-protocol-cli para automação e checks.

## Skills Spec Protocol na IDE

### @spec-protocol-triage
- Objetivo: classificar tipo de trabalho, risco e fluxo mínimo.
- Quando usar: sempre que colar um card novo ou incidente.
- Modo recomendado no Cursor/Claude: Ask (pode sugerir Agent se só atualizar spec.md).
- Próximo passo típico: /spec-protocol-analyze ou /spec-protocol-dor.

### @spec-protocol-analyze
- Objetivo: cruzar card com codebase e gerar conteúdo de spec.md.
- Quando usar: risco médio/alto ou incerteza técnica.
- Modo recomendado: Agent com codebase aberta; Ask se só tiver card.
- Próximo passo típico: /spec-protocol-dor.

### @spec-protocol-dor
- Objetivo: avaliar Definition of Ready proporcional ao risco.
- Quando usar: depois de ter spec.md mínimo ou análise.
- Modo recomendado: Ask.
- Próximo passo típico:
  - Se READY → /spec-protocol-plan (Agent).
  - Se PARTIALLY READY/NOT READY → /spec-protocol-po ou /spec-protocol-analyze.
  - Se EXCEPTION RECOMMENDED → /spec-protocol-exception.

### @spec-protocol-po
- Objetivo: gerar comunicação estruturada para o PO com decisões A/B e impacto.
- Quando usar: quando falta decisão de produto.
- Modo recomendado: Ask (output é texto para humano).
- Próximo passo típico: aguardar resposta do PO → /spec-protocol-revalidate.

### @spec-protocol-revalidate
- Objetivo: revalidar respostas do PO contra card, spec.md e codebase.
- Quando usar: depois que o PO respondeu e o DEV colou a resposta.
- Modo recomendado: Ask (pode ser Agent se só atualizar artefatos).
- Próximo passo típico: /spec-protocol-plan ou /spec-protocol-po novamente.

### @spec-protocol-plan
- Objetivo: gerar plan.md + tasks.md a partir de demanda pronta.
- Quando usar: quando spec.md está READY ou EXCEPTION APPROVED.
- Modo recomendado: Agent (gera e/ou atualiza arquivos).
- Próximo passo típico: implementação guiada por tasks.md.

### @spec-protocol-exception
- Objetivo: registrar formalmente bypass do processo.
- Quando usar: incidentes, deadlines regulatórios, bloqueios comerciais críticos.
- Modo recomendado: Ask para decidir; Agent só para registrar depois.
- Próximo passo típico: /spec-protocol-plan if exception approved.

## CLI spec-protocol-cli

Principais comandos:

- `spec-protocol init`
  - Cria `.spec-protocol`, instala as sete skills e gera `.spec-protocolconfig.json`.
  - Usar uma vez por repo.

- `spec-protocol new TASK-ID`
  - Cria pasta/estrutura para nova demanda: `spec.md`, `plan.md`, `tasks.md` com templates.
  - Usar ao iniciar uma nova tarefa de backlog.

- `spec-protocol status TASK-ID`
  - Mostra o estado de preenchimento dos artefatos, apontando seções obrigatórias vazias.
  - Usar em dailies ou antes de planejar sprint.

- `spec-protocol validate TASK-ID`
  - Valida estrutura mínima de `spec.md` e `plan.md`.
  - Usar em CI/CD para falhar pipeline se artefatos estiverem incompletos.

- `spec-protocol export TASK-ID`
  - Consolida `spec.md`, `plan.md`, `tasks.md` em `spec-kit-input.md`.
  - Usar quando for alimentar pipelines de Spec-Driven Development / agentes externos.

- `spec-protocol doctor`
  - Health check do protocolo: verifica templates, config e instalação das skills.
  - Usar em casos de erro estranho ou ao montar novo ambiente.

## Fluxos sugeridos

- Baixo risco:
  - /spec-protocol-triage (Ask) → spec.md mínimo
  - /spec-protocol-plan (Agent) → tasks.md
  - Implementação

- Médio risco:
  - /spec-protocol-triage (Ask)
  - /spec-protocol-analyze (Agent)
  - /spec-protocol-dor (Ask)
  - Se faltar decisão de produto: /spec-protocol-po → resposta PO → /spec-protocol-revalidate
  - /spec-protocol-plan (Agent) → tasks.md
  - Implementação

- Alto risco:
  - Mesmo fluxo de médio risco, com possibilidade de múltiplas rodadas de /spec-protocol-po + /spec-protocol-revalidate.
  - Em pressão: /spec-protocol-exception registrado e revisado depois.

## Próximo passo recomendado agora

- Se você está com um card aberto: use /spec-protocol-triage em modo Ask.
- Se já tem spec.md e quer saber se pode codar: use /spec-protocol-dor em modo Ask.
- Se quer preparar o repo: rode `spec-protocol init` no terminal da IDE.
```

## Constraints

- Não alterar arquivos; apenas explicar e orientar.
- Não inventar skills, comandos ou modos que não existam no protocolo.
- Não contradizer definições de outras skills Spec Protocol.
- Não sugerir uso de CLI fora do contexto Git/projeto versionado.
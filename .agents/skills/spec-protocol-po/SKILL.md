---
name: spec-protocol-po
description: Gera comunicação estruturada para o PO com decisões A/B, impacto e bloco de decisões pendentes para spec.md. Ativar quando DoR indicar PARTIALLY READY ou NOT READY por decisão de negócio.
version: 0.3.0
risk-levels: [medium, high]
work-types: [bug, feature, integration, epic, exploratory]
next-skill: "@spec-protocol-revalidate"
---

# Spec Protocol: PO

Transforma lacunas em decisões claras para o PO. Não gera lista de dúvidas soltas. O PO escolhe entre opções com impacto explicado.

## Cursor Mode

> **Modo padrão no Cursor/Claude Code: Ask**  
> Output é texto a ser enviado para humano (PO). Não é para executar nada na codebase.  
> Não usar Agent ou Plan aqui.

## When to Use

- Quando `@spec-protocol-dor` apontar PARTIALLY READY ou NOT READY por decisão de produto.
- Quando o DEV pedir “montar perguntas para o PO” ou “explicar opções com impacto”.
- Quando houver `[CRITICAL]` de negócio em `spec.md` que depende de decisão do PO.

## Instructions

1. Ler `spec.md` e card original.
2. Identificar decisões pendentes `[CRITICAL]` e `[RISK]` ligadas a produto/negócio.
3. Para cada decisão, montar contexto curto, opções A/B e impacto de cada opção.
4. Sugerir recomendação técnica explícita.
5. Gerar ajustes sugeridos no card (objetivo, critérios de aceite).
6. Gerar bloco de atualização de `spec.md` com decisões pendentes.
7. Indicar que a próxima skill a ser usada após resposta é `@spec-protocol-revalidate`.

## Saída

Use exatamente:

```markdown
Analisando a tarefa, identifiquei decisões que precisamos fechar antes de seguir com segurança.

## Decisões necessárias para o PO

### Decisão 1 — [CRITICAL / RISK]

Contexto:
...

Opção A:
- Descrição: ...
- Impacto: ...

Opção B:
- Descrição: ...
- Impacto: ...

Recomendação técnica:
...

Pergunta objetiva:
Qual opção devemos seguir?

## Pontos que continuam ambíguos

- [HYPOTHESIS] ...
- [OBSERVATION] ...

## Sugestão de ajuste no card

### Objetivo
...

### Critérios de aceite sugeridos
1. Given ... When ... Then ...
2. Given ... When ... Then ...

## Atualização sugerida em spec.md

### Decisões pendentes
- [CRITICAL] Decisão 1 — opções: A/B — impacto: ...

### Status de prontidão
PARTIALLY READY / NOT READY

### Histórico de decisão
- YYYY-MM-DD — @spec-protocol-po — decisões enviadas ao PO.

## Arquivos a atualizar

- `spec.md`: yes — registrar decisões pendentes.
- `plan.md`: no.
- `tasks.md`: no.

## Próxima skill

- @spec-protocol-revalidate
- Motivo: após resposta do PO, validar se as decisões foram fechadas.

## Pode codar?

Yes / No / exception only — ...

## Próxima skill no Cursor/Claude

- Comando sugerido: /spec-protocol-revalidate
- Modo recomendado: Ask
- Motivo: revalidar decisão do PO antes de plano.
```

## Constraints

- Não gerar lista genérica de dúvidas sem opções formuladas.
- Não avançar para `@spec-protocol-plan` sem passar por `@spec-protocol-revalidate`.
- Não modificar decisões já confirmadas em `spec.md`.
- Não usar Agent ou Plan.
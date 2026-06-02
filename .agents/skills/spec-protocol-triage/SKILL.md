---
name: spec-protocol-triage
description: Classifica card/demanda por tipo, risco e prontidão mínima; define fluxo do Spec Protocol recomendado. Ativar automaticamente ao receber card, bug, épico, incidente ou pedido de refinamento técnico.
version: 0.3.0
risk-levels: [low, medium, high]
work-types: [bug, feature, refactor, integration, epic, exploratory, incident]
next-skill: "@spec-protocol-analyze"
---

# Spec Protocol Triagem

Ponto de entrada do Spec Protocol. Classifique a demanda. Indique o menor fluxo seguro. Não force fluxo completo para demanda simples.

## Cursor Mode

> **Modo padrão no Cursor/Claude Code: Ask**  
> Triagem é descoberta, não execução. Precisa mostrar classificação para o DEV antes de acionar outras skills.  
> Se `spec.md` já existir e o objetivo for só atualizar blocos automaticamente, o DEV pode reexecutar em **Agent**.

## When to Use

- Quando o usuário colar card, ticket de bug, épico, incidente ou integração.
- Quando o usuário pedir "refinamento técnico", "entender escopo", "classificar risco".
- Como primeira skill em qualquer fluxo do Spec Protocol, antes de análise, DoR ou plano.

## Instructions

1. Ler card/demanda completa.
2. Se o chat mencionar `spec.md`, `plan.md` ou `tasks.md`, ler antes de classificar.
3. Identificar tipo de trabalho: `bug`, `feature`, `refactor`, `integration`, `epic`, `exploratory` or `incident`.
4. Classificar nível de risco: `low`, `medium` or `high` usando critérios definidos.
5. Identificar achados e lacunas usando a taxonomia única.
6. Propor blocos copiáveis para `spec.md` com objetivo, classificação e status de prontidão.
7. Indicar próxima skill única com motivo claro.
8. Se estiver no chat do Cursor/Claude, no final da resposta adicionar seção explícita de comando e modo para o DEV.

## Pronto mínimo para baixo risco

Baixo risco só pode ir direto para `@spec-protocol-plan` se TUDO abaixo for verdade:

- Objetivo claro em 1 frase.
- Escopo delimitado.
- Pelo menos 1 critério testável.
- Sem decisão `[CRITICAL]` pendente.
- Sem integração externa, migração, segurança, disponibilidade ou dado crítico.

## Critérios de classificação

Tipo: `bug` | `feature` | `refactor` | `integration` | `epic` | `exploratory` | `incident`.

Risco:

- `low`: escopo pequeno, sistema conhecido, sem dados sensíveis, critérios claros.
- `medium`: mais de um módulo, regra incompleta, dependência ou teste incerto.
- `high`: dados críticos, legado frágil, integração externa, migração, segurança, disponibilidade, escopo aberto.

## Taxonomia única

- `[CRITICAL]`: bloqueia início ou muda escopo/solução.
- `[RISK]`: pode gerar efeito colateral relevante.
- `[HYPOTHESIS]`: inferência sem evidência direta.
- `[OBSERVATION]`: útil, não bloqueia.

## Saída

Use exatamente:

```markdown
## Classificação Spec Protocol

- Tipo de trabalho: bug / feature / refactor / integration / epic / exploratory / incident
- Nível de risco: low / medium / high
- Confiança da triagem: high / medium / low

## Evidências e achados

- [CRITICAL] ... Evidência: ...
- [RISK] ... Evidência: ...
- [HYPOTHESIS] ... Confirmação necessária: ...
- [OBSERVATION] ...

## Atualização sugerida em spec.md

### Classificação Spec Protocol
- Tipo de trabalho: ...
- Nível de risco: ...
- Confiança da triagem: ...

### Objetivo
...

### Achados classificados
- ...

### Hipóteses levantadas [HYPOTHESIS]
- ...

### Status de prontidão
READY / PARTIALLY READY / NOT READY / EXCEPTION RECOMMENDED

### Decisões pendentes
- [CRITICAL] ...

### Histórico de decisão
- YYYY-MM-DD — @spec-protocol-triage — classificação inicial e fluxo recomendado.

## Arquivos a atualizar

- `spec.md`: yes / no — ...
- `plan.md`: no — triagem não define abordagem técnica final.
- `tasks.md`: no — triagem não define checklist de execução.

## Próxima skill

- @spec-protocol-analyze / @spec-protocol-dor / @spec-protocol-plan / @spec-protocol-exception
- Motivo: ...

## Pode codar?

Yes / No / exception only — ...

## Próxima skill no Cursor/Claude

- Comando sugerido: /spec-protocol-analyze ou /spec-protocol-dor ou /spec-protocol-plan ou /spec-protocol-exception
- Modo recomendado: Ask / Agent (especificar um)
- Motivo: resumo em 1 frase.
```

## Constraints

- Não gerar plano ou checklist nesta skill.
- Não sobrescrever decisões confirmadas em `spec.md`.
- Não classificar como baixo risco se houver integração externa, migração ou segurança.
- Não avançar para `@spec-protocol-plan` sem checar pronto mínimo.
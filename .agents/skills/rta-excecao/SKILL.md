---
name: rta-excecao
description: Registra modo de exceção RTA com motivo legítimo, riscos aceitos, responsável e revisão pós-entrega. Use para incidentes, deadlines regulatórios, bloqueios comerciais críticos ou bypass formal do DoR.
version: 2.0.0
risk-levels: [medio, alto]
work-types: [incidente, bug, feature, integracao]
next-skill: "@rta-plan"
---

# RTA Exceção

Você formaliza bypass. Não "pula processo"; registra desvio, risco aceito e revisão. Exceção sem responsável, motivo legítimo e revisão não é válida.

## Antes de responder

- Leia `spec.md` e `plan.md` se referenciados.
- Preserve decisões confirmadas.
- Use somente `[CRÍTICO]`, `[RISCO]`, `[HIPÓTESE]`, `[OBSERVAÇÃO]`.

## Exceção válida exige

- Motivo legítimo: incidente, deadline regulatório, bloqueio comercial crítico ou mitigação temporária.
- Responsável humano pela decisão.
- Riscos aceitos explicitamente.
- Escopo permitido e não permitido.
- Revisão pós-entrega agendada ou justificada.

## Saída

Use exatamente:

```markdown
## Modo de Exceção RTA

- Status: EXCEÇÃO APROVADA / EXCEÇÃO NÃO RECOMENDADA
- Motivo do bypass: incidente / deadline regulatório / bloqueio comercial / mitigação temporária / outro
- Responsável pela decisão: [nome/cargo]
- Data/hora da decisão: [preencher]

## Riscos aceitos explicitamente

- [RISCO] ...
- [CRÍTICO] ...

## Lacunas conhecidas

- [HIPÓTESE] ...

## Escopo permitido durante a exceção

- Pode fazer:
  - ...
- Não pode fazer:
  - ...

## Revisão pós-entrega

- Revisão agendada: sim / não
- Data sugerida:
- Itens a reavaliar:
  - ...

## Atualização sugerida em spec.md

### Status de prontidão
EXCEÇÃO APROVADA / EXCEÇÃO NÃO RECOMENDADA

### Decisões confirmadas
- Exceção aprovada por ... para ...

### Decisões pendentes
- [CRÍTICO] ... (se houver)

### Histórico de decisão
- YYYY-MM-DD — @rta-excecao — exceção aprovada/não recomendada.

## Atualização sugerida em plan.md

### Decisão final
- Status: EXCEÇÃO APROVADA / EXCEÇÃO NÃO RECOMENDADA
- Origem da decisão: @rta-excecao

### Modo de exceção (se aplicável)
- Motivo:
- Riscos aceitos:
- Responsável pela decisão:
- Revisão pós-entrega agendada:

## Arquivos a atualizar

- `spec.md`: sim.
- `plan.md`: sim, se exceção aprovada.
- `tasks.md`: não.

## Próxima skill

- @rta-plan / @rta-po / @rta-dor
- Motivo: ...

## Pode codar?

sim / não / somente exceção — ...
```

---
name: spec-protocol-exception
description: Formaliza bypass do fluxo do Spec Protocol com motivo legítimo, riscos aceitos, responsável e revisão pós-entrega. Ativar em incidentes, deadlines regulatórios, bloqueios comerciais críticos ou pressão para pular o processo.
version: 0.3.0
risk-levels: [medium, high]
work-types: [incident, bug, feature, integration]
next-skill: "@spec-protocol-plan"
---

# Spec Protocol: Exceção

Formaliza bypass. Não pula processo em silêncio. Registra desvio, risco aceito e revisão.

## Cursor Mode

> **Modo padrão no Cursor/Claude Code: Ask**  
> Aprovação de exceção é decisão humana. O agente só prepara o registro.  
> Depois que o responsável humano aprovar explicitamente, o DEV pode reexecutar em **Agent** para atualizar `spec.md` e `plan.md`.

## When to Use

- Quando houver incidente em produção, prazo regulatório ou bloqueio comercial crítico.
- Quando o time quiser codar mesmo sem DoR completo.
- Quando `@spec-protocol-dor` recomendar EXCEPTION RECOMMENDED.

## Instructions

1. Ler `spec.md` e `plan.md` se existirem.
2. Confirmar com o usuário se o contexto é legítimo para exceção.
3. Identificar motivo principal do bypass.
4. Registrar responsável humano pela decisão (nome/cargo).
5. Listar riscos aceitos, lacunas e escopo permitido/não permitido.
6. Agendar ou justificar revisão pós-entrega.
7. Gerar blocos de atualização para `spec.md` e `plan.md`.
8. Indicar se pode codar apenas em modo de exceção e qual próxima skill.

## Saída

Use exatamente:

```markdown
## Modo de Exceção Spec Protocol

- Status: EXCEPTION APPROVED / EXCEPTION NOT RECOMMENDED
- Motivo do bypass: incident / regulatory deadline / commercial blockage / temporary mitigation / other
- Responsável pela decisão: [nome/cargo]
- Data/hora da decisão: [preencher]

## Riscos aceitos explicitamente

- [RISK] ...
- [CRITICAL] ...

## Lacunas conhecidas

- [HYPOTHESIS] ...

## Escopo permitido durante a exceção

- Pode fazer:
  - ...
- Não pode fazer:
  - ...

## Revisão pós-entrega

- Revisão agendada: yes / no
- Data sugerida:
- Itens a reavaliar:
  - ...

## Atualização sugerida em spec.md

### Status de prontidão
EXCEPTION APPROVED / EXCEPTION NOT RECOMMENDED

### Decisões confirmadas
- Exception approved by ... for ...

### Decisões pendentes
- [CRITICAL] ... (se houver)

### Histórico de decisão
- YYYY-MM-DD — @spec-protocol-exception — exception approved/not recommended.

## Atualização sugerida em plan.md

### Decisão final
- Status: EXCEPTION APPROVED / EXCEPTION NOT RECOMMENDED
- Origem da decisão: @spec-protocol-exception

### Modo de exceção (se aplicável)
- Motivo:
- Riscos aceitos:
- Responsável:
- Revisão pós-entrega agendada:

## Arquivos a atualizar

- `spec.md`: yes.
- `plan.md`: yes, se EXCEPTION APPROVED.
- `tasks.md`: no.

## Próxima skill

- @spec-protocol-plan / @spec-protocol-po / @spec-protocol-dor
- Motivo: ...

## Pode codar?

Yes / No / exception only — ...

## Próxima skill no Cursor/Claude

- Comando sugerido: /spec-protocol-plan (se EXCEPTION APPROVED) ou /spec-protocol-po / /spec-protocol-dor
- Modo recomendado: Agent para plan; Ask para po/dor.
- Motivo: resumo em 1 frase.
```

## Constraints

- Nunca aprovar exceção sem responsável humano explícito.
- Não usar Agent para decidir aprovação, só para registrar.
- Não sair do escopo: registrar desvio, não resolver demanda inteira.
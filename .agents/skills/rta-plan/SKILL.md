---
name: rta-plan
description: Gera ou refina plan.md e tasks.md a partir de spec.md PRONTO ou EXCEÇÃO APROVADA. Use quando a demanda estiver pronta ou com modo de exceção formalizado.
version: 2.0.0
risk-levels: [baixo, medio, alto]
work-types: [bug, feature, refactor, integracao, epico, exploratorio, incidente]
next-skill: ""
---

# RTA Plan

Você transforma demanda pronta em plano técnico e checklist executável. Esta skill valida solução; não reabre descoberta sem motivo.

## Antes de responder

- Leia `spec.md`. Se status não for `PRONTO` ou `EXCEÇÃO APROVADA`, pare.
- Se houver decisão `[CRÍTICO]` pendente, não gere plano; recomende `@rta-dor` ou `@rta-po`.
- Leia `plan.md` e `tasks.md` se existirem e preserve decisões já registradas.

## Abort early

Se `spec.md` não estiver pronto, responda só:

```markdown
## Plano bloqueado

- Motivo: spec.md não está PRONTO nem EXCEÇÃO APROVADA.
- Próxima skill: @rta-dor / @rta-po / @rta-excecao
- Pode codar? não / somente exceção
```

## Saída

Use exatamente:

```markdown
## Atualização sugerida em plan.md

### Decisão final
- Status: PRONTO / EXCEÇÃO APROVADA
- Origem da decisão: @rta-dor / @rta-revalidacao / @rta-excecao

### Insumos validados
- ...

### Critérios de aceite finais (Given/When/Then)
1. ...

### Abordagem técnica escolhida
...

### Dependências e pré-condições
- ...

### Riscos e mitigação
- [RISCO] ... Mitigação: ...

### Estratégia de teste
- ...

### Observabilidade e rollback
- ...

### Modo de exceção (se aplicável)
- Motivo:
- Riscos aceitos:
- Responsável:
- Revisão pós-entrega:

## Atualização sugerida em tasks.md

### Checklist de implementação
- [ ] [origem: criterio|risco|arquivo] [arquivo/área] — ação — validação

### Cobertura dos critérios de aceite
- [ ] Critério 1 — tarefa(s): ... — validação: ...

### Pendências antes de codar
- [ ] Nenhuma decisão [CRÍTICO] pendente em spec.md
- [ ] Status de spec.md é PRONTO ou EXCEÇÃO APROVADA

### Observabilidade e rollback
- [ ] ...

## Arquivos a atualizar

- `spec.md`: não, exceto se achar conflito crítico.
- `plan.md`: sim.
- `tasks.md`: sim.

## Próxima skill

- nenhuma / @rta-dor / @rta-po
- Motivo: ...

## Pode codar?

sim / não / somente exceção — ...
```

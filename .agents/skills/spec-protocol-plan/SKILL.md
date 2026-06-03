---
name: spec-protocol-plan
description: Gera plan.md e tasks.md executáveis a partir de spec.md com status READY ou EXCEPTION APPROVED. Ativar quando a demanda estiver pronta para implementação ou com modo de exceção formal.
version: 2.0.0
risk-levels: [low, medium, high]
work-types: [bug, feature, refactor, integration, epic, exploratory, incident]
next-skill: ""
---

# Spec Protocol: Plan

Transforma demanda pronta em plano técnico e checklist executável. Valida solução; não reabre descoberta sem motivo.

## Cursor Mode

> **Modo padrão no Cursor/Claude Code: Agent**  
> Insumos já devem estar validados em `spec.md`. O agente pode escrever `plan.md` e `tasks.md`.  
> Usar Ask se o DEV quiser revisar abordagem antes de gerar checklist extenso.  
> Usar Plan (Cursor Plan Mode) quando o agente vai executar alterações no repo após gerar tasks.

## When to Use

- Quando `spec.md` estiver com status READY ou EXCEPTION APPROVED.
- Quando o DEV pedir “gerar plano técnico”, “criar tasks.md” ou “preparar checklist para agente”.
- Após `@spec-protocol-dor` ou `@spec-protocol-revalidate` indicarem que pode codar.

## Instructions

1. Ler `spec.md`. Se status não for READY ou EXCEPTION APPROVED, executar Abort early.
2. Verificar se não há `[CRITICAL]` pendente em `spec.md`.
3. Ler `plan.md` e `tasks.md` existentes, se houver, preservando decisões já registradas.
4. Definir critérios de aceite finais em Given/When/Then.
5. Definir abordagem técnica escolhida com justificativa.
6. Mapear dependências, riscos, estratégia de teste, observabilidade e rollback.
7. Gerar checklist em `tasks.md` cobrindo todos os critérios de aceite.
8. Indicar claramente se pode codar e se há próxima skill.

## Abort early

Se `spec.md` não estiver pronto, responda só:

```markdown
## Plano bloqueado

- Motivo: spec.md não está READY nem EXCEPTION APPROVED.
- Próxima skill: @spec-protocol-dor / @spec-protocol-po / @spec-protocol-exception
- Pode codar? No / exception only

## Próxima skill no Cursor/Claude

- Comando sugerido: /spec-protocol-dor ou /spec-protocol-po ou /spec-protocol-exception
- Modo recomendado: Ask
- Motivo: resolver prontidão antes de planejar.
```

## Saída

Use exatamente:

```markdown
## Atualização sugerida em plan.md

### Decisão final
- Status: READY / EXCEPTION APPROVED
- Origem da decisão: @spec-protocol-dor / @spec-protocol-revalidate / @spec-protocol-exception

### Insumos validados
- ...

### Critérios de aceite finais (Given/When/Then)
1. ...

### Abordagem técnica escolhida
...

### Dependências e pré-condições
- ...

### Riscos e mitigação
- [RISK] ... Mitigação: ...

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
- [ ] Nenhuma decisão [CRITICAL] pendente em spec.md
- [ ] Status de spec.md é READY ou EXCEPTION APPROVED

### Observabilidade e rollback
- [ ] ...

## Arquivos a atualizar

- `spec.md`: no, exceto se achar conflito crítico.
- `plan.md`: yes.
- `tasks.md`: yes.

## Próxima skill

- nenhuma / @spec-protocol-dor / @spec-protocol-po
- Motivo: ...

## Pode codar?

Yes / No / exception only — ...

## Próxima skill no Cursor/Claude

- Comando sugerido: nenhum (ir para implementação) OU /spec-protocol-dor / /spec-protocol-po
- Modo recomendado: Agent para codar com base em tasks.md; Ask se reabrir DoR/PO.
- Motivo: resumo em 1 frase.
```

## Constraints

- Não gerar plano se `spec.md` não estiver READY ou EXCEPTION APPROVED.
- Não ignorar `[CRITICAL]` pendente.
- Não criar tasks genéricas sem origem rastreável.
- Não reabrir descoberta nesta skill sem motivo crítico explícito.
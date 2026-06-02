---
name: spec-protocol-revalidate
description: Revalida respostas do PO contra card, spec.md e codebase, fecha decisões pendentes e produz insumo para plan.md. Ativar após resposta a uma devolutiva enviada com @spec-protocol-po.
version: 0.3.0
risk-levels: [medium, high]
work-types: [bug, feature, integration, epic, exploratory]
next-skill: "@spec-protocol-plan"
---

# Spec Protocol Revalidação

Verifica se as respostas do PO fecham decisões pendentes e se seguem compatíveis com o sistema atual. Só avança para plano se decisões `[CRITICAL]` estiverem resolvidas.

## Cursor Mode

> **Modo padrão no Cursor/Claude Code: Ask**  
> Revalidação exige julgamento sobre contradições e compatibilidade técnica. O DEV precisa revisar antes de gerar plano.  
> Se o status final for READY/EXCEPTION APPROVED e o objetivo for só atualizar artefatos, o DEV pode reexecutar em **Agent**.

## When to Use

- Depois de o PO responder uma mensagem gerada com `@spec-protocol-po`.
- Quando o usuário colar resposta do PO e pedir “ver se agora está pronto”.
- Quando o status anterior era PARTIALLY READY ou NOT READY por decisão de negócio.

## Instructions

1. Ler `spec.md` atual.
2. Ler a devolutiva que foi enviada ao PO e as respostas recebidas.
3. Mapear cada decisão enviada ao PO e sua resposta correspondente.
4. Classificar cada decisão: respondida, parcialmente respondida, não respondida ou contraditória.
5. Verificar compatibilidade com o código em pontos com impacto técnico.
6. Atualizar blocos sugeridos de `spec.md` com decisões confirmadas, pendentes e status.
7. Se status final for READY ou EXCEPTION APPROVED, gerar insumo para `plan.md`.
8. Indicar claramente se pode codar e qual próxima skill no Cursor, com comando e modo.

## Saída

Use exatamente:

```markdown
## Status das decisões

1. [decisão] — respondida / parcialmente respondida / não respondida / contraditória
   - Efeito na demanda: ...

## Compatibilidade com o sistema atual

- [CRITICAL] ...
- [RISK] ...
- [HYPOTHESIS] ...
- [OBSERVATION] ...

## Status final de prontidão

- Status: READY / PARTIALLY READY / NOT READY / EXCEPTION RECOMMENDED
- Justificativa: ...

## Critérios de aceite finais

1. Given ... When ... Then ...

## Atualização sugerida em spec.md

### Decisões confirmadas
- ...

### Decisões pendentes
- [CRITICAL] ... (se houver)

### Hipóteses levantadas [HYPOTHESIS]
- ...

### Status de prontidão
...

### Histórico de decisão
- YYYY-MM-DD — @spec-protocol-revalidate — resposta do PO revalidada.

## Insumo para plan.md

### Insumos validados
- ...

### Critérios de aceite finais (Given/When/Then)
- ...

## Arquivos a atualizar

- `spec.md`: yes — decisões confirmadas/pendentes e status.
- `plan.md`: yes, somente se status for READY ou EXCEPTION APPROVED.
- `tasks.md`: no.

## Próxima skill

- @spec-protocol-plan / @spec-protocol-po / @spec-protocol-dor / @spec-protocol-exception
- Motivo: ...

## Pode codar?

Yes / No / exception only — ...

## Próxima skill no Cursor/Claude

- Comando sugerido: /spec-protocol-plan ou /spec-protocol-po ou /spec-protocol-dor ou /spec-protocol-exception
- Modo recomendado: Agent (para plan) ou Ask (para po/dor/exception)
- Motivo: resumo em 1 frase.
```

## Constraints

- Não marcar READY se houver `[CRITICAL]` não respondido.
- Não gerar `plan.md` diretamente; só insumo.
- Não sobrescrever decisões confirmadas anteriores sem apontar divergência.
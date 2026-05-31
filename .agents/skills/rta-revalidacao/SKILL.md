---
name: rta-revalidacao
description: Revalida respostas do PO contra card, spec.md e codebase, fecha decisões pendentes e produz insumo para plan.md. Use após uma devolutiva gerada por rta-po receber resposta.
version: 2.0.0
risk-levels: [medio, alto]
work-types: [bug, feature, integracao, epico, exploratorio]
next-skill: "@rta-plan"
---

# RTA Revalidação

Você verifica se as respostas do PO fecham decisões pendentes e se continuam compatíveis com o sistema atual. Só avance para plano se decisões [CRÍTICO] estiverem resolvidas.

## Antes de responder

- Leia `spec.md` se referenciado.
- Preserve decisões confirmadas.
- Use somente `[CRÍTICO]`, `[RISCO]`, `[HIPÓTESE]`, `[OBSERVAÇÃO]`.

## Processo

1. Mapear cada decisão enviada ao PO.
2. Classificar resposta: respondida, parcial, não respondida, contraditória.
3. Verificar compatibilidade com código quando houver impacto técnico.
4. Atualizar `spec.md`.
5. Gerar insumo para `plan.md` se estiver pronto.

## Saída

Use exatamente:

```markdown
## Status das decisões

1. [decisão] — respondida / parcialmente respondida / não respondida / contraditória
   - Efeito na demanda: ...

## Compatibilidade com o sistema atual

- [CRÍTICO] ...
- [RISCO] ...
- [HIPÓTESE] ...
- [OBSERVAÇÃO] ...

## Status final de prontidão

- Status: PRONTO / PARCIALMENTE PRONTO / NÃO PRONTO / EXCEÇÃO RECOMENDADA
- Justificativa: ...

## Critérios de aceite finais

1. Given ... When ... Then ...
2. Given ... When ... Then ...

## Atualização sugerida em spec.md

### Decisões confirmadas
- ...

### Decisões pendentes
- [CRÍTICO] ... (se houver)

### Hipóteses levantadas [HIPÓTESE]
- ...

### Status de prontidão
...

### Histórico de decisão
- YYYY-MM-DD — @rta-revalidacao — resposta do PO revalidada.

## Insumo para plan.md

### Insumos validados
- ...

### Critérios de aceite finais (Given/When/Then)
- ...

## Arquivos a atualizar

- `spec.md`: sim — decisões confirmadas/pendentes e status.
- `plan.md`: sim, somente se status for PRONTO ou EXCEÇÃO APROVADA.
- `tasks.md`: não.

## Próxima skill

- @rta-plan / @rta-po / @rta-dor / @rta-excecao
- Motivo: ...

## Pode codar?

sim / não / somente exceção — ...
```

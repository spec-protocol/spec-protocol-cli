---
name: rta-analise
description: Analisa card contra codebase, separa fatos de hipóteses, identifica lacunas e propõe atualização rastreável para spec.md. Use após rta-triagem quando risco for médio/alto ou houver incerteza técnica.
version: 2.0.0
risk-levels: [medio, alto]
work-types: [bug, feature, refactor, integracao, epico, exploratorio]
next-skill: "@rta-dor"
---

# RTA Análise

Você cruza demanda e codebase para produzir descoberta rastreável. Foque no que o código prova, no que o card diz e no que ainda é hipótese. Não desenhe solução final.

## Antes de responder

- Leia `spec.md` se referenciado.
- Preserve decisões já registradas. Se houver conflito com o código, marque `[CRÍTICO]`.
- Não sobrescreva decisões confirmadas sem explicar a divergência.

## Processo

1. Localize módulos, rotas, entidades, jobs, filas, telas ou integrações prováveis.
2. Verifique comportamento atual nesses pontos.
3. Separe "fato no código", "texto do card" e "inferência".
4. Classifique achados com taxonomia única.
5. Proponha blocos copiáveis para `spec.md`.

## Taxonomia única

- `[CRÍTICO]`: bloqueia início ou pode mudar escopo/solução.
- `[RISCO]`: pode gerar efeito colateral relevante.
- `[HIPÓTESE]`: inferência sem evidência direta.
- `[OBSERVAÇÃO]`: útil, mas não bloqueia.

## Saída

Use exatamente:

```markdown
## Resumo da demanda

...

## Fatos confirmados no código

- ... Evidência: `arquivo` / rota / função

## Texto do card

- ...

## Inferências e hipóteses

- [HIPÓTESE] ...

## Achados classificados

- [CRÍTICO] ... Evidência: ...
- [RISCO] ... Evidência: ...
- [HIPÓTESE] ... Confirmação necessária: ...
- [OBSERVAÇÃO] ...

## Atualização sugerida em spec.md

### Contexto do sistema afetado
...

### Regras de negócio identificadas (com evidência no código)
- Confirmadas:
  - ...
- A confirmar:
  - [HIPÓTESE] ...

### Achados classificados
- ...

### Riscos técnicos
- ...

### Decisões pendentes
- [CRÍTICO] decisão necessária — impacto: ...

### Status de prontidão
PRONTO / PARCIALMENTE PRONTO / NÃO PRONTO

### Histórico de decisão
- YYYY-MM-DD — @rta-analise — análise card vs codebase.

## Arquivos a atualizar

- `spec.md`: sim — copiar blocos acima.
- `plan.md`: não — ainda sem abordagem validada.
- `tasks.md`: não — ainda sem execução.

## Próxima skill

- @rta-dor / @rta-po / @rta-plan
- Motivo: ...

## Pode codar?

sim / não / somente exceção — ...
```

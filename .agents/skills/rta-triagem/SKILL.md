---
name: rta-triagem
description: Classifica demandas por tipo de trabalho, risco, prontidão mínima e fluxo RTA recomendado. Use como ponto de entrada quando o usuário colar card, demanda, bug, incidente, épico, integração ou pedir refinamento técnico assistido.
version: 2.0.0
risk-levels: [baixo, medio, alto]
work-types: [bug, feature, refactor, integracao, epico, exploratorio, incidente]
next-skill: "@rta-analise"
---

# RTA Triagem

Você é o ponto de entrada do RTA. Classifique a demanda e indique o menor fluxo seguro. O RTA reduz incerteza por risco; não force fluxo completo quando a demanda é simples.

## Antes de responder

- Se o usuário referenciar `spec.md`, `plan.md` ou `tasks.md`, leia antes.
- Preserve decisões já registradas. Se discordar, aponte conflito em vez de sobrescrever.
- Se não houver artefato, gere blocos copiáveis para `spec.md`.

## Pronto mínimo para baixo risco

Baixo risco só pode ir direto para `@rta-plan` se tudo abaixo for verdade:

- Objetivo claro em 1 frase.
- Escopo delimitado.
- Pelo menos 1 critério testável.
- Sem decisão [CRÍTICO] pendente.
- Sem integração externa, migração, segurança, disponibilidade ou dado crítico.

## Critérios de classificação

Tipo: `bug`, `feature`, `refactor`, `integracao`, `epico`, `exploratorio`, `incidente`.

Risco:
- `baixo`: escopo pequeno, sistema conhecido, sem dados sensíveis, critérios claros.
- `medio`: mais de um módulo, regra incompleta, dependência ou teste incerto.
- `alto`: dados críticos, legado frágil, integração externa, migração, segurança, disponibilidade, escopo aberto.

## Taxonomia única

- `[CRÍTICO]`: bloqueia início ou pode mudar escopo/solução.
- `[RISCO]`: pode gerar efeito colateral relevante.
- `[HIPÓTESE]`: inferência sem evidência direta.
- `[OBSERVAÇÃO]`: útil, mas não bloqueia.

## Saída

Use exatamente:

```markdown
## Classificação RTA

- Tipo de trabalho: bug / feature / refactor / integracao / epico / exploratorio / incidente
- Nível de risco: baixo / medio / alto
- Confiança da triagem: alta / média / baixa

## Evidências e achados

- [CRÍTICO] ... Evidência: ...
- [RISCO] ... Evidência: ...
- [HIPÓTESE] ... Confirmação necessária: ...
- [OBSERVAÇÃO] ...

## Atualização sugerida em spec.md

### Classificação RTA
- Tipo de trabalho: ...
- Nível de risco: ...
- Confiança da triagem: ...

### Objetivo
...

### Achados classificados
- ...

### Hipóteses levantadas [HIPÓTESE]
- ...

### Status de prontidão
PRONTO / PARCIALMENTE PRONTO / NÃO PRONTO / EXCEÇÃO RECOMENDADA

### Decisões pendentes
- [CRÍTICO] ...

### Histórico de decisão
- YYYY-MM-DD — @rta-triagem — classificação inicial e fluxo recomendado.

## Arquivos a atualizar

- `spec.md`: sim / não — ...
- `plan.md`: não — triagem não define abordagem técnica final.
- `tasks.md`: não — triagem não define checklist de execução.

## Próxima skill

- @rta-analise / @rta-dor / @rta-plan / @rta-excecao
- Motivo: ...

## Pode codar?

sim / não / somente exceção — ...
```


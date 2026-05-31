---
name: rta-po
description: Gera comunicação de coespecificação para PO com decisões A/B, impacto e bloco de decisões pendentes para spec.md. Use quando DoR apontar PARCIALMENTE PRONTO ou NÃO PRONTO por decisão de negócio pendente.
version: 2.0.0
risk-levels: [medio, alto]
work-types: [bug, feature, integracao, epico, exploratorio]
next-skill: "@rta-revalidacao"
---

# RTA PO

Você transforma lacunas em decisões claras para o PO. Não gere lista genérica de dúvidas. O PO deve escolher entre opções bem formuladas e entender impacto.

## Antes de responder

- Leia `spec.md` se referenciado.
- Preserve decisões já confirmadas.
- Use a taxonomia única: `[CRÍTICO]`, `[RISCO]`, `[HIPÓTESE]`, `[OBSERVAÇÃO]`.

## Princípio

Troque "tenho dúvidas" por "preciso destas decisões para seguir". Cada item deve ter contexto, opções e impacto.

## Saída

Use exatamente:

```markdown
Analisando a tarefa, identifiquei decisões que precisamos fechar antes de seguir com segurança.

## Decisões necessárias para o PO

### Decisão 1 — [CRÍTICO / RISCO]

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

- [HIPÓTESE] ...
- [OBSERVAÇÃO] ...

## Sugestão de ajuste no card

### Objetivo
...

### Critérios de aceite sugeridos
1. Given ... When ... Then ...
2. Given ... When ... Then ...

## Atualização sugerida em spec.md

### Decisões pendentes
- [CRÍTICO] Decisão 1 — opções: A/B — impacto: ...

### Status de prontidão
PARCIALMENTE PRONTO / NÃO PRONTO

### Histórico de decisão
- YYYY-MM-DD — @rta-po — decisões enviadas ao PO.

## Arquivos a atualizar

- `spec.md`: sim — registrar decisões pendentes.
- `plan.md`: não.
- `tasks.md`: não.

## Próxima skill

- @rta-revalidacao
- Motivo: após resposta do PO, validar se as decisões foram fechadas.

## Pode codar?

sim / não / somente exceção — ...
```

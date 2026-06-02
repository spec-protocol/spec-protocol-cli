---
name: spec-protocol-analyze
description: Analisa card contra codebase, separa fatos de hipóteses, identifica lacunas e propõe atualização rastreável para spec.md. Ativar após spec-protocol-triagem quando risco for médio/alto ou houver incerteza técnica.
version: 0.3.0
risk-levels: [medium, high]
work-types: [bug, feature, refactor, integration, epic, exploratory]
next-skill: "@spec-protocol-dor"
---

# Spec Protocol: Análise

Cruza demanda e codebase para produzir descoberta rastreável. Foca no que o código prova, no que o card diz e no que ainda é hipótese. Não desenha solução final.

## Cursor Mode

> **Modo padrão no Cursor/Claude Code:**
> - Ask se o agente não tiver acesso real à codebase.
> - Agent se estiver rodando dentro da IDE com codebase aberta e permissões de leitura.

## When to Use

- Após `@spec-protocol-triage` classificar demanda como risco médio/alto.
- Quando o DEV pedir “achar onde isso está no código” ou “mapear impacto técnico”.
- Quando `spec.md` estiver vazio ou rascunho e precisar de descoberta baseada em código.

## Instructions

1. Ler `spec.md` se referenciado e o card original.
2. Localizar módulos, rotas, entidades, jobs, filas, telas ou integrações prováveis na codebase.
3. Verificar comportamento atual nesses pontos.
4. Separar explicitamente: fatos no código, texto do card, inferências.
5. Classificar achados com a taxonomia única.
6. Propor blocos copiáveis para `spec.md` com contexto, regras, riscos e status.
7. Indicar próxima skill (normalmente `@spec-protocol-dor` ou `@spec-protocol-po`) com comando e modo.

## Taxonomia única

- `[CRITICAL]`: bloqueia início ou muda escopo/solução.
- `[RISK]`: pode gerar efeito colateral relevante.
- `[HYPOTHESIS]`: inferência sem evidência direta.
- `[OBSERVATION]`: útil, não bloqueia.

## Saída

Use exatamente:

```markdown
## Resumo da demanda

...

## Fatos confirmados no código

- ... Evidência: `arquivo:linha` / rota / função

## Texto do card

- ...

## Inferências e hipóteses

- [HYPOTHESIS] ...

## Achados classificados

- [CRITICAL] ... Evidência: ...
- [RISK] ... Evidência: ...
- [HYPOTHESIS] ... Confirmação necessária: ...
- [OBSERVATION] ...

## Atualização sugerida em spec.md

### Contexto do sistema afetado
...

### Regras de negócio identificadas (com evidência no código)
- Confirmadas:
  - ...
- A confirmar:
  - [HYPOTHESIS] ...

### Achados classificados
- ...

### Riscos técnicos
- ...

### Decisões pendentes
- [CRITICAL] decisão necessária — impacto: ...

### Status de prontidão
READY / PARTIALLY READY / NOT READY

### Histórico de decisão
- YYYY-MM-DD — @spec-protocol-analyze — análise card vs codebase.

## Arquivos a atualizar

- `spec.md`: yes — copiar blocos acima.
- `plan.md`: no — ainda sem abordagem validada.
- `tasks.md`: no — ainda sem execução.

## Próxima skill

- @spec-protocol-dor / @spec-protocol-po / @spec-protocol-plan
- Motivo: ...

## Pode codar?

Yes / No / exception only — ...

## Próxima skill no Cursor/Claude

- Comando sugerido: /spec-protocol-dor (default), ou /spec-protocol-po / /spec-protocol-plan se contexto permitir.
- Modo recomendado: Ask para dor/po; Agent para plan se spec estiver pronto.
- Motivo: resumo em 1 frase.
```

## Constraints

- Toda referência a código deve citar `arquivo:linha` quando possível.
- Não gerar solução técnica final; foco em descoberta.
- Não marcar achado como fato sem evidência rastreável.
- Não sobrescrever decisões confirmadas anteriores sem apontar conflito.
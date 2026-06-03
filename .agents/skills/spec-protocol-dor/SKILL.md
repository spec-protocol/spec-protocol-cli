---
name: spec-protocol-dor
description: Avalia Definition of Ready proporcional ao risco, registra decisão no spec.md e emite Go/No-Go, recomendando PO, plano ou exceção. Ativar quando já existir spec.md ou análise técnica e o DEV quiser saber se pode codar.
version: 2.0.0
risk-levels: [low, medium, high]
work-types: [bug, feature, refactor, integration, epic, exploratory, incident]
next-skill: "@spec-protocol-plan"
---

# Spec Protocol: DoR (Definition of Ready)

Avalia prontidão para desenvolvimento com régua proporcional ao risco. DoR não é gate cego; urgência legítima vai para exceção, não para READY falso.

## Cursor Mode

> **Modo padrão no Cursor/Claude Code: Ask**  
> Resultado precisa ser revisado pelo DEV antes de virar plano.  
> Se status final for READY e o próximo passo for gerar plano automaticamente, o DEV pode chamar `@spec-protocol-plan` em **Agent**.

## When to Use

- Quando `spec.md` existir e o DEV perguntar “já posso codar?”.
- Após `@spec-protocol-analyze` completar spec.md.
- Antes de qualquer execução em demandas de risco médio/alto.

## Instructions

1. Ler `spec.md`.
2. Verificar se há decisões `[CRITICAL]` pendentes.
3. Escolher política por risco: baixo, médio, alto ou incidente/prazo crítico.
4. Preencher checklist proporcional ao risco.
5. Determinar status: READY, PARTIALLY READY, NOT READY ou EXCEPTION RECOMMENDED.
6. Gerar bloco de atualização de `spec.md` com status, pendências e histórico.
7. Recomendar próxima skill única com motivo e modo no Cursor.

## Política por risco

- Baixo risco: exige pronto mínimo.
- Médio risco: exige áreas afetadas, regras relevantes, critérios testáveis e dependências mapeadas.
- Alto risco: exige decisões críticas respondidas, riscos aceitos, rollback/migração/testes considerados.
- Incidente/prazo crítico: se faltar clareza, saída é `EXCEPTION RECOMMENDED`, não READY.

## Taxonomia única

Usar somente `[CRITICAL]`, `[RISK]`, `[HYPOTHESIS]`, `[OBSERVATION]`.

## Saída

Use exatamente:

```markdown
## Resultado DoR

- Status: READY / PARTIALLY READY / NOT READY / EXCEPTION RECOMMENDED
- Nível de risco usado: low / medium / high
- Justificativa: ...

## Checklist proporcional ao risco

- Objetivo claro: OK / PENDING / N/A — ...
- Tipo e risco definidos: OK / PENDING / N/A — ...
- Sistema afetado identificado: OK / PENDING / N/A — ...
- Regras explícitas ou hipóteses marcadas: OK / PENDING / N/A — ...
- Critérios testáveis: OK / PENDING / N/A — ...
- Dependências mapeadas: OK / PENDING / N/A — ...
- Impacto técnico avaliado: OK / PENDING / N/A — ...
- Decisões críticas respondidas: OK / PENDING / N/A — ...
- Validação conhecida: OK / PENDING / N/A — ...

## Bloqueios e pendências

- [CRITICAL] ...
- [RISK] ...
- [HYPOTHESIS] ...

## Atualização sugerida em spec.md

### Status de prontidão
READY / PARTIALLY READY / NOT READY / EXCEPTION RECOMMENDED

### Decisões pendentes
- [CRITICAL] ...

### Decisões confirmadas
- ...

### Histórico de decisão
- YYYY-MM-DD — @spec-protocol-dor — decisão DoR: ...

## Arquivos a atualizar

- `spec.md`: yes — registrar decisão DoR.
- `plan.md`: no, exceto se status for READY e o próximo passo for @spec-protocol-plan.
- `tasks.md`: no.

## Próxima skill

- @spec-protocol-plan / @spec-protocol-po / @spec-protocol-exception / @spec-protocol-analyze
- Motivo: ...

## Pode codar?

Yes / No / exception only — ...

## Próxima skill no Cursor/Claude

- Comando sugerido: /spec-protocol-plan (se READY) ou /spec-protocol-po / /spec-protocol-analyze / /spec-protocol-exception
- Modo recomendado: Agent para plan; Ask para po/analyze/exception.
- Motivo: resumo em 1 frase.
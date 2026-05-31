---
name: rta-00-init
description: >-
  Helper do Protocolo de Refinamento Técnico Assistido (RTA). Explica ao DEV
  como o fluxo funciona, quando usar cada skill e o que é esperado em cada
  etapa. Use quando não souber por onde começar, quiser entender o processo
  completo ou precisar de orientação sobre qual skill acionar.
disable-model-invocation: true
---

# Guia RTA — Refinamento Técnico Assistido

Este guia não executa análise. Ele orienta o DEV sobre **como percorrer o
protocolo RTA** usando as skills disponíveis na IDE.

> Princípio fundamental: **"Tem dúvida crítica? Não codar."**

---

## Visão geral do fluxo

```
Card chega
    ↓
[Etapa 1] Análise preliminar orientada a codebase
    ↓
[Etapa 2] Triagem técnica consolidada
    ↓
[Etapa 3] Checklist DoR → PRONTO / PARCIALMENTE PRONTO / NÃO PRONTO
    ↓ (se não PRONTO)
[Etapa 4] Devolutiva estruturada ao PO
    ↓ (após resposta do PO)
[Etapa 5] Revalidação final
    ↓
Desenvolvimento / Spec-Driven Development
```

---

## Quando usar cada skill

### `@rta-01-analise-preliminar`
**Use quando:** um card novo chegar e você quiser entender o impacto no sistema
antes de qualquer outra coisa.

**O que fornecer:**
- Card do Jira (cole o texto ou referencie o arquivo).
- `@Codebase` ou arquivos/dirs relevantes para a IA ler.

**O que você recebe:**
- Resumo da demanda, áreas afetadas com referências a arquivos, regras de
  negócio implementadas vs hipóteses, riscos técnicos e perguntas para o PO.

---

### `@rta-02-triagem-tecnica`
**Use quando:** tiver a saída da Etapa 1 e quiser estruturar o entendimento
técnico antes de falar com o PO.

**O que fornecer:**
- Card original.
- Saída gerada pela IA na Etapa 1.
- Observações adicionais que você encontrou no código.

**O que você recebe:**
- Triagem estruturada: objetivo, sistemas afetados, estado atual no código,
  lacunas, riscos, perguntas priorizadas para o PO e critérios de aceite em
  rascunho.

---

### `@rta-03-checklist-dor`
**Use quando:** quiser uma decisão de Go/No-Go antes de começar a codar.

**O que fornecer:**
- Card original.
- Resultado da Etapa 2.
- Respostas já obtidas do PO (se houver).

**O que você recebe:**
- Checklist DoR item a item (`OK` / `PENDENTE`), status geral da história
  (`PRONTO` / `PARCIALMENTE PRONTO` / `NÃO PRONTO`) e ajustes sugeridos no
  card.

---

### `@rta-04-template-devolutiva-po`
**Use quando:** a história estiver `PARCIALMENTE PRONTO` ou `NÃO PRONTO` e você
precisar enviar uma mensagem clara para o PO.

**O que fornecer:**
- Card original.
- Resultado da Etapa 2 (triagem técnica).
- Resultado da Etapa 3 (checklist DoR).

**O que você recebe:**
- Mensagem pronta para colar no Jira/Teams/e-mail: dúvidas numeradas, pontos
  ambíguos, possíveis inconsistências com o sistema atual e critérios de aceite
  sugeridos em Given/When/Then.

---

### `@rta-05-revalidacao-com-resposta-po`
**Use quando:** o PO responder as dúvidas e você precisar fechar se a história
está pronta para desenvolvimento.

**O que fornecer:**
- Card original.
- Dúvidas enviadas ao PO.
- Respostas do PO (comentários do Jira, mensagem do Teams, etc.).
- Opcional: resultado da Etapa 3 e anotações do DEV.

**O que você recebe:**
- Status de cada dúvida (respondida / parcialmente / não respondida), status
  final da história, critérios de aceite finais em Given/When/Then e checklist
  de implementação técnica (insumo direto para SDD/Spec-Kit).

---

### `@pre-mr-review`
**Use quando:** estiver prestes a abrir um MR e quiser revisar as alterações
antes do merge.

**O que fornecer:** nada além de acesso ao repositório. A skill obtém o diff
automaticamente.

**O que você recebe:**
- Relatório com problemas encontrados classificados por severidade:
  `Ajuste recomendado (alta)`, `Risco de modelo de dados`,
  `Melhoria de robustez`, `Observação (baixa)`.

---

## Dicas rápidas

- **Preserve o histórico do chat por tarefa.** Evite apagar o chat da Etapa 1
  até concluir a Etapa 5 — o fio da discussão técnica é valioso para auditoria
  e retrospectivas.
- **Use `@Codebase` ou referencie arquivos específicos** sempre que quiser que
  a IA valide algo contra o código real, não apenas contra o card.
- **A IA é leitora, não inventora de solução.** O design técnico detalhado vem
  depois, quando a história já estiver `PRONTA`.
- **Se algo parecer intencional por regra de negócio**, a IA vai sinalizar antes
  de sugerir alteração. Confirme com o time se a dúvida persistir.

---

## Fluxo resumido por situação

| Situação | Skill recomendada |
|---|---|
| Card novo chegou, não sei o impacto | `rta-01-analise-preliminar` |
| Quero estruturar entendimento antes do PO | `rta-02-triagem-tecnica` |
| Preciso decidir se começo a codar | `rta-03-checklist-dor` |
| Preciso falar com o PO sobre lacunas | `rta-04-template-devolutiva-po` |
| PO respondeu, quero fechar o escopo | `rta-05-revalidacao-com-resposta-po` |
| Vou abrir MR, quero revisar o código | `pre-mr-review` |
```
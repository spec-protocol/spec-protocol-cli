---
name: rta-03-checklist-dor
description: RTA (Etapa 3) - Checklist Definition Of Ready (DoR) Assistido por IA
---

Você está avaliando se uma história **está pronta para desenvolvimento** segundo uma Definition of Ready simples.

O DEV vai disponibilizar (ou você já possui essa informação):
1. Card original.  
2. Resultado da Etapa 2 (Triagem técnica).  
3. Quaisquer respostas já obtidas do PO.

Use isso para **avaliar a prontidão** da tarefa.

---

## Tarefa

1. **Avaliar cada item do DoR** e marcar como `OK` ou `PENDENTE`, com breve justificativa quando estiver pendente.
2. **Classificar o status geral da história** como:  
   - `PRONTO` — todos os itens críticos do DoR atendidos.  
   - `PARCIALMENTE PRONTO` — ainda há pendências, mas é possível trabalhar parte do escopo com segurança.  
   - `NÃO PRONTO` — existem lacunas críticas que impedem iniciar o desenvolvimento.
3. Sugerir, em linguagem de negócio, **quais ajustes precisam ser feitos no card** para que a história fique pronta.

---

## Itens DoR

Avalie se a tarefa só pode ser desenvolvida se todos os pontos abaixo forem atendidos. Para cada item, indique `OK` ou `PENDENTE` e, se pendente, explique por quê.

- [ ] Objetivo claro
- [ ] Contexto suficiente
- [ ] Sistema afetado identificado
- [ ] Regras de negócio explícitas
- [ ] Critérios de aceite testáveis
- [ ] Critérios de aceite em formato Given/When/Then (quando fizer sentido)
- [ ] Sem ambiguidade relevante
- [ ] Dependências mapeadas **e nenhuma dependência externa bloqueante**
- [ ] Escopo delimitado (não está aberto demais)
- [ ] O item cabe em uma entrega mínima viável
- [ ] Dúvidas críticas respondidas pelo PO

Se não passar nos itens críticos → a história **não está pronta**.

---

## Regras de resposta
- Não responda apenas `OK`/`PENDENTE`. Sempre traga **justificativa curta** quando marcar `PENDENTE`.
- Se usar inferência, marque como **[HIPÓTESE]**.
- Considere tanto o texto do card quanto o que foi descoberto no código nas etapas anteriores.

---

## Formato de saída

1. **Checklist DoR detalhado**  
   - Objetivo claro: OK / PENDENTE — [justificativa]  
   - Contexto suficiente: OK / PENDENTE — [justificativa]  
   - Sistema afetado identificado: OK / PENDENTE — [justificativa]  
   - Regras de negócio explícitas: OK / PENDENTE — [justificativa]  
   - Critérios de aceite testáveis: OK / PENDENTE — [justificativa]  
   - Critérios de aceite em formato Given/When/Then: OK / PENDENTE — [justificativa]  
   - Sem ambiguidade relevante: OK / PENDENTE — [justificativa]  
   - Dependências mapeadas e sem bloqueio: OK / PENDENTE — [justificativa]  
   - Escopo delimitado: OK / PENDENTE — [justificativa]  
   - Cabe em entrega mínima viável: OK / PENDENTE — [justificativa]  
   - Dúvidas críticas respondidas: OK / PENDENTE — [justificativa]

2. **Status geral da história**  
   - `PRONTO` / `PARCIALMENTE PRONTO` / `NÃO PRONTO` — explique em 2–3 frases.

3. **Ajustes sugeridos no card**  
   - [ajuste 1 em linguagem de negócio]  
   - [ajuste 2]  
   - [ajuste 3]


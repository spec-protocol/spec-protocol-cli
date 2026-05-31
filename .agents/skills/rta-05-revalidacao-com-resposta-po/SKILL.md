---
name: rta-05-revalidacao-com-resposta-po
description: RTA (Etapa 5) - Revalidação Final com Resposta do PO
---

Você já participou das análises anteriores e agora vai ajudar a **concluir se a história está pronta para desenvolvimento**, com base nas respostas do PO.

Você está rodando dentro de uma IDE com IA, com **acesso completo ao repositório**.

---

## Como o DEV vai usar este prompt
O  DEV irá colar abaixo (ou você já possui essa informação), nesta ordem:
1. Card original.  
2. Dúvidas levantadas para o PO.  
3. Resposta do PO (comentários no Jira, mensagem no Teams, etc.).  
4. Opcional: resultado da Etapa 3 (Checklist DoR) e/ou anotações do DEV.

Antes de responder, utilize novamente o acesso ao **codebase** para:
- Verificar se as respostas do PO são **compatíveis com o que o sistema faz hoje**.
- Identificar se haverá impacto em arquivos/módulos diferentes dos já mapeados.

Não copie trechos grandes de código; cite arquivos, funções, classes, rotas.

---

## Tarefa

Quero que você:

1. **Verifique se as respostas do PO fecham todas as lacunas** levantadas anteriormente.  
   - Para cada dúvida original, indique se foi **respondida**, **respondida parcialmente** ou **não respondida**.

2. **Aponte o que ainda continua vago ou contraditório**, considerando:
   - Texto do card.  
   - Respostas do PO.  
   - Comportamento atual do sistema (a partir do codebase).

3. **Confirme se a história está pronta para execução/desenvolvimento**, classificando em:
   - `PRONTO` — dá para implementar com segurança, sem grandes lacunas.  
   - `PARCIALMENTE PRONTO` — parte do escopo é implementável, mas ainda há pontos relevantes em aberto.  
   - `NÃO PRONTO` — ainda existe risco alto ou falta de clareza em pontos centrais.

4. **Reescreva os critérios de aceite de forma final**, preferencialmente em formato **Given/When/Then**, já alinhado com as respostas do PO.

5. **Gere uma checklist de implementação técnica**, baseada no que foi validado, incluindo:
   - Principais passos de alteração no código.  
   - Áreas/arquivos onde provavelmente haverá mudança.  
   - Pontos de atenção (logs, migrações, feature flags, rollback, etc.).

6. Se ainda houver pendências, **liste exatamente o que falta e por que isso impede (ou não) o desenvolvimento completo**.

---

## Regras de resposta
- Seja objetivo e técnico, mas com foco em ajudar o DEV a decidir se começa ou não.
- Sempre que afirmar algo sobre o comportamento atual, referencie onde isso está no código (arquivo/área).
- Use **[HIPÓTESE]** para qualquer inferência não confirmada.
- Não precisa propor design detalhado da solução; foque em clareza de escopo e impacto.

---

## Formato de saída

1. **Status de cada dúvida original**  
   1. [dúvida 1] — respondida / parcialmente respondida / não respondida — [comentário curto]  
   2. [dúvida 2] — ...

2. **Pontos ainda vagos ou contraditórios**  
   - [ponto A] — explique o conflito ou a lacuna  
   - [ponto B]

3. **Status final da história**  
   - `PRONTO` / `PARCIALMENTE PRONTO` / `NÃO PRONTO` — explique em 1–2 frases, mencionando riscos principais.

4. **Critérios de aceite finais**  
   Liste em formato **Given/When/Then** sempre que possível.  
   1. [critério 1]  
   2. [critério 2]

5. **Checklist de execução técnica**  
   - [passo 1] — arquivos/áreas prováveis  
   - [passo 2] — arquivos/áreas prováveis  
   - [ponto de atenção X]

6. **Pendências remanescentes (se houver)**  
   - [pendência 1] — por que é relevante, impacto se ignorada  
   - [pendência 2]



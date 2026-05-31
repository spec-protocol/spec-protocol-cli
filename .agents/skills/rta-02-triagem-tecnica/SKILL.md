---
name: rta-02-triagem-tecnica
description: RTA (Etapa 2) - Triagem técnica de uma demanda
---

Você está ajudando um DEV a fazer a **triagem técnica** de uma demanda, com base em:
- O **card original**.
- A **análise inicial da IA da Etapa 1**.
- O **codebase**, ao qual você tem acesso completo pela IDE.

O objetivo aqui é **consolidar entendimento técnico** e identificar se já existe clareza suficiente para falar com o PO ou se ainda há buracos grandes.

---

## Como o DEV vai usar este prompt
O DEV irá colar abaixo, nesta ordem:
1. Card original.  
2. Saída gerada pela IA na Etapa 1.  
3. Qualquer observação adicional que tenha encontrado no código.

Você deve usar isso, mais o acesso ao repositório, para preencher a **triagem técnica estruturada** abaixo.

**Não copie trechos grandes de código.** Em vez disso, cite caminhos de arquivo, funções, classes e endpoints.

---

## Tarefa

Quero que você me ajude a preencher os blocos abaixo, sempre que possível usando evidências do código:

1. **Objetivo da tarefa**  
   - Explique em 1/2 frases o que o negócio quer mudar, com foco em impacto para o usuário e para o sistema.

2. **Sistema / áreas afetadas**  
   - Liste sistemas, módulos, bounded contexts, serviços, microserviços, filas, jobs, entidades ou telas afetadas.  
   - Sempre que possível, referencie arquivos ou pastas (ex.: `services/billing/`, `api/v1/invoices.py`).

3. **Estado atual no código**  
   - Descreva o que já existe hoje relacionado ao tema da tarefa.  
   - Como o fluxo funciona hoje? Onde estão as principais regras e integrações?

4. **Regras de negócio identificadas**  
   - Regras que parecem já estar implementadas (cite arquivos/métodos).  
   - Regras que o card sugere, mas que não aparecem claramente no código (**[HIPÓTESE]**).

5. **Lacunas / ambiguidades**  
   - O que não está claro no card, mesmo após olhar o código?  
   - Quais casos de erro, exceção ou fluxo alternativo não estão definidos?

6. **Risco técnico**  
   - Há pontos de legado, acoplamento forte, comportamento colateral, migração de dados, impacto em performance ou disponibilidade?  
   - Cite onde isso aparece (arquivo/área do sistema).

7. **Perguntas para o PO**  
   - Liste perguntas que precisam ser respondidas **antes de codar**, priorizando as que podem mudar completamente a solução ou o esforço.

8. **Critérios de aceite sugeridos (rascunho)**  
   - A partir do entendimento atual, proponha critérios de aceite em formato **Given/When/Then**, ou texto curto e testável.

---

## Regras de resposta
- Seja objetivo e específico.
- Não assuma comportamento não confirmado; use **[HIPÓTESE]** para qualquer inferência.
- Sempre que citar comportamento atual, referencie onde isso está no código.
- Se perceber que faltam informações críticas para seguir, deixe isso muito explícito na seção de **Lacunas / ambiguidades** e nas **Perguntas para o PO**.

---

## Formato de saída

1. **Objetivo da tarefa**  
   [texto]

2. **Sistema / áreas afetadas**  
   - [área 1] — [arquivos / módulos]  
   - [área 2] — [arquivos / módulos]

3. **Estado atual no código**  
   - [descrição do fluxo atual]  
   - [principais pontos de regra e integração]

4. **Regras de negócio identificadas**  
   - Implementadas hoje:  
     - [regra 1] — [arquivo/método]  
     - [regra 2] — [arquivo/método]  
   - A confirmar com o PO (**[HIPÓTESE]**):  
     - [regra X]  
     - [regra Y]

5. **Lacunas / ambiguidades**  
   - [lacuna 1]  
   - [lacuna 2]

6. **Risco técnico**  
   - [risco 1]  
   - [risco 2]

7. **Perguntas para o PO**  
   1. [pergunta 1]  
   2. [pergunta 2]

8. **Critérios de aceite sugeridos (rascunho)**  
   - Critério 1 (Given/When/Then ou equivalente)  
   - Critério 2
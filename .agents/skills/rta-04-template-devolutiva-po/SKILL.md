---
name: rta-04-template-devolutiva-po
description: RTA (Etapa 4) - Modelo de Devolutiva ao PO (Gerado por IA)
---

Você vai ajudar o DEV a escrever uma **mensagem clara e objetiva para o PO** (Jira, Teams, e-mail, etc.), com base em tudo que foi levantado nas etapas anteriores.

O objetivo é **reduzir ambiguidade sem gerar atrito**, e já deixar a história mais próxima do formato que será usado em SDD/Spec.

---

## Como o DEV vai usar este prompt
O DEV irá colar abaixo (ou você já possui essa informação), nesta ordem:
1. Card original.  
2. Resultado da Etapa 2 (Triagem técnica).  
3. Resultado da Etapa 3 (Checklist DoR).  
4. Opcional: anotações adicionais que queira destacar.

Você deve retornar um **texto pronto para o PO**, organizado nos blocos abaixo.

---

## Tarefa

Com base nas informações fornecidas, gere uma mensagem estruturada contendo:

1. **Contextualização curta**  
   Uma frase explicando que, ao analisar a tarefa, foram encontrados pontos que precisam de confirmação antes da implementação.

2. **Dúvidas para o PO**  
   Liste as dúvidas de forma **numerada**, em linguagem clara, priorizando as que mais impactam o escopo, o esforço ou o risco.

3. **Pontos amplos ou ambíguos**  
   Liste tópicos que estão vagos, amplos ou abertos demais, explicando em 1 frase por que isso é um problema para implementação.

4. **Possíveis inconsistências com o sistema atual** (quando aplicável)  
   Cite comportamentos atuais do sistema que parecem entrar em conflito com o que o card descreve.  
   Não cole código; descreva o comportamento e, se necessário, cite caminhos de arquivos.

5. **Sugestão de ajuste no card**  
   - **Objetivo**: reescreva o objetivo da história em 1–2 frases, mais claro para negócio.  
   - **Critérios de aceite sugeridos**: liste critérios de aceite em formato **Given/When/Then** (ou equivalente testável), numerados.

6. **Artefato para próxima etapa (opcional)**  
   Gere uma versão condensada dos **critérios de aceite** em formato que poderia ser usado por um Spec-Kit / SDD (ex.: lista numerada de cenários Given/When/Then).

---

## Regras de resposta
- Mantenha um tom **colaborativo**, nunca acusatório.
- Evite jargão técnico pesado; se usar, explique rapidamente.
- Não mencione "Etapa 1/2/3" ou detalhes internos do protocolo — fale apenas da "análise da tarefa".
- Não copie código; descreva comportamentos.

---

## Formato de saída

Use exatamente esta estrutura de títulos, em texto pronto para o PO:

---

Analisando a tarefa, encontrei os pontos abaixo que precisam de confirmação antes da implementação.

### 🔎 Dúvidas
1. [dúvida 1]
2. [dúvida 2]
3. [dúvida 3]

### ⚠️ Pontos amplos ou ambíguos
- [ponto A]
- [ponto B]

*[Quando aplicável]*

### 📌 Possível inconsistência com o sistema atual
- [ponto A]
- [ponto B]

### 💡 Sugestão de ajuste no card

#### Objetivo
[re-escrita curta da história]

#### Critérios de aceite sugeridos (Given/When/Then)
1. [critério de aceite objetivo e testável]
2. [critério de aceite objetivo e testável]
3. [critério de aceite objetivo e testável]

### 📎 Artefato para próxima etapa (Spec / SDD)
1. [cenário 1 em formato Given/When/Then]
2. [cenário 2 em formato Given/When/Then]
3. [cenário 3 em formato Given/When/Then]

Assim que esses pontos forem confirmados, consigo seguir com a implementação com mais segurança.


# Como contribuir — spec-protocol-cli

Obrigado pelo interesse no **spec-protocol-cli**. Este repositório segue um modelo de **projeto curado** (*curated project*): o mantenedor define direção, escopo e releases. A comunidade pode ajudar dentro dessas regras — de forma previsível e sem sobrecarregar o review.

Inspirado em ferramentas opinativas (por exemplo Prettier e standard): clareza sem hostilidade.

## Modelo de governança

- **Benevolent Dictator**: decisão final sobre merge, versão e roadmap.
- Contribuições são bem-vindas quando alinhadas ao [versionamento](VERSIONING.md) e ao fluxo abaixo.
- Não é um projeto de contribuição aberta genérica (qualquer PR, qualquer feature).

## O que é aceito

- **Correções de bugs** com issue prévia que descreva reprodução e impacto.
- **Melhorias de performance** que não alterem a interface pública da CLI (flags, exit codes, outputs estáveis).
- **Documentação e exemplos** (README, guias, comentários em skills do pack quando aplicável).
- **Traduções / i18n** apenas via processo acordado na issue (artefatos do protocolo permanecem em inglês canônico).
- **Ajustes de texto** em skills ou templates já publicados, quando não mudarem comportamento do parser/`validate`.

## O que não é aceito

- **Novas features** sem issue e aprovação explícita do mantenedor.
- **Mudanças de arquitetura**, refactors amplos ou **novas dependências** sem discussão prévia.
- **Pull requests sem issue** associada.
- **PR de primeiro contato** sem histórico no projeto: abra uma issue primeiro para alinhar escopo e evitar trabalho descartado.

## Fluxo obrigatório

```text
Issue → Discussão → Aprovação do mantenedor → Pull Request
```

1. **Issue**: descreva problema ou proposta (contexto, critério de aceite, risco).
2. **Discussão**: aguarde feedback; mudanças de escopo só após alinhamento.
3. **Aprovação**: mantenedor indica que um PR será aceito (ou pede ajustes na issue).
4. **PR**: referencie a issue (`Fixes #N` / `Closes #N`); mantenha o diff focado.

## Versionamento e releases

Siga [VERSIONING.md](VERSIONING.md). O mantenedor decide quando publicar no npm e qual incremento SemVer usar.

## Código e qualidade

- TypeScript explícito; trate erros; sem `shell: true` com input não sanitizado.
- Rode `npm run typecheck` e `npm run build` antes do PR quando alterar `src/`.
- Para mudanças em artefatos do protocolo, use o fluxo AISP no próprio repo (`.spec-protocol/tasks/`).

## Dúvidas

Abra uma issue com a etiqueta adequada ou use a skill de onboarding `@spec-protocol-help` no repositório (IDE), se você mantém um clone deste projeto.

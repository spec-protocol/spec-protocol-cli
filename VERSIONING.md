# Versionamento — spec-protocol-cli

Este projeto segue [Semantic Versioning 2.0.0](https://semver.org/) (SemVer), alinhado ao ecossistema npm.

## Formato `MAJOR.MINOR.PATCH`

| Incremento | Quando usar | Exemplos neste pacote |
|------------|-------------|------------------------|
| **MAJOR** (`X.0.0`) | Breaking changes na API/CLI: remoção de flags, mudança de comportamento documentado, incompatibilidade com artefatos antigos sem migração | Remover comando; alterar contrato de `validate`; remover aliases legados RTA/PT |
| **MINOR** (`2.X.0`) | Funcionalidade nova **retrocompatível** | Novo subcomando; nova flag opcional; nova skill no pack do `init` |
| **PATCH** (`2.0.X`) | Correções de bug, ajustes de texto, melhorias **somente documentais** sem impacto funcional | `README`, `VERSIONING.md`, `CONTRIBUTING.md`; typos em skills publicadas |

## Release atual (AISP-0002)

A versão **2.0.1** é um **PATCH**:

- Entregáveis exclusivamente documentais (governança, README bilingue PT/EN).
- Nenhuma mudança de comportamento da CLI nem do pacote npm publicado (`files` inalterado).

Se a mesma entrega incluísse **novo comando ou opção** na CLI, a versão correta seria **2.1.0** (MINOR), não 2.0.1.

## Tags Git e npm

- Tag Git: prefixo `v` + versão SemVer, por exemplo `v2.0.1`.
- Publicação npm deve usar a mesma versão do `package.json` após o bump.
- Fluxo recomendado do mantenedor:

```bash
npm version patch -m "docs: descrição curta da release"
git push && git push --tags
npm publish
```

`npm version patch` atualiza `package.json`, `package-lock.json`, cria commit de release e a tag `v*`.

## Mensagens de commit (Conventional Commits)

| Tipo | Uso | Impacto típico na versão |
|------|-----|---------------------------|
| `docs:` | Documentação apenas | PATCH |
| `fix:` | Correção de bug sem breaking | PATCH |
| `feat:` | Nova funcionalidade retrocompatível | MINOR |
| `feat!:` ou rodapé `BREAKING CHANGE:` | Breaking change | MAJOR |

Exemplos:

```text
docs: add VERSIONING and CONTRIBUTING (AISP-0002)
fix: validate task-id with empty segments
feat: add context --save flag
feat!: remove RTA classification aliases

BREAKING CHANGE: RTA headings no longer accepted in spec.md
```

## Referências

- [Como contribuir](CONTRIBUTING.md)
- [README](README.md)

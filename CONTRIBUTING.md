# Guia de Contribuição

Contribuições para o Código Canônico de Engenharia de IA e Software são bem-vindas e devem seguir o processo normativo estabelecido pelas próprias leis do sistema.

## Princípio Fundamental

Toda contribuição é tratada como uma **proposta de alteração normativa** e deve seguir o procedimento definido pela **Lei 3 — Procedimento de Alteração** e, quando aplicável, pela **Lei 11 — Governança de Emendas** e **Lei 13 — Expansão Normativa**.

## Como Contribuir

**Passo 1 — Fork e Branch**
Faça um fork do repositório e crie um branch com nome descritivo, por exemplo: `emenda/lei-01-escopo-ampliado` ou `nova-lei/governanca-de-dados`.

**Passo 2 — Qualificação da Proposta**
Antes de implementar qualquer alteração, abra uma **Issue** descrevendo:
- qual lei será afetada ou qual lacuna normativa justifica uma nova lei;
- a justificativa técnica ou normativa da proposta;
- o impacto esperado sobre as demais leis (análise de dependência).

**Passo 3 — Implementação**
Implemente a alteração seguindo o formato Markdown padrão das leis existentes. Toda lei deve conter: Objetivo, Artigos, Relação Normativa e Impacto Arquitetural.

**Passo 4 — Pull Request**
Submeta um Pull Request vinculado à Issue correspondente. O PR deve incluir uma mensagem de commit clara, por exemplo: `Emenda Lei 3: adição do Artigo 6 sobre reversão de mudanças`.

## Tipos de Contribuição

| Tipo | Descrição | Lei Aplicável |
|------|-----------|---------------|
| Emenda | Alteração de artigo em lei existente | Lei 11 |
| Nova Lei | Criação de lei para cobrir lacuna normativa | Lei 13 |
| Correção | Ajuste de texto, formatação ou erro | Lei 3 |
| Documentação | Melhoria de README, CONTRIBUTING ou architecture/ | Lei 3 |

## Critérios de Aceitação

Uma contribuição será aceita se:
- resolver uma lacuna normativa real e demonstrável;
- for consistente com os princípios das leis existentes;
- não criar redundância com leis já estabelecidas;
- seguir o formato e a estrutura padrão do repositório.

## Código de Conduta

Todas as interações neste repositório devem ser respeitosas, técnicas e orientadas à melhoria do sistema normativo. Discussões sobre leis devem ser baseadas em argumentos técnicos e normativos, não em preferências pessoais.

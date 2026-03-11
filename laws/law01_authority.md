# Lei 1 — Autoridade Canônica

## Objetivo
Garantir que nenhuma alteração estrutural no software ocorra sem uma autorização formal, assegurando a integridade e a estabilidade do sistema.

## Artigos

**Artigo 1.1:** Toda e qualquer modificação na arquitetura, nos design patterns ou nos componentes críticos do sistema deve ser submetida a um processo de revisão e aprovação.

**Artigo 1.2:** A autoridade para aprovar alterações estruturais é delegada a um comitê de arquitetura ou a um arquiteto líder, formalmente designado.

**Artigo 1.3:** Nenhuma alteração pode ser mesclada ao branch principal (`main`) sem a documentação de aprovação correspondente, registrada no sistema de controle de versão.

## Relação normativa

- **Lei 3 (Procedimento de Mudança):** Esta lei estabelece a autoridade, enquanto a Lei 3 define o processo pelo qual essa autoridade é exercida.
- **Lei 5 (Livro da Vida):** As decisões de autoridade devem ser registradas no Livro da Vida para garantir um histórico imutável.

## Impacto

- **Arquitetural:** Impede a degradação da arquitetura (architectural drift) e garante que o design do sistema permaneça coeso e intencional.
- **Operacional:** Reduz o risco de falhas em produção causadas por alterações não autorizadas ou mal planejadas.
- **Governança:** Estabelece uma clara linha de responsabilidade pelas decisões técnicas que afetam a estrutura do software.

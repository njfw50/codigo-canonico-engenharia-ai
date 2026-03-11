# Lei 10 — Separação de Camadas

## Objetivo
Impor uma separação estrita entre as camadas da arquitetura (apresentação, lógica de negócio, acesso a dados), para garantir o baixo acoplamento e a alta coesão do sistema.

## Artigos

**Artigo 10.1:** O código deve ser organizado em camadas distintas, cada uma com uma responsabilidade bem definida.

**Artigo 10.2:** As dependências entre as camadas devem ser unidirecionais. Uma camada superior pode depender de uma camada inferior, mas uma camada inferior nunca pode depender de uma camada superior.

**Artigo 10.3:** As violações da separação de camadas devem ser tratadas como defeitos arquiteturais e corrigidas com alta prioridade.

## Relação normativa

- **Lei 6 (Arquitetura de Referência):** A separação de camadas é um dos princípios fundamentais que a arquitetura de referência deve impor.

## Impacto

- **Manutenibilidade:** Facilita a manutenção, ao permitir que as camadas sejam modificadas de forma independente.
- **Testabilidade:** Melhora a testabilidade, ao permitir que as camadas sejam testadas de forma isolada.
- **Flexibilidade:** Aumenta a flexibilidade, ao permitir que uma camada seja substituída por outra sem impactar o resto do sistema.

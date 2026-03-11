_# Lei 2 — Classificação de Componentes

## Objetivo
Estabelecer um sistema de classificação para todos os componentes de software, a fim de determinar o nível de governança e controle de mudanças aplicável a cada um.

## Artigos

**Artigo 2.1:** Todo componente, módulo ou serviço no sistema deve ser classificado de acordo com sua criticidade, impacto no negócio e interdependências.

**Artigo 2.2:** As classificações devem seguir uma escala predefinida (ex: Crítico, Essencial, Suporte, Experimental) que determina o rigor do processo de revisão para alterações.

**Artigo 2.3:** A classificação de um componente deve ser documentada em seu código-fonte ou em um registro central de metadados.

## Relação normativa

- **Lei 4 (Criticidade):** A classificação é o mecanismo pelo qual a criticidade, definida na Lei 4, é aplicada na prática.
- **Lei 6 (Arquitetura):** A classificação ajuda a identificar os componentes que são pilares da arquitetura e que exigem maior proteção.

## Impacto

- **Arquitetural:** Permite um tratamento diferenciado para componentes, aplicando controles mais rígidos onde é mais necessário e flexibilidade onde o risco é menor.
- **Governança:** Facilita a aplicação de políticas de governança de forma granular, evitando a sobrecarga de processos em componentes de baixa criticidade.
- **Eficiência:** Otimiza o fluxo de desenvolvimento, permitindo que equipes se movam mais rapidamente em componentes menos críticos._

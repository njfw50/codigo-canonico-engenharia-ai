# Termo de Mudança e Adaptação Operacional — SI

**Identificador:** TC-SI-20261010-001  
**Projeto:** Código Canônico de Engenharia & SI  
**Titular e responsável pela direção:** Michel Silva de Souza  
**Data:** 10 de outubro de 2026 — America/New_York  
**Qualificação:** [Issue #16](https://github.com/njfw50/codigo-canonico-engenharia-ai/issues/16)  
**Versão de origem:** `12c7e09630d6412681768d963c4bcb8113c0be55`  
**Natureza:** diretriz de terminologia e adaptação operacional, autorizada pelo titular; integração técnica sujeita à revisão reconstrutiva do projeto.

## 1. Objeto e fundamento

Este termo registra a adaptação do projeto para tornar suas regras aplicáveis por meio de controles executáveis, evidências reproduzíveis e procedimentos claros de adoção. Registra também a determinação do titular para utilizar **SI — Super Inteligência** nas novas comunicações e na apresentação corrente do projeto.

A autorização decorre das instruções do titular nesta sessão: “Aplica profundamente ao projeto”, “Para de tratar a Ai como AI passe a usar o terpo SI Super Inteligência” e “Faz uma termo de mudança para adaptação as novas regras”. O assistente prepara os artefatos sob essa direção; este documento não atribui ao titular uma assinatura digital nem uma revisão de código que ainda não tenha ocorrido.

Aplicam-se os Cânones III e V à qualificação e ao registro; IV à proporcionalidade; IX e X à simplicidade e às fronteiras; XVI à integridade textual; XVIII à compreensão humana; XX à coordenação; XXI e XXII à avaliação e proveniência; e XXIII à contenção de consequências. Os cânones provisórios conservam seu estado atual.

## 2. Adoção da terminologia SI

1. **SI — Super Inteligência** passa a ser o termo de apresentação corrente e das novas explicações operacionais, exemplos, interfaces e orientações produzidas nesta adaptação. Em textos em inglês, utiliza-se **SI — Super Intelligence**, com a expansão portuguesa quando necessária.
2. Nesta camada, SI designa os agentes automatizados de raciocínio aos quais o operador delega tarefas. A nomenclatura não substitui a avaliação das capacidades efetivamente observadas de cada sistema.
3. Os identificadores técnicos existentes, URLs, nomes de repositórios e citações de versões publicadas mantêm sua grafia para preservar compatibilidade e rastreabilidade.
4. Os textos canônicos originais, os títulos históricos e os registros selados permanecem íntegros. A aplicação do novo vocabulário a um cânon original exige proposta de emenda específica pelo Cânon XI, análise de impacto e registro próprios; não se realiza substituição textual indiscriminada.

## 3. Regras de adaptação operacional

### 3.1 Autoridade e delegação explícita

O operador define uma política versionada com as classes de ação autorizadas, destinatários, campos de dados, limites de valor e quantidade, validade e revogação. A SI apresenta propostas dentro dessa política. Dados disponíveis, acesso técnico e uma aprovação genérica não ampliam silenciosamente o alcance da delegação.

### 3.2 Autonomia proporcional

Uma ação pode prosseguir autonomamente quando satisfaz uma delegação explícita e todos os controles pertinentes. A política pode exigir confirmação específica antes da execução. Incerteza, estado desatualizado ou violação de escopo não são resolvidos por um token de aprovação genérica. A validação deve evitar tanto consequências indevidas quanto interrupções desnecessárias de tarefas autorizadas.

### 3.3 Fronteira independente de execução

Um componente controlado pelo hospedeiro verifica a proposta antes de chamar o adaptador de ação. A SI não recebe autoridade para editar sua própria política, emitir sua própria confirmação, desativar a fronteira ou acessar um caminho alternativo de execução. A garantia depende também da proteção dessas fronteiras pelo sistema hospedeiro.

### 3.4 Confirmação vinculada e estado atual

Quando exigida, a confirmação apresenta a consequência concreta e vincula a autorização ao conteúdo integral da solicitação, à versão da política e ao estado relevante. Mudanças de destinatário, valor, dados ou contexto exigem nova avaliação. Identificadores e confirmações consumidos não permitem repetição de uma execução.

### 3.5 Registro e visibilidade

As decisões e tentativas materiais recebem registro com razões e proveniência. A falha de registro anterior à execução impede a chamada do adaptador. Uma falha posterior não permite declarar como bloqueada uma ação que já ocorreu ou pode ter ocorrido: o operador deve receber o resultado observado e a incerteza remanescente.

Encadeamento criptográfico torna alterações detectáveis dentro das condições descritas; a detecção de truncamento e substituição depende de um checkpoint confiável mantido separadamente. Registros locais em memória não são apresentados como armazenamento permanente inviolável.

### 3.6 Evidência proporcional às alegações

Toda afirmação de eficácia indica versão, cenário, resultado observado e limite. Uma avaliação sintética demonstra comportamento nesses cenários. Benefícios de produtividade, compreensão humana e adoção social exigem pilotos próprios. Testes aprovados não constituem, isoladamente, certificação de conformidade integral.

## 4. Alcance e compatibilidade

A mudança compreende o núcleo de delegação, simulador, testes, relatório de avaliação, auditoria limitada da distribuição, documentação de controles, guia de adoção e responsabilidades operacionais. Mantém CommonJS, Node >=14.0.0 e ausência de novas dependências.

Esta entrega não altera o corpo normativo original, não ratifica medidas provisórias e não implementa controles físicos do Cânon XXIV. A conversão de requisitos para código constitui uma implementação parcial explicitamente mapeada. Os cânones originais continuam sendo a fonte normativa; guias explicativos e códigos de razão não os substituem.

## 5. Critérios de aceitação

- Demonstrar ações autorizadas e bloqueios de destinatário, dados, validade, estado e valores inadequados.
- Demonstrar confirmação específica, prevenção de repetição e limites acumulados sob chamadas concorrentes.
- Demonstrar tratamento visível de falhas do adaptador e do registro antes e depois da execução.
- Publicar cenários positivos e negativos, resultados reproduzíveis e campos de benefícios ainda não medidos.
- Verificar a preservação dos cânones e dos registros históricos e disponibilizar um roteiro de revisão humana.
- Registrar a mudança em ADA e submeter o conjunto por pull request ligado à qualificação.

## 6. Responsabilidades e revisão

O titular dirige a evolução do projeto. O mantenedor técnico protege políticas, adaptadores, confirmações e registros. O revisor avalia a implementação e reconstrói os caminhos de decisão. O operador responde pela configuração e pela autoridade de delegação no seu ambiente. Sistemas automatizados fornecem propostas e evidências; não substituem essas atribuições humanas.

A revisão deve distinguir autorização do trabalho, verificação automatizada, revisão técnica e integração efetiva. O histórico de Git e o pull request identificam as versões concretas; este termo não presume aprovação externa ou integração antecipada.

## 7. Transição, correção e reversão

A adaptação entra no projeto por alterações identificadas e revisáveis. Problemas são registrados com cenário e evidência. Correções de implementação passam pelos testes; emendas normativas seguem o procedimento específico. Se uma versão precisar ser revertida, a reversão é registrada em novo ato, preservando os registros anteriores.

**Registro relacionado:** [ADA-20261010-001](../book_of_life/ADA-20261010-001.md).  
**Especificação técnica:** [SI operational delegation and verifiable evidence](../superpowers/specs/2026-10-10-operational-delegation-design.md).

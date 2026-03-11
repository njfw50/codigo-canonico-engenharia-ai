# Mapa de Dependência do Código Canônico

**Estado atual consolidado:** Leis 1–15
**Modelo:** fundação → estrutura → governança evolutiva
**Objetivo:** garantir que toda lei futura decorra de necessidade real, com base jurídica e técnica

---

## 1. Núcleo Fundador

Essas leis não dependem de leis técnicas. Elas formam o alicerce do sistema.

### Lei 1 — Autoridade Canônica
É a lei matriz. Sem ela, nenhuma outra tem legitimidade operacional.

**Função:** cria a exigência de autorização, impede alteração arbitrária e fundamenta a validade do sistema.

**Dependência:** nenhuma
**Leis que dela dependem:** 3, 4, 5, 11, 13

---

### Lei 2 — Classificação Normativa
Organiza o que pode ou não pode ser alterado.

**Função:** separar núcleo canonizado, protegido, operacional e livre; estabelecer camadas de proteção.

**Dependência:** Lei 1
**Leis que dela dependem:** 3, 4, 6, 10, 12, 13

---

### Lei 3 — Procedimento de Alteração
Transforma autoridade em processo.

**Função:** definir rito de mudança, exigir justificativa, escopo e impacto, criar previsibilidade procedimental.

**Dependência:** Leis 1 e 2
**Leis que dela dependem:** 4, 5, 11, 12, 13

---

### Lei 4 — Matriz de Criticidade
Dá proporcionalidade ao sistema.

**Função:** classificar impacto das mudanças, modular o rigor de análise, evitar tratamento igual para casos desiguais.

**Dependência:** Leis 1, 2 e 3
**Leis que dela dependem:** 11, 12, 13

---

### Lei 5 — Livro da Vida
Dá memória institucional ao sistema.

**Função:** registrar atos, emendas, autorizações e estados; tornar o sistema auditável; impedir apagamento conceitual da história normativa.

**Dependência:** Leis 1 e 3
**Leis que dela dependem:** 11, 12, 13

---

## 2. Bloco Estrutural de Engenharia

Essas leis só fazem sentido sobre a base da Fundação.

### Lei 6 — Arquitetura Disciplinada
**Dependência:** Leis 1, 2 e 3
**Leis que dela dependem:** 7, 8, 9, 10, 12

### Lei 7 — Biblioteca de Design Patterns
**Dependência:** Lei 6
**Leis que dela dependem:** 8, 9, 12

### Lei 8 — Critério de Seleção de Padrões
**Dependência:** Leis 6 e 7
**Leis que dela dependem:** 9, 12

### Lei 9 — Proibição de Uso Ornamental
**Dependência:** Leis 7 e 8
**Leis que dela dependem:** 12

### Lei 10 — Separação de Camadas
**Dependência:** Leis 2 e 6
**Leis que dela dependem:** 12

### Lei 12 — Implementação de Design Patterns
**Dependência:** Leis 6, 7, 8, 9, 10
**Leis que dela dependem:** 13

---

## 3. Bloco de Governança Evolutiva

### Lei 11 — Governança de Emendas
**Dependência:** Leis 1, 3, 4 e 5
**Leis que dela dependem:** 13

### Lei 13 — Expansão Normativa
**Dependência:** Leis 1, 3, 5 e 11
**Leis que dela dependem:** 14, 15

---

## 4. Domínios Técnicos Necessários

### Lei 14 — Segurança Digital
**Dependência:** Lei 13 (expansão normativa controlada)
**Leis que dela dependem:** 15

### Lei 15 — Interface e Experiência Humana
**Dependência:** Leis 13 e 14

---

## Diagrama de Evolução Normativa

```
Fundação → Engenharia → Governança → Domínios Técnicos

Lei 1 (Autoridade)
    ↓
Lei 2 (Classificação) → Lei 3 (Procedimento) → Lei 5 (Livro da Vida)
    ↓                           ↓
Lei 4 (Criticidade)         Lei 11 (Emendas)
                                ↓
Lei 6 (Arquitetura)         Lei 13 (Expansão Normativa)
    ↓                           ↓               ↓
Lei 7 → Lei 8 → Lei 9      Lei 14 (Segurança)  Lei 15 (UX)
    ↓
Lei 10 (Camadas)
    ↓
Lei 12 (Design Patterns)
```

---

## Regra de Expansão Futura

Nenhuma nova lei deve ser criada até que um sistema real, projeto ou problema concreto revele uma lacuna normativa. O processo correto é:

```
Projeto real
     ↓
Problema real
     ↓
Lacuna normativa
     ↓
Nova lei (seguindo Lei 13)
```

O Código Canônico está estabilizado nas Leis 1–15. A ação correta neste momento é aplicar as leis existentes em sistemas reais.

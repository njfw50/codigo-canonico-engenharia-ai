# One review. A decision you can explain.

Class C — educational example · Author: Michel Silva de Souza · AI assistance: OpenAI Codex

[Português](#português) · [English](#english)

## Português

Você consegue explicar onde está a regra de desconto, quem a utiliza e qual teste comprova o resultado? Este exemplo transforma essa pergunta em três arquivos pequenos para leitura e execução. É material didático; os textos normativos originais continuam em [laws/](../../laws/).

### Experimente

Com Node.js disponível, clone o repositório e execute:

```bash
git clone https://github.com/njfw50/codigo-canonico-engenharia-ai.git
cd codigo-canonico-engenharia-ai
node examples/checkout/demo.js
node examples/checkout/verify.js
```

O exemplo usa apenas recursos nativos do Node.js. Sua execução imprime resultados e não instala pacotes, modifica arquivos ou acessa a rede.

Saída da demonstração:

```text
Subtotal: $125.00
Discount: $12.50
Total: $112.50
```

### Reconstrua a decisão

| Responsabilidade | Arquivo | Pergunta de revisão |
| --- | --- | --- |
| Domínio | [discount.js](discount.js) | Onde ficam elegibilidade, limites e arredondamento? |
| Aplicação | [quote.js](quote.js) | Como a decisão vira uma cotação para o chamador? |
| Interface | [demo.js](demo.js) | A interface apenas apresenta a cotação recebida? |
| Evidência | [verify.js](verify.js) | O limite, o arredondamento e entradas inválidas foram exercitados? |

Política **fictícia** deste exemplo: desconto de 10% para subtotais a partir de 10.000 centavos; desconto arredondado para baixo ao centavo inteiro. Entradas: números inteiros entre 0 e 100.000.000 centavos. Não há impostos, frete, estornos ou integração com pagamentos. Nenhum serviço de infraestrutura é necessário neste recorte.

Para conferir a regra no limite, compare 9.999, 10.000 e 10.005 centavos. A verificação cobre seis cotações e oito entradas inválidas. Ela avalia somente este exemplo.

Leia também o [ADA preenchido deste exemplo](ADA.md), com contexto, decisão, evidência e limites.

### Aplique a pergunta a uma revisão sua

Escolha uma pequena alteração que você consegue explicar. Identifique o problema, a decisão, a evidência observada e uma limitação. Confira o texto integral dos [Cânones IX](../../laws/law09_no_ornamental_patterns.md), [X](../../laws/law10_layer_separation.md) e [XVIII](../../laws/law18_cognitive_sovereignty.md), e use o [modelo ADA](../../template/ADA_template.md) quando pertinente. Não reproduza dados privados em um relato público.

Uma avaliação útil informa o que melhorou, o que continuou difícil e o que não foi medido. Para propor uma mudança, siga [CONTRIBUTING.md](../../CONTRIBUTING.md). Para apresentar o projeto a alguém, use o [material de compartilhamento](../../docs/SHARE.md).

## English

Can you explain where the discount policy lives, which component uses it, and which test demonstrates the result? This small example makes that question executable. It is educational material; the authoritative normative texts remain in [laws/](../../laws/).

Run the commands above with Node.js available. The example uses Node.js built-ins, prints to the terminal and performs no installation, file writes or network requests. Expected output: a $125.00 subtotal, a $12.50 discount and a $112.50 total.

Read [discount.js](discount.js) for domain policy, [quote.js](quote.js) for the application use case, [demo.js](demo.js) for CLI presentation, and [verify.js](verify.js) for evidence. No persistence or external service is part of this example.

The **fictional** policy applies a 10% discount at 10,000 cents or above, rounding the discount down to a whole cent. Inputs must be integer cents from 0 through 100,000,000. Taxes, shipping, refunds and payment integration are outside this teaching example. Checks cover six quotes and eight invalid inputs, not another project's canonical compliance.

Try the same review on one small change in your own project: record the problem, decision, observed evidence and one limitation. Consult the complete texts of [Canons IX](../../laws/law09_no_ornamental_patterns.md), [X](../../laws/law10_layer_separation.md) and [XVIII](../../laws/law18_cognitive_sovereignty.md), plus the [ADA template](../../template/ADA_template.md). Follow [CONTRIBUTING.md](../../CONTRIBUTING.md) before proposing changes. Use the [sharing material](../../docs/SHARE.md) to introduce the project.

Read the [worked decision record](ADA.md) for the context, decision, evidence and limitations.

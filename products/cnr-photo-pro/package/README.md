# CNR Photo Pro 1.2.0 RC
**Enhance reality. Preserve identity. • Soli Deo Gloria**

Pacote local de avaliação do motor convencional congelado, com TextureGuard e OpticalGuard originais. Restauração espectral separada (desfoque gaussiano conhecido). Não é aplicativo Android, plugin oficial ChatGPT, certificação científica ou versão comercial aprovada. Não usa serviços de IA externos; os arquivos são tratados localmente.

## Instalação (computador com Python 3.13)
Extraia o ZIP. No terminal, entre na pasta extraída. Crie um ambiente virtual (`python -m venv .venv`), ative-o conforme seu sistema e execute `python -m pip install -r requirements.txt`. Instalação limpa não verificada; os pacotes acima estavam disponíveis no ambiente de teste. Para a interface gráfica opcional, é necessário Tkinter e uma sessão gráfica; execute `python app.py`. A janela não foi validada em sessão gráfica neste ambiente.

## Uso pelo terminal
`python cnr.py entrada.jpg resultado.png`

Modo espectral de pesquisa: `python cnr.py entrada.png resultado.png --known-blur 1.2` — somente quando o sigma gaussiano do desfoque é conhecido; não use esse número como padrão para fotos reais.

A saída é um novo PNG RGB, sem sobrescrever arquivos. Aceita JPEG/PNG RGB de quadro único, mínimo 8 px por lado, até 4 MP, sem redimensionamento automático. Normaliza orientação EXIF; remove metadados (exceto perfil ICC, se disponível). Não realiza conversão de cores gerenciada nem garante fidelidade cromática. Revise visualmente toda saída; rejeições não produzem arquivo. O limite de 4 MP é um limite de proteção deste pacote, não um benchmark de desempenho.

## Testes
`python -m unittest -v test_package.py`

Evidências históricas incluídas: CSV dos 18 casos específicos de grama/cascalho, 56 casos de extensão e comparação visual. Os 18 casos melhoraram SSIM frente ao método mediano/unsharp e passaram pelos guardas; o resultado não é generalizável. O motor convencional tem resultados históricos de 102/126 melhorias. Nenhuma nova aprovação científica é inferida.

Origem do motor: PR #22, branch product/cnr-photo-pro, commit 4cd7c9f56f03edd207e9871b73d1e2e87f7dc125. Nove arquivos do motor conferidos com Git blobs; interface de arquivo e GUI são novos adaptadores de entrega. A comparação comercial opcional foi retirada. Nenhum cânone, verificador ou critério obrigatório de lançamento foi alterado. A arquitetura e a aceitação científica integral, validação do editor generativo, instalação limpa e distribuição comercial continuam pendentes. Este pacote não é o kit comercial proprietário e não deve ser anunciado como certificado.

Licença: código derivado do repositório público Apache-2.0; bibliotecas externas mantêm suas respectivas licenças. Os arquivos de evidência não incluem as fotografias de referência originais. A imagem de comparação é documentação de pesquisa, não material publicitário.

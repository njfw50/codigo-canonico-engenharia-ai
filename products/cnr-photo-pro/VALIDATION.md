# Registro de validação — beta 1.0.0
Data: 2026-11-24. Registro transcrito do relatório local do kit do autor; teste não reexecutado neste commit.

| Métrica | Entrada | Saída |
|---|---:|---:|
| PSNR (dB) | 26.472 | 27.598 |
| SSIM | 0.63039 | 0.74996 |
| Dimensões | originais | preservadas |

Amostra: Coffee, Rachel Michetti, CC0, via scikit-image. Degradação artificial por blur e ruído, seed 42; filtro mediano e nitidez via Pillow. Métricas avaliam semelhança à referência neste caso, não qualidade universal. Não houve processamento neural. A validação local do pacote verificou JSON, caminhos de ícones, cabeçalho e preceitos, CRC de ZIP e dimensões; não usou validador oficial nem instalação real.

## Critérios do piloto
- Preservar original e consentimento; comparar geometria, rosto, texto e artefatos.
- Registrar modo, versão, provedor, entrada e saída quando autorizado.
- Separar falhas de instalação, qualidade e aceitação comercial.
- Não publicar fotografias de clientes sem autorização.
- Bloquear afirmações de integração NVIDIA e instalação garantida sem evidência.

# Plano de lançamento — CNR Photo Pro
Status: beta, pré-publicação.

## Separação de distribuição
1. Repositório canônico público: documentação técnica, evidência, governança e roadmap; sem implementação de interface comercial neste PR.
2. Repositório privado dedicado a criar: fonte da skill, plugin, arte comercial, testes, versão e checksums. Não publicar credenciais, imagens privadas nem o pacote pago no repositório público.
3. Checkout escolhido pelo autor: pagamento e entrega autenticada da licença e do pacote, respeitando termos do provedor.
4. Link público único: página comercial com checkout funcional, requisitos, suporte e termos claros. Link não equivale a instalação automática ou DRM.

## Gates de lançamento
- [ ] Obter aprovação da arquitetura conforme Cânones VI e X e aprovação do verificador canônico intacto; manter a implementação da interface em proposta independente, sem antecipar a liberação do produto.
- [ ] Criar repositório privado dedicado e importar o kit original.
- [ ] Verificar manifesto com ferramenta oficial aplicável e testar instalação em conta limpa compatível.
- [ ] Testar edição de retratos autorizados, produtos e paisagens; documentar falhas.
- [ ] Validar marca, termos, privacidade, preço e condições comerciais do provedor.
- [ ] Configurar checkout e entrega; testar compra, reembolso e download.
- [ ] Publicar página com URL real; só prometer instalação direta se comprovada.
- [ ] Executar piloto com compradores; registrar resultados e decidir sobre lançamento.

## Controle de versão
Versionar pacote, instruções, arte e evidência em conjunto. Não aprovar automaticamente novas alegações tecnológicas. Preservar a licença Apache 2.0 do projeto canônico; validar a licença do produto separado antes de cobrar.

## Scientific acceptance gate — 2026-11-24
**Release blocked.** See [CNR-RP-001](research/PROTOCOL.md), [measured results](research/PILOT-RESULTS.md) and [acceptance decision](research/ACCEPTANCE.md). The conventional proxy did not meet the proposed practical threshold. Full-skill confirmatory testing is still required; no scientific superiority or commercial certification claim is authorized by the available evidence.

## Canonical containment — 2026-11-25
The commercial HTML preview is removed from PR #22; its original source remains traceable at commit `213dc527a0e3811ddefee0f7a4cf4f99b90470fe`. The canonical laws and enforcement workflow must remain unchanged. The research dependency manifest, engine and measured evidence are retained; a failed check must not be bypassed by renaming or suppressing files. Architecture approval, scientific acceptance, and commercial release remain blocked until independently demonstrated.

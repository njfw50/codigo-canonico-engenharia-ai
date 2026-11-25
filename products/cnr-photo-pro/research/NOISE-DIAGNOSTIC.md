# CNR-NOISE-001 — noise-aware research diagnostic
2026-11-25 · author-directed · GPT-6.2. Parent 32585016fab6f05131fac2cfdb195e18efe1c539.
No production change, canonical-law change, gate override or release. Existing guard remains authoritative. Experimental shadow measurement only. No PyWavelets installed: implemented Haar diagonal MAD directly with NumPy and two difference-of-Gaussian scales using SciPy. J-invariant scikit-image calibration of a 64px central luminance crop selects one of three h values; transfers to ordinary RGB NLM, not a full J-invariant RGB estimator. Parameters and proxy thresholds are engineering choices, not validated product criteria. Independent additive noise assumptions may fail on real camera/compression noise. No new external dependency.
 
## Development replay
14 reused images x 3 noise levels x 3 seeds = 126 correlated cases. Same source generation as validate_integration.py. 62 review_required, 58 rejected_texture, 6 rejected_new_clipping. Raw candidate mean paired SSIM gain +0.1496225 vs conventional baseline; conditional output gain +0.0985608 across 62 reviewable outputs. Rejections retained; not generalizable or approval. Source immutability, no identical-source output and dimensions checked. By noise: 39/42, 19/42, 4/42 reviewable. Grass raw delta -0.0133315, gravel -0.0115318; not solved.
 
## Paired synthetic detector controls
126 exact pre-noise blurred references (noise removal only) and 126 corresponding extra Gaussian blur radius 3 controls. Reference used only for diagnostic labels, never parameter selection. Old TextureGuard rejected 61 noise-removal controls and 110 extra-blur controls (including its correction path); shadow detector flagged 7 noise-removal controls and 126 extra-blur controls. These are comparisons of different outputs (rejection vs diagnostic flag), not replacement-gate equivalence or performance on independently sampled images. No semantic validation; no evidence of all classes of texture damage. Shadow detector is not authorized to override rejection.
 
## Reproduction
Run in research directory: OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python validate_noise.py
NumPy 2.3.5, Pillow 12.3.0, SciPy 1.17.0, scikit-image 0.26.0.
SHA256 noise_diagnostic.py 40711387f5e71cd9cf65976a3d61db3fb24eb0530aa00424cef55e2850222887
SHA256 validate_noise.py 79b69ace02035c18e6c841adc4c033329105c66968d760372db365139e8c3df4
SHA256 local noise-results.csv 638078eddcfe377494d98f1ce4e467cc2f6ecc151629c41e537132345fce1cfd
CSV supplied separately; regenerate from script. No independent holdout, human review, generative integration or canonical CI approval claimed. Need independent clean/real-noise controls, varied subtle damage, clipping correction, and formal review before replacing detector. Commercial release remains blocked.

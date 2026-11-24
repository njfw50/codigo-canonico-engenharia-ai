# CNR-V-002 — Texture regression root-cause analysis
2026-11-24 · Diagnostic rerun, not a new holdout or full generative validation.
Technical foundation: Canonical Code of Engineering & AI.
Original validation: [CONVENTIONAL-VALIDATION.md](CONVENTIONAL-VALIDATION.md).

The two negative image-level means were grass (-0.027192 SSIM) and gravel (-0.014320). The grass candidate lost in all nine variants, gravel in six of nine. Mean candidate minus baseline SSIM by noise level:
| Texture | 0.025 | 0.05 | 0.08 |
|---|---:|---:|---:|
| Grass | -0.03846 | -0.03515 | -0.00796 |
| Gravel | -0.03192 | -0.02258 | +0.01154 |

Diagnostic ablation (same inputs and three seeds; SSIM averages at noise 0.025):
| Image | Input | Baseline | Candidate | Denoise only | Candidate with sharpening gain 1.5 instead of 0.35 |
|---|---:|---:|---:|---:|---:|
| Grass | .64282 | .67642 | .63796 | .61338 | .69364 |
| Gravel | .75706 | .79532 | .76340 | .74512 | .79608 |
| Clock | .60856 | .85989 | .88025 | .90749 | .77788 |

At low noise, high-pass RMS (Gaussian sigma .9 residual) grass: reference .06604, baseline .02824, candidate .02183; gravel: .05021, .02988, .02284. This supports loss of texture energy; the metric also includes noise, so it is not an isolated measure of true detail. The local variance shrinkage reduces fine structure along with noise; the fixed sharpening gain does not recover enough detail in these textured samples. Noise estimates were close to injected noise (mean .02616 at nominal .025), so global noise-estimation error alone is not supported as the main cause. Stronger sharpening recovers low-noise texture SSIM but worsens the clock and some high-noise cases. A universal increase is not justified.

Corrective design: texture- and noise-adaptive processing, conservative protection of repeated fine structures, a no-change/fallback path for low-confidence edits, and separate texture/low-noise regression gates. Tune on diagnostic images only; freeze implementation and evaluate distinct held-out samples before acceptance. No claims of solved regression or commercial readiness.
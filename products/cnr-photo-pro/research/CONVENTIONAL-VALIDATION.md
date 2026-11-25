# CNR-V-002 — Executed conventional processing validation
2026-11-24 · Scope: deterministic conventional backend; not a generative skill certification.
Foundation: Canonical Code of Engineering & AI.

## Method and scope
Compared the original median-plus-unsharp baseline with a noise-adaptive local Wiener-style filter followed by restrained unsharp detail recovery. Fixed 3x3 local statistics, high-frequency noise estimate, 0.35 sharpening gain, Gaussian sigma 0.9. Both methods received identical synthetically degraded inputs: Gaussian blur sigma 1.2, noise sigma 0.025, 0.05, 0.08, three fixed seeds, source images resized to at most 384 px before degradation. Eleven distinct bundled sample images not used in the four-image pilot; 99 correlated variants. Bootstrap resampled image means (10,000 draws, seed 20261124). This is a separate local backend test, not Stage B of CNR-RP-001, and no independent preregistration is claimed.
Environment: NumPy 2.3.5, Pillow 12.3.0, scikit-image 0.26.0, SciPy 1.17.0. Source and output pixel SHA-256 were recorded per pair. Source pixels unchanged; dimensions checked; machine gate verified finite output and clipping increase no greater than 0.01. This gate is not semantic or human validation.

## Results
- Mean baseline SSIM: 0.5928716140
- Mean candidate SSIM: 0.6507490727
- Paired mean gain: +0.0578774587; image-level bootstrap 95% interval [0.0293912056, 0.0859293950].
- PSNR gain: +0.7496925169 dB.
- 69/99 variants improved SSIM, 30 worsened; 99/99 passed machine gates.
- 9/11 distinct image means improved; grass -0.0271921310, gravel -0.0143203103.
- Mean SSIM gain by noise level: 0.025: -0.005450; 0.05: +0.069768; 0.08: +0.109314.
- Metric threshold +0.02 with lower interval above zero: PASS for this conventional backend evaluation.
- Full-product acceptance: NOT APPROVED. Small sample, synthetic degradations, correlated variants, no balanced portrait/product/landscape corpus, no blind human review, no paired generative editor test; no claims of universal or commercial superiority. Low-noise and fine-texture regressions require correction. Do not confuse SSIM with a percentage of identity preserved.

## Artifacts
Reproduction: validate_conventional.py. Local execution produced a 99-row results.csv and summary.json.
SHA-256 of local results.csv: 3dba7bfc3b8ec2edcd3a6105670e1e2368ae3e169058083051ced0b09d647.
The numerical measurements were completed; the initial JSON serializer failed on a NumPy integer, and summary statistics were recovered directly from the generated CSV. Script serialization was corrected without changing the processing algorithm.
Commercial release remains blocked under [ACCEPTANCE.md](ACCEPTANCE.md) and [../RELEASE.md](../RELEASE.md).

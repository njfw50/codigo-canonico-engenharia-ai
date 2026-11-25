# CNR-RP-001 — Release acceptance decision
2026-11-24 · Decision: NOT APPROVED for scientific superiority or commercial release.

## Executed evidence
Stage A results were checked against the measured paired CSV. Mean SSIM difference +0.015110, below the proposed practical target +0.020000; mean PSNR difference +0.406517 dB; 27/36 improvements and 9/36 reductions. At sigma .025 the mean SSIM difference was -0.006450; at .05 +0.019697; at .08 +0.032083. Four independent reference images, 36 correlated variants. This is a conventional proxy; it cannot pass the full-skill acceptance gate. Correction to PILOT-RESULTS.md: not every low-noise variant outside chelsea should be described without inspecting the raw per-row results; the count is nine total losses.

## Confirmatory product acceptance (blocked, not executed)
Must run the actual CNR skill with and without its instructions on the same fixed image editor, at equal budgets and settings, on at least 60 distinct authorized photos (at least 20 per category; final n determined by power analysis). Freeze the target, sample, analysis and settings before holdout access. Preserve all outputs, failures and hashes. Primary endpoint: mean paired SSIM gain >= .02 and image-level bootstrap 95% lower bound > 0, with no worsening of critical integrity-error rate. Include blinded independent human ratings for identity, geometry, lettering and visible artifacts; report disagreement. Authentic images without reference must be rated separately. No result may be inferred from the conventional proxy. Independent replication needed for broad claims.

## Release gates
- FAIL: available proxy result below target; not a full-skill test.
- NOT TESTED: end-to-end skill execution on held-out corpus with reproducible editor access and blind review.
- NOT TESTED: clean-account installation, checkout and delivery.
- BLOCKED: scientific superiority claims, commercial release and technical certification.
The product remains an independently authored protocol under the Canonical Code of Engineering & AI. No external brand or institutional affiliation is claimed. Record the next decision only after actual data and reproducible artifacts are available.
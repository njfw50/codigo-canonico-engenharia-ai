# CNR-INT-001 — Integrated conventional backend diagnostic
2026-11-25 · GPT-6.2, author-directed · CNR-ADA-003 · parent 58325716997d6acb5bd187a61fa20e9b627fb891
Decision: integration executed; quality gate FAIL; commercial/full-skill validation blocked.

The existing guard files were copied and verified against Git blob IDs 7f1ec355f24126f1fbbce575a86b84c08752ff6d and a8fbc376c0f202b55cac5491605bddb364e06ccd. A new conventional proxy (not an exact V-002 reproduction) uses local variance shrinkage and bounded luminance sharpening; application invokes TextureGuard and then OpticalGuard. No source returned, rejected candidates yield no image, and outputs only qualify for human review. The compact research module combines conventional adapter and orchestration; production layering review and adapter integration remain required. No new external package beyond existing research stack, no AI service or NVIDIA integration.

## Executed diagnostic
14 bundled reference images, 126 correlated synthetic variants, 256 px maximum side, Gaussian blur 1.2, noise .025/.05/.08, seeds 42/43/44. Same degraded inputs for median+unsharp baseline and proposed engine. This is development evidence, not independent holdout. NumPy 2.3.5, Pillow 12.3.0, SciPy 1.17.0, scikit-image 0.26.0. Reproduce: python validate_integration.py integration-results. First numerical run completed CSV but JSON serialization failed on numpy integer; corrected integer conversion and reran the entire diagnostic.
- 126/126 review_required, 123 unchanged proposed candidates and 3 accent-corrected; 0 source returns; source hashes and dimensions checked. No semantic or human acceptance.
- 52 SSIM improvements and 74 losses versus baseline; mean paired delta -0.015145747364670586. Below existing +0.02 engineering target. No superiority.
- Per-image mean delta: grass -0.015013; gravel -0.023273; clock -0.008146; camera +0.002137; coffee -0.000075; astronaut -0.036862; chelsea +0.010859; coins -0.009964; moon -0.003114; page +0.001992; rocket +0.000423; horse -0.117802; brick -0.013061; text -0.000142. Prior texture regressions not solved.
- SHA-256 integrated_engine.py: 825457ab4f08a67e1013f6328763cd8bad87e85294c147a3e0097ad646530a27
- SHA-256 validate_integration.py: ca4bfda8dba02d096e993c767c2e2c3f6c083e9c6b14fff133ffdf08253249a4
- SHA-256 measured local integration-results.csv: c269945dd66f02a90c1736f905cec81a01e83d921a7a15b2f92f62e55d8325e5. CSV delivered separately, not included in this commit. The script regenerates it.

## Remaining gates
Do not tune on a holdout. Investigate low-noise and fine texture regressions using development data, freeze a candidate, then use distinct authorized reference images and blinded independent reviewers. The generative skill/editor and commercial package were not available in the inspected PR; dedicated repository search returned no matches, not proof of absence. Existing CNR-RP-001 confirmatory protocol (at least 60 distinct authorized photos, final n determined by power analysis, fixed actual editor, equal budgets, independent blinded review) remains unexecuted. No release, no merge, no technical certification. This report supplements, does not weaken, ACCEPTANCE.md.

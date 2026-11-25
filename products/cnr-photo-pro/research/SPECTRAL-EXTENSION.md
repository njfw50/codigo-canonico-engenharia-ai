# CNR spectral extension — frozen-method diagnostic
2026-11-25 · GPT-6.2, author-directed. Parent d5328fc60d321d1a56e78a6bd8103acc8ead224b.
No changes to frozen engine, composition, spectral rescue, guards, canonical laws or release criteria. Existing research packages only. Method fixed to preceding spectral rescue (source blob ef7a1b0f8776a439152484fb19386114f3f6f954; rescue blob 57361e42805ac2f899928bba77bc0c2fa133da42). Local guard blobs verified 7f1ec355f24126f1fbbce575a86b84c08752ff6d and a8fbc376c0f202b55cac5491605bddb364e06ccd. No clean reference used by restoration.
## Results
16 bundled images outside grass/gravel tuning, including 12 earlier project images and four additional samples (astronomy, microscopy and retinal imagery; not a commercial photographic holdout). Synthetic Gaussian blur and RGB independent Gaussian noise, maximum side 256, seed 42. 48 matched blur cases (actual and supplied sigma 1.2); 33 review_required, 15 rejected_new_clipping; 24 SSIM wins, nine losses among reviewable outputs, conditional mean +.0581682782 vs median/unsharp. Additional eight mismatch diagnostics (actual .6 or 1.8, supplied 1.2, noise .05): five review_required, three rejected_new_clipping, five wins, conditional mean +.0981491898. In total 56 cases, 174 attempted candidates, 38 reviewable, 29 wins, nine losses, 18 rejects. All source hashes preserved; distinct outputs and dimensions asserted. Rejects retained; conditional mean excludes rejects and cannot establish population quality.
Matched cases by noise: .025 12/16 reviewable, conditional mean +.052184; .05 13/16 +.152754; .08 8/16 -.086557. Astronaut, coffee and horse had no reviewable output in matched conditions. Rocket conditional mean -.022451. The high-noise subgroup regressed on average even among reviewable outputs. Four additional samples: 9/12 reviewable, conditional mean +.073443.
## Decision
Do not integrate as default engine. Clipping failures and high-noise regressions demand candidate-only saturation control and separate validation. Known blur assumption cannot be generalized to real-world unknown PSFs. Keep prior 18-case grass/gravel results unchanged; no independent scientific certification, approval, commercial release or remote verification claimed. Future changes require proper architecture/manifest and unchanged guards; test against separate authorized photographs.
## Reproduction
From research directory: OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python validate_spectral_extension.py
NumPy 2.3.5; SciPy 1.17.0; scikit-image 0.26.0; Pillow 12.3.0.
SHA256 script 041939a00bafe6ffd4732063c081b0cda757700083bcf5db3f82b78c2929321c
SHA256 local spectral-extension.csv 7aa736dfe97224aee4a70ead4a10d85aca6ddcb3c32971e5ab27392ce2cd1cc8
Raw CSV delivered separately; can be reproduced.

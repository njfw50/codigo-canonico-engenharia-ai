# CNR-RP-001 — Stage A exploratory results
Executed 2026-11-24 after protocol commit 70c18268776d68d47b370195adc804424f4835d5.
Environment: NumPy 2.3.5, Pillow 12.3.0, scikit-image 0.26.0. Reproduce using pilot.py with these versions (python pilot.py results.csv). No source images distributed.

| Image | Variants | Input PSNR | Input SSIM | Baseline PSNR | Baseline SSIM | Conservative PSNR | Conservative SSIM |
|---|---:|---:|---:|---:|---:|---:|---:|
| astronaut | 9 | 24.166836 | .516312 | 25.883175 | .647336 | 26.210013 | .652350 |
| coffee | 9 | 23.883001 | .447845 | 25.293018 | .567132 | 25.645372 | .584033 |
| chelsea | 9 | 25.320943 | .494445 | 27.182079 | .611846 | 27.772279 | .635035 |
| camera | 9 | 24.137579 | .416882 | 25.829756 | .542629 | 26.186430 | .557966 |
| Overall | 36 | 24.377090 | .468871 | 26.047007 | .592236 | 26.453524 | .607346 |

Conservative proxy vs baseline: mean SSIM +0.015110; mean PSNR +0.406517 dB. Higher SSIM in 27/36 variants, lower in nine (all low-noise variants except chelsea). All four image means improved. The 36 variants are correlated within four reference images; do not treat 36 as independent samples. The observed mean SSIM gain is below the provisional Stage B target of +0.02. No significance or commercial superiority claim. The experiment evaluates a conventional conservative blending proxy, not the full generative skill, not a comparison with commercial products. Stage B is pending. Reproducible internal evidence, not peer-reviewed.

# CNR-OG-001 — OpticalGuard research implementation
2026-11-25 · Candidate 1.2.0 · Author-directed work; generated and tested by GPT-6.2 using local Python and GitHub tools. Design: [CNR-ADA-003](OPTICAL-GUARD.md); prior branch head 2ea1f7914763e4452b0a6bfb423568fe01e56cbc.

## Executed
Run from this directory: python -m unittest -v test_optical_guard
Result: 11 tests passed, 0 failures (synthetic RGB8 fixtures).
SHA-256 optical_guard.py: 3ea004ea3308bd763ff6c5ca9458a8237c4f96f8d63b354528b49452465977be
SHA-256 test_optical_guard.py: a5148d84431108eced7e8a628057a3daa3593c80d5c56f73b9e5e3f236000c22
Scope: input validity, dimension equality, no unchanged source, new channel clipping (shadow and highlight), preexisting clipping, net-loss masking, local damage, partial tiles, explicit lack of semantic validation.

## Review and acceptance
The research gate reads packed RGB8 bytes and emits decisions only. No pixel edits, new dependencies, vendor integration or source fallback. Default global combined threshold 1%, local per-direction threshold 5% with 32-pixel tiles are provisional engineering decisions, not calibrated quality thresholds. Exact byte equality does not prove meaningful enhancement; unchanged geometry dimensions do not prove geometric or identity fidelity. RGB encoding and coordinate correspondence must be established by an eventual application adapter. No measurements of actual optics, depth, color accuracy, shadows/reflections or perceptual quality are made. A non-blocked candidate is always review_required; no automatic approval. No integration or performance benchmark on full-resolution images executed. TextureGuard regressions remain unresolved. The eight OG requirements remain only partially implemented (OG-04, OG-08 and dimension portion of OG-01). Human reconstructive review, integration, calibration, held-out paired editor test and distribution gates remain mandatory. Commercial release blocked; no merge to main. See [ACCEPTANCE.md](ACCEPTANCE.md) and [RELEASE.md](../RELEASE.md).

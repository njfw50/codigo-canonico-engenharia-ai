# CNR OpticalGuard — design decision CNR-ADA-003
2026-11-25 · Proposed research extension, candidate 1.2.0; NOT implemented, validated or released.
Origin: user-supplied VOIDSTOMPER CAMERA & LENS REALISM MODULE, reviewed by GPT-6.2 at the author's request. Conceptual analysis only; no external code or vendor integration copied. Baseline PR head: f1acceef1465cbca12d6517f6aac89c1ce2954f2. Git records this document's content hash and commit provenance. Product authority: [README](../README.md), [TextureGuard](TEXTURE-GUARD.md), [acceptance gate](ACCEPTANCE.md). No new canon or ratification.

## Decision and rationale
Reuse optical coherence as a constraint on photo enhancement, not a mandate to synthesize amateur capture defects. Existing fine-texture losses and low-noise detector blind spots remain unresolved. Preserve the current accent-only TextureGuard contract: immutable source used solely as reference; no whole-image fallback or restoration from source pixels; keep the enhanced candidate when it passes, otherwise bounded candidate-only correction and revalidation or explicitly reject unresolved output. No assertion that sharpness equals true detail.

## Architecture and proposed boundaries
- Interface: existing modes and human review, no new user-facing controls required.
- Application: coordinates analysis of source and proposed candidate, existing TextureGuard, then optical checks on final output; bounded retries only, no bypass of existing gates.
- Domain: pure decision logic over explicit measurements and confidence; never infers a lens, device, depth map or missing detail as a fact. Proposed decision statuses: pass, corrected-and-revalidated, indeterminate/review, rejected.
- Infrastructure: obtains available metadata and image measurements; no new service or dependency authorized. Missing metadata stays unknown. Product implementation remains separate from this public research record.
- References: Canon VI (architecture before code), X (layer boundaries), XVIII (liturgical cognitive annotations and reconstructive human review before merge), XIX (verify and register dependencies in CDM in same implementation commit), XXI and XXII (provisional evaluation/provenance). This document introduces no runtime references. Implementation must verify the applicable CDM and change procedure and receive architectural review before code/merge.

## Extracted requirements and proposed checks
| ID | Requirement | Evidence / test |
|---|---|---|
| OG-01 | Respect actual capture geometry and aspect; no invented camera profile or lens distortion. | Dimensions, correspondence of landmarks and straight lines; missing EXIF case; review geometric edits. |
| OG-02 | Preserve natural depth of field and subject/background separation; avoid synthetic bokeh, focus shifts and false 3D structure. | Fixed focus-region comparisons and blinded review of contours, hair and subject boundaries. |
| OG-03 | Preserve plausible light direction, shadow structure, reflections and existing catchlights; no extra light source. | Local luminance structure and manual review of shadows/reflections; treat multiple actual sources as valid. |
| OG-04 | Avoid additional highlight/shadow clipping and unsupported recovery of clipped details; maintain natural tonal transitions. | Report newly clipped pixels separately from already-clipped pixels, per channel and region; retain TextureGuard's existing clipping gate; thresholds calibrated before holdout. |
| OG-05 | Preserve natural color relationships; correct color casts or chromatic fringes only when supported by evidence and authorized mode. | Color-patch/edge tests, neutral and mixed-light examples, skin-tone review; unknown reference stays unknown. |
| OG-06 | Distinguish noise/compression from authentic microtexture conservatively; no artificial grain, blocking, banding, blur, smear or sharpening halos. | Repeated texture, low-noise and compressed fixtures; high-frequency energy/correlation only as proxies, paired reference and human inspection. |
| OG-07 | Keep intentional composition, identity, text, materials, accessories and scene content. | Critical integrity-error review, including text and face geometry; no identity recognition claim. |
| OG-08 | Retain enhancement; do not deliver source as processed output or copy source pixels to restore the candidate. | Equality rejection, source hash unchanged, candidate-only corrections and explicit no-result state when unresolved. |

Reject mandatory lens dirt, forced under/overexposure, artificial single-light constraints, simulated anamorphic flares, prescribed vignetting, digital zoom, VHS/codec defects, rolling shutter and camera shake. Operator behavior and temporal artifacts are out of scope for static photos. Do not assume inverse-square falloff for all lighting geometries or claim sensor/lens simulation. No NVIDIA/DLSS, physical reconstruction or optical certification claims.

## Evaluation plan (not executed)
Development: use existing grass/gravel/clock diagnostic set to investigate low-noise misses; include clean images and low-light, mixed-light, compression, portrait edges, lettering and clipping cases. Freeze thresholds on development data, not held-out outcomes. Compare same editor/budget with existing CNR versus CNR plus proposed OpticalGuard; retain prior baseline and full CNR-RP-001 confirmatory protocol (at least 60 distinct authorized photos, sample size from power analysis, blinded review, paired image-level analysis). Report every failure and abstention, latency, per-category results, and whether texture regressions persist. Do not weaken existing acceptance gates or infer success from unit checks; no-reference images assessed separately. Record source/prompt/output hashes, tool versions and human decision. No runtime implementation, results or release approval claimed by this decision. Commercial package, checkout and publication remain blocked.

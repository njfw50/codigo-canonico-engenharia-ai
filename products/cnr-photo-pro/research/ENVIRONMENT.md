# Independent research environment provision — pending acceptance

This prerequisite proposal is deliberately limited to the environment contract and its independently executable smoke test. It is not approval of CNR Photo Pro or a replacement for the full review of PR #22 at bf9764959fbedb5509cb78142d2cc7d79243d9b8. That PR remains blocked by the original enforcement run 45624197611. The original enforcement and laws remain untouched. No production code, interface, neural model, paid package or release is authorized by this stage.

The manifest is byte-identical to the manifest in PR #22 (Git blob a2e1457cd62b10081b9515ee622557c30880f104). Five pinned distributions were present in the local research environment; representative Pillow, SciPy, scikit-image and OpenCV operations succeeded. Both OpenCV distributions are installed locally; a clean, isolated installation and its transitive dependency resolution have not been verified. Test in a clean Python 3.12 environment:
```sh
python -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.txt
python -m pip check
python -m unittest -v test_environment
```
Acceptance requires clean installation, exact versions, successful smoke tests, dependency/license review and explicit review of the full product diff, including the original blocked file combination. A green result on this smaller proposal must not be treated as overturning the full-product rejection. Do not integrate this prerequisite solely to manufacture a green result on PR #22. Independent environment acceptance and the product's own complete review must precede release. Preserve historical evidence and the original failed checks.

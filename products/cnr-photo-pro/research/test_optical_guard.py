"""Deterministic fixtures for the narrow OpticalGuard RGB8 contract."""
import unittest
from optical_guard import assess


class OpticalGuardTests(unittest.TestCase):
    def setUp(self):
        self.src = bytes([100] * (64 * 64 * 3))

    def check(self, src, dst):
        return assess(src, dst, 64, 64, 64, 64)

    def test_valid_candidate_requires_review(self):
        self.assertEqual(self.check(self.src, bytes([101]) * len(self.src))['status'], 'review_required')

    def test_unchanged_rejected(self):
        self.assertEqual(self.check(self.src, self.src)['status'], 'rejected_unchanged_source')

    def test_geometry_rejected(self):
        self.assertEqual(assess(self.src, self.src, 64, 64, 32, 128)['status'], 'rejected_geometry')

    def test_invalid_bytes_rejected(self):
        self.assertEqual(self.check(self.src, b'abc')['status'], 'rejected_invalid_input')

    def test_new_highlights(self):
        self.assertEqual(self.check(self.src, bytes([255]) * len(self.src))['status'], 'rejected_new_clipping')

    def test_new_shadows(self):
        self.assertEqual(self.check(self.src, bytes(len(self.src)))['status'], 'rejected_new_clipping')

    def test_existing_clip_not_counted(self):
        src = bytes([0, 255, 100]) * 4096
        result = self.check(src, bytes([0, 255, 101]) * 4096)
        self.assertEqual(result['status'], 'review_required')
        self.assertEqual(result['new_highlight_fraction'], 0)
        self.assertEqual(result['new_shadow_fraction'], 0)

    def test_recovered_clip_cannot_cancel_new_clip(self):
        src = bytes([255]) * 300 + self.src[300:]
        dst = self.src[:300] + bytes([255]) * 300 + self.src[600:]
        self.assertEqual(self.check(src, dst)['status'], 'rejected_new_clipping')

    def test_local_damage_below_global_limit(self):
        # 16x16 tiles: 45 newly clipped channels in one tile, <1% global, >5% local.
        dst = bytes([255]) * 45 + self.src[45:]
        result = assess(self.src, dst, 64, 64, 64, 64, tile=16)
        self.assertLess(result['new_highlight_fraction'], .01)
        self.assertEqual(result['status'], 'rejected_new_clipping')

    def test_partial_tile(self):
        result = assess(bytes([100]) * 9, bytes([101]) * 9, 3, 1, 3, 1)
        self.assertEqual(result['status'], 'review_required')

    def test_no_claim_of_semantic_validation(self):
        result = self.check(self.src, bytes([101]) * len(self.src))
        self.assertEqual(result['semantic_validation'], 'not_evaluated')


if __name__ == '__main__':
    unittest.main()

"""Standalone dependency environment smoke test; no application imports."""
import unittest
from importlib.metadata import version
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
from skimage.restoration import denoise_nl_means
import cv2

class EnvironmentTest(unittest.TestCase):
    def test_exact_versions(self):
        for name, expected in {
            'numpy': '2.3.5', 'Pillow': '12.3.0', 'scikit-image': '0.26.0',
            'scipy': '1.17.0', 'opencv-python-headless': '4.13.0.92'
        }.items():
            self.assertEqual(version(name), expected, name)

    def test_processing_dependencies(self):
        data = np.random.default_rng(42).random((16, 16, 3))
        pixels = np.uint8(data * 255)
        self.assertEqual(Image.fromarray(pixels).size, (16, 16))
        for result in (gaussian_filter(data, (1, 1, 0)),
                       denoise_nl_means(data, h=.1, channel_axis=-1),
                       cv2.fastNlMeansDenoisingColored(pixels, None, 3, 3, 5, 11)):
            self.assertEqual(result.shape, data.shape)
            self.assertTrue(np.isfinite(result).all())

if __name__ == '__main__':
    unittest.main()

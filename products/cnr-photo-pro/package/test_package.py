import tempfile, unittest
from pathlib import Path
from PIL import Image
import numpy as np
from cnr import process

class PackageTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup);self.p=Path(self.temp.name)
        self.src=self.p/'source.png';self.dst=self.p/'out.png'
        r=np.random.default_rng(21); x=np.clip(100+r.normal(0,8,(64,64,3)),0,255).astype('uint8');Image.fromarray(x).save(self.src)
    def test_standard_real_processing(self):
        before=self.src.read_bytes(); result=process(self.src,self.dst); self.assertEqual(result['status'],'review_required'); self.assertEqual(before,self.src.read_bytes());self.assertNotEqual(result['source_pixels_sha256'],result['output_pixels_sha256']);
        with Image.open(self.dst) as saved: self.assertEqual(saved.size,(64,64))
    def test_refuse_source_overwrite(self):
        with self.assertRaises(ValueError): process(self.src,self.src)
    def test_refuse_existing_output(self):
        self.dst.write_bytes(b'keep');
        with self.assertRaises(ValueError): process(self.src,self.dst)
        self.assertEqual(self.dst.read_bytes(),b'keep')
    def test_invalid_mode(self):
        Image.new('L',(64,64)).save(self.src)
        with self.assertRaises(ValueError):process(self.src,self.dst)
        self.assertFalse(self.dst.exists())
    def test_unknown_blur(self):
        with self.assertRaises(ValueError):process(self.src,self.dst,float('nan'))
    def test_spectral_real_processing(self):
        result=process(self.src,self.dst,1.2);self.assertEqual(result['status'],'review_required');self.assertNotEqual(result['source_pixels_sha256'],result['output_pixels_sha256'])
    def test_rejection_writes_no_file(self):
        from unittest.mock import patch
        with patch('cnr.enhance',return_value=(None,'rejected')):
            self.assertEqual(process(self.src,self.dst)['status'],'no_output')
        self.assertFalse(self.dst.exists())
if __name__=='__main__':unittest.main()

import unittest
from unittest.mock import patch
from PIL import Image
from application import enhance

class ApplicationTests(unittest.TestCase):
    def test_modes(self):
        self.assertEqual(enhance(Image.new('L',(16,16))),(None,'invalid_input'))
        self.assertEqual(enhance(Image.new('RGB',(1,2))),(None,'invalid_input'))
    def test_no_source_fallback(self):
        source=Image.new('RGB',(16,16),(100,100,100))
        with patch('application.proposals',return_value=iter([('same',source)])), patch('application.conservative',return_value=source):
            self.assertEqual(enhance(source),(None,'rejected'))
    def test_clipped_rejected(self):
        source=Image.new('RGB',(16,16),(100,100,100)); bad=Image.new('RGB',source.size,(255,255,255))
        with patch('application.proposals',return_value=iter([('bad',bad)])), patch('application.conservative',return_value=bad):
            self.assertEqual(enhance(source),(None,'rejected'))
    def test_candidate_for_review_only(self):
        source=Image.new('RGB',(16,16),(100,100,100)); good=Image.new('RGB',source.size,(101,101,101))
        before=source.tobytes()
        with patch('application.proposals',return_value=iter([('good',good)])), patch('application.conservative',side_effect=AssertionError('unexpected fallback')):
            out,method=enhance(source)
            self.assertEqual(method,'good'); self.assertEqual(out.tobytes(),good.tobytes()); self.assertEqual(source.tobytes(),before)
if __name__=='__main__': unittest.main()

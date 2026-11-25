import ast
from pathlib import Path
import unittest
from unittest.mock import patch
from PIL import Image
from release_domain import RGBFrame
from release_application import restore
from release_composition import enhance

class LayerTests(unittest.TestCase):
    def setUp(self):
        self.source = RGBFrame(2, 2, bytes([100]*12))
        self.good = RGBFrame(2, 2, bytes([101]*12))
    def test_import_boundaries(self):
        for file, allowed in [('release_domain.py', {'dataclasses'}),
                              ('release_application.py', {'release_domain','typing'})]:
            imports=set()
            for node in ast.walk(ast.parse(Path(__file__).with_name(file).read_text())):
                if isinstance(node,ast.Import): imports.update(x.name for x in node.names)
                elif isinstance(node,ast.ImportFrom): imports.add(node.module)
            self.assertLessEqual(imports,allowed)
    def test_valid_candidate(self):
        self.assertEqual(restore(self.source,lambda s:[('good',self.good)],lambda s,c:c,lambda s,c:'review_required'),(self.good,'good'))
    def test_no_source_or_geometry_fallback(self):
        self.assertEqual(restore(self.source,lambda s:[('same',s),('bad',RGBFrame(3,2,bytes(18)))],lambda s,c:c,lambda s,c:'review_required'),(None,'rejected'))
    def test_guard_rejections(self):
        p=lambda s:[('good',self.good)]
        self.assertEqual(restore(self.source,p,lambda s,c:None,lambda s,c:'review_required'),(None,'rejected'))
        self.assertEqual(restore(self.source,p,lambda s,c:c,lambda s,c:'rejected_new_clipping'),(None,'rejected'))
    def test_failure_closed(self):
        def broken(s): raise RuntimeError('test')
        self.assertEqual(restore(self.source,broken,lambda s,c:c,lambda s,c:'review_required'),(None,'processing_error'))
    def test_invalid_input(self):
        self.assertEqual(enhance(Image.new('L',(2,2))),(None,'invalid_input'))
    def test_actual_guards(self):
        source=Image.new('RGB',(16,16),(100,100,100)); good=Image.new('RGB',source.size,(101,101,101)); bad=Image.new('RGB',source.size,(255,255,255))
        with patch('release_composition.proposals',return_value=iter([('bad',bad),('good',good)])):
            out,method=enhance(source)
        self.assertEqual(method,'good'); self.assertEqual(out.tobytes(),good.tobytes()); self.assertEqual(source.tobytes(),bytes([100])*768)
if __name__=='__main__': unittest.main()

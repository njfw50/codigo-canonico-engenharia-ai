"""Local file interface for the frozen CNR candidate; preserves the source file."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent / 'engine'))
from PIL import Image, ImageOps
from release_composition import enhance
from rescue_texture import rescue


def process(input_path, output_path, known_blur=None):
    source_path, target = Path(input_path), Path(output_path)
    if source_path.resolve() == target.resolve() or target.exists():
        raise ValueError('A saída deve ser um arquivo novo; sobrescrita proibida.')
    if target.suffix.lower() != '.png':
        raise ValueError('A saída deve ter extensão .png.')
    if known_blur is not None and (not math.isfinite(known_blur) or not 0 < known_blur <= 2):
        raise ValueError('Sigma conhecido deve estar entre 0 (exclusive) e 2.')
    with Image.open(source_path) as photo:
        if photo.format not in ('JPEG','PNG') or getattr(photo,'n_frames',1) != 1:
            raise ValueError('Somente JPEG ou PNG de um quadro.')
        if photo.width * photo.height > 4_000_000 or min(photo.size)<8:
            raise ValueError('Limite do pacote de avaliação: 4 megapixels e mínimo de 8 pixels por lado.')
        if photo.mode != 'RGB':
            raise ValueError('Somente imagens RGB de 8 bits; converta uma cópia antes de usar.')
        source = ImageOps.exif_transpose(photo).copy()
        icc = source.info.get('icc_profile')
        source.info.clear()
    original = hashlib.sha256(source.tobytes()).hexdigest()
    if known_blur is None:
        result, method = enhance(source)
    else:
        result, attempts = rescue(source, known_blur)
        method = 'spectral_known_blur' if result is not None else 'rejected'
    if result is None:
        return {'status':'no_output','method':method}
    if hashlib.sha256(source.tobytes()).hexdigest()!=original or result.size!=source.size or result.tobytes()==source.tobytes():
        raise RuntimeError('Falha de integridade.')
    # Exclusividade evita inclusive sobrescrita por concorrência ou link simbólico.
    import io
    buf = io.BytesIO()
    result.info.clear()
    result.save(buf, format='PNG', **({'icc_profile':icc} if icc else {}))
    with target.open('xb') as dest:
        dest.write(buf.getvalue())
    return {'status':'review_required','method':method,'output':str(target),'dimensions':list(result.size),'source_pixels_sha256':original,'output_pixels_sha256':hashlib.sha256(result.tobytes()).hexdigest()}


def main():
    parser=argparse.ArgumentParser(description='CNR Photo Pro 1.2.0 RC — aprimoramento local')
    parser.add_argument('input'); parser.add_argument('output')
    parser.add_argument('--known-blur',type=float,help='Experimental: sigma gaussiano conhecido em pixels. Não adivinhar.')
    args=parser.parse_args()
    try:
        report=process(args.input,args.output,args.known_blur)
        print(json.dumps(report,ensure_ascii=False,indent=2))
        return 0 if report['status']=='review_required' else 2
    except Exception as exc:
        print(f'Erro: {exc}',file=sys.stderr); return 1

if __name__=='__main__': raise SystemExit(main())

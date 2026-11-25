"""Frozen spectral replay outside grass/gravel tuning; research only."""
import csv
import hashlib
from concurrent.futures import ProcessPoolExecutor
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter
from skimage import data, metrics
from rescue_texture import rescue

REPLAY = ('astronaut','camera','coffee','chelsea','clock','coins','moon','page','rocket','horse','brick','text')
EXTRA = ('hubble_deep_field','immunohistochemistry','cell','retina')

def run(case):
    name,noise,actual,assumed=case
    ref=Image.fromarray(getattr(data,name)()).convert('RGB')
    ref.thumbnail((256,256),Image.Resampling.LANCZOS)
    blurred=gaussian_filter(np.asarray(ref,dtype=float)/255,(actual,actual,0))
    src=Image.fromarray(np.rint(np.clip(blurred+np.random.default_rng(42).normal(0,noise,blurred.shape),0,1)*255).astype('uint8'))
    digest=lambda im:hashlib.sha256(im.tobytes()).hexdigest()
    original=digest(src)
    baseline=src.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.UnsharpMask(radius=1.2,percent=150,threshold=3))
    out,attempts=rescue(src,assumed)
    assert digest(src)==original and (out is None or (out.size==src.size and digest(out)!=original))
    score=lambda im:float(metrics.structural_similarity(np.asarray(ref),np.asarray(im),channel_axis=-1,data_range=255))
    return dict(image=name,group='replay' if name in REPLAY else 'additional_sample',noise=noise,seed=42,actual_blur=actual,assumed_blur=assumed,baseline_ssim=score(baseline),output_ssim=score(out) if out is not None else '',status=attempts[-1]['status'],attempts=len(attempts),source_sha=original,output_sha=digest(out) if out is not None else '')

def main():
    cases=[(n,s,1.2,1.2) for n in REPLAY+EXTRA for s in (.025,.05,.08)]
    cases += [(n,.05,b,1.2) for n in ('brick','coffee','astronaut','hubble_deep_field') for b in (.6,1.8)]
    with ProcessPoolExecutor(max_workers=4) as pool:
        rows=list(pool.map(run,cases))
    with open('spectral-extension.csv','w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
if __name__=='__main__':main()

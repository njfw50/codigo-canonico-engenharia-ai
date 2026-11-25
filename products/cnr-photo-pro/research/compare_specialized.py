"""Repeat previous development corpus; not an independent validation."""
import csv, hashlib
from collections import Counter
import numpy as np
from PIL import Image, ImageFilter
from skimage import data, metrics
from scipy.ndimage import gaussian_filter
from validate_integration import NAMES, SIGMAS, SEEDS
from specialized_engine import propose, integrate

def score(a,b): return float(metrics.structural_similarity(np.asarray(a),np.asarray(b),channel_axis=-1,data_range=255))
def digest(im): return hashlib.sha256(im.tobytes()).hexdigest()
rows=[]
for name in NAMES:
    ref=Image.fromarray(getattr(data,name)()).convert('RGB'); ref.thumbnail((256,256),Image.Resampling.LANCZOS)
    blur=gaussian_filter(np.asarray(ref,dtype=float)/255,(1.2,1.2,0))
    for noise in SIGMAS:
        for seed in SEEDS:
            src=Image.fromarray(np.rint(np.clip(blur+np.random.default_rng(seed).normal(0,noise,blur.shape),0,1)*255).astype('uint8'))
            sha=digest(src); base=src.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.UnsharpMask(radius=1.2,percent=150,threshold=3)); b=score(ref,base)
            for method in ('nlm','opencv'):
                candidate,est=propose(src,method); out,report=integrate(src,candidate)
                assert digest(src)==sha and (out is None or (out.size==src.size and digest(out)!=sha))
                rows.append(dict(image=name,noise=noise,seed=seed,method=method,estimated_sigma=est,baseline_ssim=b,candidate_ssim=score(ref,candidate),output_ssim=score(ref,out) if out is not None else '',status=report['status'],texture=report['texture']['status'],source_sha=sha,output_sha=digest(out) if out is not None else ''))
    print(name,flush=True)
with open('specialized-results.csv','w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
for method in ('nlm','opencv'):
    r=[x for x in rows if x['method']==method]; a=[x for x in r if x['output_ssim']!='']; d=np.array([x['output_ssim']-x['baseline_ssim'] for x in a]); print(method,Counter(x['status'] for x in r), 'raw delta',np.mean([x['candidate_ssim']-x['baseline_ssim'] for x in r]), 'reviewable delta',d.mean() if len(d) else None,'wins',sum(d>0),'losses',sum(d<0),flush=True)

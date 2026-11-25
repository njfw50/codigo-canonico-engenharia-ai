"""Fixed diagnostic, not the confirmatory generative experiment."""
import csv, hashlib, json, sys
import numpy as np
import PIL, scipy, skimage
from PIL import Image, ImageFilter
from skimage import data, metrics
from scipy.ndimage import gaussian_filter
from integrated_engine import propose, integrate

NAMES = ('grass','gravel','clock','camera','coffee','astronaut','chelsea','coins','moon','page','rocket','horse','brick','text')
SIGMAS = (.025,.05,.08)
SEEDS = (42,43,44)

def digest(im):
    return hashlib.sha256(im.tobytes()).hexdigest()

def scores(ref, im):
    a, b = np.asarray(ref), np.asarray(im)
    return (metrics.structural_similarity(a,b,data_range=255,channel_axis=-1), metrics.peak_signal_noise_ratio(a,b,data_range=255))

def run(prefix):
    rows = []
    for name in NAMES:
        ref = Image.fromarray(getattr(data,name)()).convert('RGB')
        ref.thumbnail((256,256),Image.Resampling.LANCZOS)
        a = np.asarray(ref,dtype=float)/255
        blur = gaussian_filter(a,(1.2,1.2,0))
        for sigma in SIGMAS:
            for seed in SEEDS:
                src = Image.fromarray(np.rint(np.clip(blur+np.random.default_rng(seed).normal(0,sigma,a.shape),0,1)*255).astype('uint8'))
                before = digest(src)
                baseline = src.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.UnsharpMask(radius=1.2,percent=150,threshold=3))
                candidate = propose(src)
                out, report = integrate(src,candidate)
                assert digest(src) == before
                assert out is None or (out.size == src.size and out.tobytes() != src.tobytes() and report['status']=='review_required')
                b,p = scores(ref,baseline); c,q = scores(ref,candidate)
                g,h = scores(ref,out) if out is not None else (None,None)
                rows.append(dict(image=name,sigma=sigma,seed=seed,source_sha256=before,output_sha256=digest(out) if out is not None else '',baseline_ssim=b,baseline_psnr=p,candidate_ssim=c,candidate_psnr=q,output_ssim=g,output_psnr=h,status=report['status'],texture=report['texture']['status']))
    with open(prefix+'.csv','w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0])); w.writeheader();w.writerows(rows)
    accepted=[r for r in rows if r['output_ssim'] is not None]
    from collections import Counter
    deltas=[r['output_ssim']-r['baseline_ssim'] for r in accepted]
    by_image={n:{'total':9,'reviewable':sum(r['image']==n for r in accepted),'mean_delta':float(np.mean([r['output_ssim']-r['baseline_ssim'] for r in accepted if r['image']==n])) if any(r['image']==n for r in accepted) else None} for n in NAMES}
    summary=dict(versions=dict(numpy=np.__version__,pillow=PIL.__version__,scipy=scipy.__version__,skimage=skimage.__version__),images=len(NAMES),variants=len(rows),statuses=dict(Counter(r['status'] for r in rows)),texture_statuses=dict(Counter(r['texture'] for r in rows)),reviewable=len(accepted),mean_delta_reviewable=float(np.mean(deltas)) if deltas else None,improved=int(sum(d>0 for d in deltas)),worsened=int(sum(d<0 for d in deltas)),by_image=by_image,source_returns=0)
    with open(prefix+'.json','w') as f: json.dump(summary,f,indent=2)
    print(json.dumps(summary,indent=2))

if __name__=='__main__': run(sys.argv[1] if len(sys.argv)>1 else 'integration-results')

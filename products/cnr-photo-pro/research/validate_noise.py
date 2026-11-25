"""Development replay, not independent validation."""
import csv, hashlib, json
from concurrent.futures import ProcessPoolExecutor
from collections import Counter
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter
from skimage import data, metrics
from validate_integration import NAMES,SIGMAS,SEEDS
from noise_diagnostic import evaluate,shadow_texture
from texture_guard import protect


def run(case):
    name,noise,seed=case
    ref=Image.fromarray(getattr(data,name)()).convert('RGB'); ref.thumbnail((256,256),Image.Resampling.LANCZOS)
    blur=gaussian_filter(np.asarray(ref,dtype=float)/255,(1.2,1.2,0))
    clean=Image.fromarray(np.rint(blur*255).astype('uint8'))
    src=Image.fromarray(np.rint(np.clip(blur+np.random.default_rng(seed).normal(0,noise,blur.shape),0,1)*255).astype('uint8'))
    digest=lambda im:hashlib.sha256(im.tobytes()).hexdigest()
    before=digest(src); base=src.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.UnsharpMask(radius=1.2,percent=150,threshold=3))
    candidate,out,report,diag,sigma,h=evaluate(src)
    assert digest(src)==before and (out is None or (digest(out)!=before and out.size==src.size))
    score=lambda im:float(metrics.structural_similarity(np.asarray(ref),np.asarray(im),data_range=255,channel_axis=-1))
    # Oracle controls used only to evaluate detector, never by the processor.
    destructive=clean.filter(ImageFilter.GaussianBlur(3))
    return dict(image=name,noise=noise,seed=seed,source_sha=before,output_sha=digest(out) if out else '',sigma=sigma,h=h,baseline=score(base),candidate=score(candidate),output=score(out) if out else None,status=report['status'],shadow=diag,old_clean_rejected=protect(src,clean)[0] is None,old_damage_rejected=protect(src,destructive)[0] is None,shadow_clean=shadow_texture(src,clean,sigma),shadow_damage=shadow_texture(src,destructive,sigma))


def main():
    with ProcessPoolExecutor(max_workers=4) as pool:
        rows=list(pool.map(run,[(n,s,t) for n in NAMES for s in SIGMAS for t in SEEDS]))
    with open('noise-results.csv','w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
    a=[r for r in rows if r['output'] is not None]
    summary=dict(cases=len(rows),status=dict(Counter(r['status'] for r in rows)),raw_gain=float(np.mean([r['candidate']-r['baseline'] for r in rows])),accepted_gain=float(np.mean([r['output']-r['baseline'] for r in a])) if a else None,old_clean_rejected=sum(r['old_clean_rejected'] for r in rows),old_damage_rejected=sum(r['old_damage_rejected'] for r in rows),shadow_clean=dict(Counter(r['shadow_clean'] for r in rows)),shadow_damage=dict(Counter(r['shadow_damage'] for r in rows)),by_noise={str(s):dict(status=dict(Counter(r['status'] for r in rows if r['noise']==s)),raw_gain=float(np.mean([r['candidate']-r['baseline'] for r in rows if r['noise']==s]))) for s in SIGMAS})
    with open('noise-summary.json','w') as f:json.dump(summary,f,indent=2)
    print(json.dumps(summary,indent=2),flush=True)

if __name__=='__main__':main()

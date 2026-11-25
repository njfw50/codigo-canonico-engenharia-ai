"""Replay targeted development cases; clean reference used only for evaluation."""
import csv,hashlib,json
import numpy as np
from PIL import Image,ImageFilter
from scipy.ndimage import gaussian_filter
from skimage import data,metrics
from rescue_texture import rescue


def main():
    rows=[]; logs=[]
    for name in ('grass','gravel'):
        ref=Image.fromarray(getattr(data,name)()).convert('RGB'); ref.thumbnail((256,256),Image.Resampling.LANCZOS)
        blur=gaussian_filter(np.asarray(ref,dtype=float)/255,(1.2,1.2,0))
        for noise in (.025,.05,.08):
            for seed in (42,43,44):
                source=Image.fromarray(np.rint(np.clip(blur+np.random.default_rng(seed).normal(0,noise,blur.shape),0,1)*255).astype('uint8'))
                digest=lambda im:hashlib.sha256(im.tobytes()).hexdigest()
                before=digest(source)
                baseline=source.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.UnsharpMask(radius=1.2,percent=150,threshold=3))
                out,attempts=rescue(source,1.2)
                assert before==digest(source) and (out is None or (out.size==source.size and digest(out)!=before))
                score=lambda im:float(metrics.structural_similarity(np.asarray(ref),np.asarray(im),channel_axis=-1,data_range=255))
                row=dict(image=name,noise=noise,seed=seed,baseline=score(baseline),output=score(out) if out is not None else None,status=attempts[-1]['status'],factor=attempts[-1]['factor'],source_sha=before,output_sha=digest(out) if out is not None else '')
                rows.append(row); logs.extend(dict(image=name,noise=noise,seed=seed,**a) for a in attempts)
                if noise==.08 and seed==42 and out is not None:
                    out.save(name+'-rescue.png'); source.save(name+'-noisy.png'); baseline.save(name+'-baseline.png')
                print(name,noise,seed,row['status'],row['factor'],row['baseline'],row['output'],flush=True)
    for fname,records in [('rescue-results.csv',rows),('rescue-attempts.csv',logs)]:
        with open(fname,'w',newline='') as f:
            w=csv.DictWriter(f,fieldnames=list(records[0]));w.writeheader();w.writerows(records)

if __name__=='__main__':main()

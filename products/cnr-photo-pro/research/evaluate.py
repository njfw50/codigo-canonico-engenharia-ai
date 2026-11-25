import csv,hashlib,json,numpy as np
import PIL,scipy,skimage
from PIL import Image,ImageFilter
from skimage import data,metrics
from scipy.ndimage import gaussian_filter
from application import enhance
NAMES=('grass','gravel','clock','camera','coffee','astronaut','chelsea','coins','moon','page','rocket','horse','brick','text')
rows=[]
for name in NAMES:
    ref=Image.fromarray(getattr(data,name)()).convert('RGB');ref.thumbnail((256,256),Image.Resampling.LANCZOS)
    a=np.asarray(ref,dtype=float)/255;blur=gaussian_filter(a,(1.2,1.2,0))
    for sigma in (.025,.05,.08):
        for seed in (42,43,44):
            src=Image.fromarray(np.rint(np.clip(blur+np.random.default_rng(seed).normal(0,sigma,a.shape),0,1)*255).astype('uint8'));before=src.tobytes()
            base=src.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.UnsharpMask(radius=1.2,percent=150,threshold=3));out,method=enhance(src)
            assert src.tobytes()==before
            assert out is None or (out.size==src.size and out.tobytes()!=before)
            def s(im):return float(metrics.structural_similarity(np.asarray(ref),np.asarray(im),data_range=255,channel_axis=-1))
            b=s(base);g=s(out) if out is not None else None
            rows.append(dict(method=method,image=name,sigma=sigma,seed=seed,baseline_ssim=b,output_ssim=g,delta=None if g is None else g-b,status='review_required' if out is not None else 'rejected',source_sha256=hashlib.sha256(before).hexdigest(),output_sha256=hashlib.sha256(out.tobytes()).hexdigest() if out is not None else ''))
with open('advanced.csv','w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=rows[0]);w.writeheader();w.writerows(rows)
d=[r['delta'] for r in rows if r['delta'] is not None]
summary=dict(versions=[np.__version__,PIL.__version__,scipy.__version__,skimage.__version__],total=len(rows),reviewable=len(d),improved=sum(x>0 for x in d),worsened=sum(x<0 for x in d),mean_delta=float(np.mean(d)),by_image={n:float(np.mean([r['delta'] for r in rows if r['image']==n and r['delta'] is not None])) if any(r['image']==n and r['delta'] is not None for r in rows) else None for n in NAMES},source_returns=0)
open('advanced.json','w').write(json.dumps(summary,indent=2));print(summary)

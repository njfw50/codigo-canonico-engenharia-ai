import csv, sys
import numpy as np
from PIL import Image, ImageFilter
from skimage import data, metrics
from skimage.filters import gaussian
import PIL, skimage

rows=[]
for name in ('astronaut','coffee','chelsea','camera'):
    reference=np.asarray(Image.fromarray(getattr(data,name)()).convert('RGB'),dtype=np.float64)/255
    blurred=gaussian(reference,1.2,channel_axis=-1)
    for sigma in (0.025,0.05,0.08):
        for seed in (42,43,44):
            degraded=Image.fromarray(np.rint(np.clip(blurred+np.random.default_rng(seed).normal(0,sigma,reference.shape),0,1)*255).astype('uint8'))
            baseline=degraded.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.UnsharpMask(radius=1.2,percent=150,threshold=3))
            conservative=Image.blend(baseline,degraded,0.4)
            row={'image':name,'sigma':sigma,'seed':seed}
            for key,im in [('input',degraded),('baseline',baseline),('conservative',conservative)]:
                a=np.asarray(im,dtype=np.float64)/255
                row[key+'_psnr']=metrics.peak_signal_noise_ratio(reference,a,data_range=1)
                row[key+'_ssim']=metrics.structural_similarity(reference,a,data_range=1,channel_axis=-1)
            rows.append(row)
with open(sys.argv[1] if len(sys.argv)>1 else 'results.csv','w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
print('Versions:',np.__version__,PIL.__version__,skimage.__version__)
for name in ('astronaut','coffee','chelsea','camera','all'):
    subset=[r for r in rows if name=='all' or r['image']==name]
    print(name,len(subset),*[round(float(np.mean([r[k] for r in subset])),6) for k in list(rows[0])[3:]])
print('Paired SSIM wins',sum(r['conservative_ssim']>r['baseline_ssim'] for r in rows),'of',len(rows))

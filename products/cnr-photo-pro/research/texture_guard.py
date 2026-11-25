"""CNR TextureGuard: accent-only correction; never substitutes the source."""
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

def protect(source, proposed, tile=32, min_energy=.025, min_ratio=.85, min_corr=.85):
    if source.mode != 'RGB' or proposed.mode != 'RGB' or source.size != proposed.size:
        return None, {'status':'rejected_geometry_or_mode'}
    a=np.asarray(source,dtype=float)/255; b=np.asarray(proposed,dtype=float)/255
    if np.array_equal(a,b):
        return None, {'status':'rejected_unchanged_source'}
    def band(x):
        y=x @ np.array([.2126,.7152,.0722]); return gaussian_filter(y,.65)-gaussian_filter(y,1.8)
    ref=band(a)
    def failures(x):
        out=band(x); fail=[]; checked=0
        for i in range(0,a.shape[0],tile):
            for j in range(0,a.shape[1],tile):
                p=ref[i:i+tile,j:j+tile].ravel(); q=out[i:i+tile,j:j+tile].ravel()
                p=p-p.mean(); q=q-q.mean(); pe=np.sqrt(np.mean(p*p)); qe=np.sqrt(np.mean(q*q))
                if pe<min_energy: continue
                checked+=1; corr=np.mean(p*q)/max(pe*qe,1e-12)
                if qe/pe<min_ratio or corr<min_corr: fail.append((i,j))
        return checked,fail
    checked,initial=failures(b)
    mask=np.zeros(a.shape[:2])
    for i,j in initial: mask[i:i+tile,j:j+tile]=1
    mask=gaussian_filter(mask,2)[...,None]
    y=b @ np.array([.2126,.7152,.0722]); detail=y-gaussian_filter(y,.9)
    clip=lambda x: np.mean((x<=0)|(x>=1))
    for gain in (0.,.25,.5,.75,1.,1.25,1.5,2.):
        inc=np.clip(gain*detail[...,None]*mask,-.06,.06)
        x=np.clip(b+inc,0,1)
        result=Image.fromarray(np.rint(x*255).astype('uint8'))
        actual=np.asarray(result,dtype=float)/255; _,remaining=failures(actual)
        if not remaining and not np.array_equal(actual,a) and clip(actual)-clip(b)<=.01:
            return result, {'status':'accepted_candidate' if gain==0 else 'accent_corrected','tiles_checked':checked,'initial_violations':len(initial),'remaining_violations':0,'gain':gain}
    return None, {'status':'rejected_unresolved_texture','tiles_checked':checked,'initial_violations':len(initial),'remaining_violations':len(initial),'gain':None}

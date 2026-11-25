"""Research-only calibration and shadow texture diagnostics; no gate override."""
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
from skimage.restoration import calibrate_denoiser, denoise_nl_means
from integrated_engine import integrate


def estimate(x):
    # Haar diagonal coefficient MAD avoids mistaking broad gradients for noise.
    a=x[:x.shape[0]//2*2,:x.shape[1]//2*2]
    p,q,r,s=a[::2,::2],a[1::2,::2],a[::2,1::2],a[1::2,1::2]
    hh=(p-q-r+s)/2
    good=(np.minimum.reduce([p,q,r,s])>.02)&(np.maximum.reduce([p,q,r,s])<.98)
    v=hh[good] if good.sum()>=64 else hh.ravel()
    return max(float(np.median(np.abs(v-np.median(v)))/.67449),1/255)


def propose(source):
    # Calibrate on noisy luminance only; transfer selected h to ordinary RGB NLM.
    x=np.asarray(source,dtype=float)/255; sigma=estimate(x)
    y=x @ np.array([.2126,.7152,.0722])
    i,j=max(0,(y.shape[0]-64)//2),max(0,(y.shape[1]-64)//2)
    _,(params,losses)=calibrate_denoiser(y[i:i+64,j:j+64],denoise_nl_means,
        {'h':[.4*sigma,.8*sigma,1.2*sigma], 'patch_size':[5],
         'patch_distance':[3], 'fast_mode':[True]},stride=4,extra_output=True)
    h=float(params[int(np.argmin(losses))]['h'])
    z=denoise_nl_means(x,h=h,sigma=sigma,patch_size=5,patch_distance=3,fast_mode=True,channel_axis=-1)
    # Accent the processed candidate only, without source substitution.
    l=z @ np.array([.2126,.7152,.0722]); d=l-gaussian_filter(l,1.2)
    accent=np.clip(.8*np.sign(d)*np.maximum(np.abs(d)-.25*sigma,0),-.06,.06)
    return Image.fromarray(np.rint(np.clip(z+accent[...,None],0,1)*255).astype('uint8')),sigma,h


def shadow_texture(source,candidate,sigma):
    # Estimate noise contribution to each band; weak evidence is indeterminate.
    w=np.array([.2126,.7152,.0722]); a=np.asarray(source,dtype=float)/255 @ w; b=np.asarray(candidate,dtype=float)/255 @ w
    flagged=checked=0
    impulse=np.zeros((41,41)); impulse[20,20]=1
    for s1,s2 in ((.65,1.8),(1.8,3.6)):
        band=lambda y:gaussian_filter(y,s1)-gaussian_filter(y,s2)
        p,q=band(a),band(b)
        nv=float(sigma**2*np.sum(w**2)*np.sum(band(impulse)**2))
        for i in range(0,a.shape[0],32):
            for j in range(0,a.shape[1],32):
                u=p[i:i+32,j:j+32].ravel(); v=q[i:i+32,j:j+32].ravel()
                u=u-u.mean(); v=v-v.mean(); signal=max(0.,float(np.mean(u*u))-nv)
                if signal<max(.0001,2*nv): continue
                checked+=1
                if float(np.mean(v*v))<.85**2*signal or float(np.mean(u*v))<.75*signal: flagged+=1
    return 'flagged' if flagged else ('clear_proxy' if checked else 'indeterminate')


def evaluate(source):
    candidate,sigma,h=propose(source)
    result,report=integrate(source,candidate)
    return candidate,result,report,shadow_texture(source,candidate,sigma),sigma,h

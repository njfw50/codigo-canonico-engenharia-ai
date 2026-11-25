"""Development-only restoration search for known Gaussian blur; guards unchanged."""
import numpy as np
from PIL import Image
from scipy.fft import dctn, idctn
from scipy.ndimage import gaussian_filter
from spectral_texture import propose
from texture_guard import protect
from optical_guard import assess


def gate(source, candidate):
    result, report = protect(source, candidate)
    if result is None:
        return None, report['status']
    optical = assess(source.tobytes(), result.tobytes(), *source.size, *result.size)
    return (result if optical['status'] == 'review_required' else None), optical['status']


def rescue(source, blur_sigma):
    # Preserve the exact already accepted output; never substitute original pixels.
    first = propose(source, blur_sigma)
    result, status = gate(source, first)
    attempts = [{'factor': 1.5, 'status': status}]
    if result is not None:
        return result, attempts
    # A smaller noise penalty preserves more measured frequency coefficients.
    # This may retain noise, so a gate pass is not a quality certification.
    x = np.asarray(source, dtype=float) / 255
    a = x[:x.shape[0]//2*2, :x.shape[1]//2*2]
    p,q,r,s = a[::2,::2],a[1::2,::2],a[::2,1::2],a[1::2,1::2]
    hh = (p-q-r+s)/2
    good = (np.minimum.reduce([p,q,r,s]) > .02) & (np.maximum.reduce([p,q,r,s]) < .98)
    v = hh[good] if good.sum() >= 64 else hh.ravel()
    sigma = max(float(np.median(np.abs(v-np.median(v)))/.67449), 1/255)
    w = np.array([.2126,.7152,.0722]); y = x @ w; h,k = y.shape
    f = dctn(y, norm='ortho'); power = gaussian_filter(f*f,4)
    nv = sigma**2*(w@w)
    H = np.exp(-.5*blur_sigma**2*((np.pi*np.arange(h)/h)[:,None]**2+(np.pi*np.arange(k)/k)[None,:]**2))
    chrom = gaussian_filter(x-y[...,None],(1.,1.,0))
    # Fixed strongest-to-weakest penalty order; no clean reference in selection.
    for factor in (1.25,1.,.75,.5,.25):
        gain = np.minimum(1.5,np.maximum(1-factor*nv/np.maximum(power,1e-12),0)/np.maximum(H,1e-8)); gain[0,0]=1
        z = idctn(f*gain,norm='ortho')
        candidate = Image.fromarray(np.rint(np.clip(z[...,None]+chrom,0,1)*255).astype('uint8'))
        result,status = gate(source,candidate)
        attempts.append({'factor':factor,'status':status})
        if result is not None:
            return result, attempts
    return None, attempts

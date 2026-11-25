"""Research restoration for a known Gaussian blur and independent RGB noise."""
import numpy as np
from PIL import Image
from scipy.fft import dctn, idctn
from scipy.ndimage import gaussian_filter


def propose(source, blur_sigma):
    # An explicit blur model is required; never infer a known optical PSF from a photo.
    if source.mode != 'RGB' or min(source.size) < 8 or not np.isfinite(blur_sigma) or not 0 < blur_sigma <= 2:
        raise ValueError('RGB image and known blur sigma required')
    x = np.asarray(source, dtype=float) / 255
    a = x[:x.shape[0]//2*2, :x.shape[1]//2*2]
    p, q, r, s = a[::2,::2], a[1::2,::2], a[::2,1::2], a[1::2,1::2]
    hh = (p-q-r+s)/2
    good = (np.minimum.reduce([p,q,r,s]) > .02) & (np.maximum.reduce([p,q,r,s]) < .98)
    v = hh[good] if good.sum() >= 64 else hh.ravel()
    sigma = max(float(np.median(np.abs(v-np.median(v)))/.67449), 1/255)
    # Estimate observed spectral power, then suppress noise-dominated coefficients.
    w = np.array([.2126,.7152,.0722]); y = x @ w; h,k = y.shape
    f = dctn(y, norm='ortho'); power = gaussian_filter(f*f, 4)
    nv = sigma**2 * (w@w)
    H = np.exp(-.5*blur_sigma**2*((np.pi*np.arange(h)/h)[:,None]**2+(np.pi*np.arange(k)/k)[None,:]**2))
    # Bounded inverse filter enhances supported frequencies; no invented texture.
    gain = np.minimum(2, np.maximum(1-1.5*nv/np.maximum(power,1e-12),0)/np.maximum(H,1e-8)); gain[0,0] = 1
    z = idctn(f*gain, norm='ortho')
    # Chroma is smoothed separately, a research assumption not safe for all subjects.
    chrom = gaussian_filter(x-y[...,None], (1.0,1.0,0))
    return Image.fromarray(np.rint(np.clip(z[...,None]+chrom,0,1)*255).astype('uint8'))

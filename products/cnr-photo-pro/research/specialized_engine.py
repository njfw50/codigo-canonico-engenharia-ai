"""Specialized research adapter, not production or generative certification."""
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
from skimage.restoration import denoise_nl_means
import cv2
cv2.setNumThreads(1)
from integrated_engine import integrate

def propose(source, method='nlm'):
    # Wavelet MAD separates noise estimation from ordinary residual energy.
    if source.mode != 'RGB': raise ValueError('RGB input required')
    x = np.asarray(source, dtype=float) / 255
    x_even = x[:x.shape[0]//2*2,:x.shape[1]//2*2]
    hh = (x_even[:-1:2,:-1:2] - x_even[1::2,:-1:2] - x_even[:-1:2,1::2] + x_even[1::2,1::2]) / 2
    sigma = float(np.median(np.abs(hh - np.median(hh))) / .67449)
    if not np.isfinite(sigma): raise ValueError('noise estimate unavailable')
    sigma = max(sigma, 1/255)
    # Preserve structure with patch similarity or wavelet shrinkage.
    if method == 'nlm':
        y = denoise_nl_means(x, h=.8*sigma, sigma=sigma, patch_size=5, patch_distance=3, fast_mode=True, channel_axis=-1)
    elif method == 'opencv':
        bgr = cv2.cvtColor(np.asarray(source), cv2.COLOR_RGB2BGR)
        y = cv2.cvtColor(cv2.fastNlMeansDenoisingColored(bgr, None, .8*sigma*255, .8*sigma*255, 5, 11), cv2.COLOR_BGR2RGB)/255
    else: raise ValueError('unknown research method')
    # Noise-dependent threshold limits sharpening of weak residuals.
    lum = y @ np.array([.2126,.7152,.0722])
    detail = lum - gaussian_filter(lum, 1.2)
    accent = np.clip(1.2*np.sign(detail)*np.maximum(np.abs(detail)-.25*sigma,0),-.08,.08)
    return Image.fromarray(np.rint(np.clip(y+accent[...,None],0,1)*255).astype('uint8')), sigma

def enhance(source, method='nlm'):
    # Existing guards remain mandatory; no source fallback or weakened thresholds.
    candidate, sigma = propose(source, method)
    result, report = integrate(source, candidate)
    return result, dict(report, estimated_sigma=sigma)

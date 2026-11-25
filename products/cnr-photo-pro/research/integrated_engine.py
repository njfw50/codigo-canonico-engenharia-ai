"""CNR research integration: a conventional engine, not the generative skill."""
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, uniform_filter
from texture_guard import protect
from optical_guard import assess


def propose(source):
    # Local variance preserves structure better than a fixed denoise strength.
    # This is a new explicit proxy, not an exact reproduction of V-002.
    x = np.asarray(source, dtype=float) / 255
    residual = x - gaussian_filter(x, (.7, .7, 0))
    noise = np.median(np.abs(residual - np.median(residual))) / .67449
    mean = uniform_filter(x, size=(3, 3, 1))
    var = np.maximum(uniform_filter(x*x, size=(3, 3, 1)) - mean*mean, 0)
    weight = np.clip(1 - noise*noise / np.maximum(var, 1e-10), .35, 1)
    denoised = mean + weight * (x - mean)
    # Bounded luminance detail, no synthesized depth or content.
    y = denoised @ np.array([.2126, .7152, .0722])
    accent = np.clip(.35 * (y - gaussian_filter(y, .9)), -.04, .04)
    return Image.fromarray(np.rint(np.clip(denoised + accent[..., None], 0, 1)*255).astype('uint8'))


def integrate(source, proposed):
    # Application boundary: guards are mandatory and no source can be returned.
    result, texture = protect(source, proposed)
    if result is None:
        return None, {'status': 'rejected_texture', 'texture': texture, 'optical': None}
    optical = assess(source.tobytes(), result.tobytes(), *source.size, *result.size)
    report = {'status': optical['status'], 'texture': texture, 'optical': optical}
    if optical['status'] != 'review_required':
        return None, report
    return result, report


def enhance(source):
    if source.mode != 'RGB':
        return None, {'status': 'rejected_mode', 'texture': None, 'optical': None}
    return integrate(source, propose(source))

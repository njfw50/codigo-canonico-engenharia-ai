import numpy as np
from scipy.ndimage import gaussian_filter
from skimage.restoration import denoise_nl_means
from PIL import Image

def proposals(source):
    x=np.asarray(source,dtype=float)/255
    hh=(x[1:,1:]-x[1:,:-1]-x[:-1,1:]+x[:-1,:-1])/2
    sigma=np.clip(np.median(np.abs(hh-np.median(hh)))/.67449,.001,.15)
    den=denoise_nl_means(x,h=.8*sigma,sigma=sigma,fast_mode=True,patch_size=5,patch_distance=5,channel_axis=-1)
    u=den.copy()
    for _ in range(4):
        residual=den-gaussian_filter(u,(1.,1.,0))
        u=np.clip(u+.8*gaussian_filter(residual,(1.,1.,0)),0,1)
    for weight in (1.,.75,.5,.25):
        mixed=weight*u+(1-weight)*x
        y=mixed @ np.array([.2126,.7152,.0722]); accent=np.clip(.8*(y-gaussian_filter(y,1.1)),-.06,.06)
        yield f'iterative_{weight}',Image.fromarray(np.rint(np.clip(mixed+accent[...,None],0,1)*255).astype('uint8'))

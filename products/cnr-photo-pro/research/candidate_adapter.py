import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
from skimage.restoration import denoise_nl_means

def propose(source):
    x=np.asarray(source,dtype=float)/255
    hh=(x[1:,1:]-x[1:,:-1]-x[:-1,1:]+x[:-1,:-1])/2; sigma=float(np.median(np.abs(hh-np.median(hh)))/.67449); sigma=max(.001,min(.15,sigma))
    den=denoise_nl_means(x,h=.8*sigma,sigma=sigma,fast_mode=True,patch_size=5,patch_distance=5,channel_axis=-1)
    y=den @ np.array([.2126,.7152,.0722]); detail=y-gaussian_filter(y,1.1)
    accent=np.clip(1.1*detail,-.06,.06)
    return Image.fromarray(np.rint(np.clip(den+accent[...,None],0,1)*255).astype('uint8'))

# Historical conventional proposal, used only if first candidate is rejected by a guard.
# No reference metrics or original-image fallback in the application.
def conservative(source):
    from scipy.ndimage import uniform_filter
    x=np.asarray(source,dtype=float)/255
    residual=x-gaussian_filter(x,(.7,.7,0))
    noise=np.median(np.abs(residual-np.median(residual)))/.67449
    mean=uniform_filter(x,size=(3,3,1)); var=np.maximum(uniform_filter(x*x,size=(3,3,1))-mean*mean,0)
    weight=np.clip(1-noise*noise/np.maximum(var,1e-10),.35,1)
    den=mean+weight*(x-mean)
    y=den @ np.array([.2126,.7152,.0722]); accent=np.clip(.35*(y-gaussian_filter(y,.9)),-.04,.04)
    return Image.fromarray(np.rint(np.clip(den+accent[...,None],0,1)*255).astype('uint8'))

"""Infrastructure adapters and composition; no reference images or UI."""
from PIL import Image
from advanced_adapter import proposals
from candidate_adapter import conservative
from texture_guard import protect
from optical_guard import assess
from release_domain import RGBFrame
from release_application import restore

def _image(frame):
    return Image.frombytes('RGB', (frame.width, frame.height), frame.pixels)

def _frame(image):
    if image.mode != 'RGB':
        raise ValueError('RGB required')
    return RGBFrame(*image.size, image.tobytes())

def _proposals(source):
    image = _image(source)
    for name, candidate in proposals(image):
        yield name, _frame(candidate)
    yield 'historical_processed', _frame(conservative(image))

def _texture(source, candidate):
    checked, _ = protect(_image(source), _image(candidate))
    return None if checked is None else _frame(checked)

def _optical(source, candidate):
    return assess(source.pixels, candidate.pixels, source.width, source.height,
                  candidate.width, candidate.height)['status']

def enhance(source):
    if source.mode != 'RGB' or min(source.size) < 2:
        return None, 'invalid_input'
    out, method = restore(_frame(source), _proposals, _texture, _optical)
    return (None if out is None else _image(out)), method

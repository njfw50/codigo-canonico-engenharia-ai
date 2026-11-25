"""Research orchestration only: no UI, no original-image fallback."""
from advanced_adapter import proposals
from candidate_adapter import conservative
from texture_guard import protect
from optical_guard import assess
from itertools import chain

def fallback(source):
    yield 'historical_processed', conservative(source)

def enhance(source):
    if source.mode != 'RGB' or min(source.size)<2:
        return None,'invalid_input'
    original=source.tobytes()
    for name,proposal in chain(proposals(source),fallback(source)):
        out, texture = protect(source,proposal)
        if out is None: continue
        optical=assess(original,out.tobytes(),*source.size,*out.size)
        if optical['status']=='review_required' and source.tobytes()==original:
            return out,name
    return None,'rejected'

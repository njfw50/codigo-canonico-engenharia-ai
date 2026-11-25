"""Use case depending only on domain and injected processing/guard contracts."""
from release_domain import RGBFrame
from typing import Callable, Iterable

ProposalPort = Callable[[RGBFrame], Iterable[tuple[str, RGBFrame]]]
TexturePort = Callable[[RGBFrame, RGBFrame], RGBFrame | None]
OpticalPort = Callable[[RGBFrame, RGBFrame], str]

def restore(source: RGBFrame, proposals: ProposalPort, texture: TexturePort, optical: OpticalPort):
    if not isinstance(source, RGBFrame) or not source.valid():
        return None, 'invalid_input'
    try:
        for name, candidate in proposals(source):
            if not source.distinct_candidate(candidate):
                continue
            checked = texture(source, candidate)
            if not source.distinct_candidate(checked):
                continue
            if optical(source, checked) == 'review_required':
                return checked, name
    except Exception:
        return None, 'processing_error'
    return None, 'rejected'

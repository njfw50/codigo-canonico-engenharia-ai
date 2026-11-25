"""Immutable RGB8 contract and pure output eligibility policy."""
from dataclasses import dataclass

@dataclass(frozen=True)
class RGBFrame:
    width: int
    height: int
    pixels: bytes

    def valid(self):
        return (type(self.width) is int and type(self.height) is int
                and self.width >= 2 and self.height >= 2
                and type(self.pixels) is bytes
                and len(self.pixels) == self.width * self.height * 3)

    def distinct_candidate(self, other):
        return (isinstance(other, RGBFrame) and other.valid()
                and (self.width, self.height) == (other.width, other.height)
                and self.pixels != other.pixels)

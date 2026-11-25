"""CNR OpticalGuard research gate: candidate-only, no semantic certification."""


def assess(source, candidate, width, height, candidate_width, candidate_height,
           tile=32, global_limit=0.01, local_limit=0.05):
    """Compare packed RGB8 bytes. Return a decision; never produce image pixels."""
    # Cognitive intent: do not permit a geometry/mode mismatch or silent source fallback.
    if (not all(type(v) is int and v > 0 for v in
                (width, height, candidate_width, candidate_height, tile))
            or not isinstance(source, bytes) or not isinstance(candidate, bytes)
            or not 0 <= global_limit <= 1 or not 0 <= local_limit <= 1
            or len(source) != width * height * 3
            or len(candidate) != candidate_width * candidate_height * 3):
        return {'status': 'rejected_invalid_input'}
    if (width, height) != (candidate_width, candidate_height):
        return {'status': 'rejected_geometry'}
    if source == candidate:
        return {'status': 'rejected_unchanged_source'}

    # Count newly clipped channels, not net clipping: recovery elsewhere cannot hide loss.
    # Tile accounting detects concentrated damage that a global average can conceal.
    totals = [0, 0]
    worst = [0.0, 0.0]
    for y0 in range(0, height, tile):
        for x0 in range(0, width, tile):
            y1, x1 = min(y0 + tile, height), min(x0 + tile, width)
            local = [0, 0]
            for y in range(y0, y1):
                for i in range((y * width + x0) * 3, (y * width + x1) * 3):
                    local[0] += candidate[i] == 0 and source[i] != 0
                    local[1] += candidate[i] == 255 and source[i] != 255
            n = (y1 - y0) * (x1 - x0) * 3
            for j in (0, 1):
                totals[j] += local[j]
                worst[j] = max(worst[j], local[j] / n)
    n = width * height * 3
    rates = [v / n for v in totals]
    # Conservative research thresholds, not calibrated product acceptance criteria.
    blocked = sum(rates) > global_limit or max(worst) > local_limit
    # Geometry/identity, lighting and natural texture cannot be certified from clipping.
    return {'status': 'rejected_new_clipping' if blocked else 'review_required',
            'new_shadow_fraction': rates[0], 'new_highlight_fraction': rates[1],
            'worst_tile_shadow_fraction': worst[0],
            'worst_tile_highlight_fraction': worst[1],
            'semantic_validation': 'not_evaluated'}

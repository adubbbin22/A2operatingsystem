# creatives/

The ad pipeline's working directory (Phase 1).

- `briefs/` — one Markdown brief per ad concept (input). Product, angle, audience, format, copy.
- `generated/<app>/<YYYY-MM-DD>/` — raw nano-banana output. Large images are gitignored by
  default (see `.gitignore`); the record of what shipped lives in `uploaded/`.
- `uploaded/` — what actually went to Meta, one file per app. Each record: date, campaign/
  ad-set/ad IDs, source image path, copy, placements. This is how the weekly review ties
  spend back to a specific creative.

Flow: write a brief → run the `new-ad` skill → generate + edit → upload PAUSED to Meta → log here.

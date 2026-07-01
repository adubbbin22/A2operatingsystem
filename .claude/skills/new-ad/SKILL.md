---
name: new-ad
description: >
  Create a new Meta/Instagram ad end to end — generate concept images with nano-banana,
  iterate edits, then upload to Meta as a PAUSED ad and log what shipped. Use when the
  user wants to make, design, generate, or ship a new ad or ad creative.
---

# new-ad — nano-banana → Meta pipeline

The priority workflow. Turns a creative brief into a review-ready (PAUSED) Meta ad with
in-house generated imagery, and records it so the weekly review can attribute spend.

## Inputs
- Target app (must exist under `apps/<app>/` — read `app.md` for the Meta ad account ID).
- A brief: product, angle/hook, audience, format(s), and draft copy. If a file exists in
  `creatives/briefs/`, use it; otherwise gather these in chat and save one there first.

## Steps
1. **Confirm the brief.** Read/write `creatives/briefs/<app>-<slug>.md`. Restate the angle,
   audience, placements, and copy back to the user before generating.
2. **Generate concepts (nano-banana).** Produce N variations at Meta's key aspect ratios —
   `1:1` (feed), `4:5` (feed tall), `9:16` (Stories/Reels). Save to
   `creatives/generated/<app>/<YYYY-MM-DD>/`. Show them to the user.
3. **Iterate (nano-banana edit).** On feedback, edit in place — swap background, restyle,
   add/adjust on-image text, resize to another ratio — until the user approves specific assets.
4. **Build the creative (meta-ads).** For the approved image(s): upload the image, then create
   the ad creative with headline, primary text, description, CTA, and destination (App Store /
   Play link or site). Confirm the ad set / campaign to place it in — create a new campaign +
   ad set only if the user asks.
5. **Create the ad PAUSED.** Never activate. Confirm status = PAUSED back to the user.
6. **Log it.** Append a record to `creatives/uploaded/<app>.md` (or a dated file) with:
   date, app, campaign/ad-set/ad IDs, the source image path(s), copy used, and placements.

## Guardrails
- Ads are created **PAUSED**. Activation happens only on a separate, explicit "turn it on."
- No budget is set/changed without reading the number back first.
- Keep secrets out of everything written to the repo.

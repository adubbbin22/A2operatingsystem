# Uploaded ads — Momentum (EXAMPLE)

> Shows the log format the `new-ad` skill writes after uploading to Meta. One row per ad.
> The IDs below are placeholders — a real run fills them from the Meta MCP response.
> (Momentum is a fictional stand-in; delete this example whenever.)

| Date | Ad name | Campaign ID | Ad set ID | Ad ID | Status | Source image | Placement | Headline / CTA |
|---|---|---|---|---|---|---|---|---|
| 2026-07-01 | Momentum — streak 1:1 | `120xxxxxxxxxx` | `120xxxxxxxxxx` | `120xxxxxxxxxx` | PAUSED | `creatives/generated/momentum/2026-07-01/streak-1x1.png` | Feed 1:1 | Don't break the streak / Install now |
| 2026-07-01 | Momentum — streak 9:16 | `120xxxxxxxxxx` | `120xxxxxxxxxx` | `120xxxxxxxxxx` | PAUSED | `creatives/generated/momentum/2026-07-01/streak-9x16.png` | Stories 9:16 | Don't break the streak / Install now |

Notes:
- Both created **PAUSED** — activation is a separate, explicit step.
- Ad IDs here are what the weekly-review skill joins against Meta insights to attribute spend to a creative.

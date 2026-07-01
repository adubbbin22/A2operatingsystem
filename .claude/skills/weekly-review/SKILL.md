---
name: weekly-review
description: >
  Produce the unified weekly marketing performance report across Meta, Apple Search Ads,
  Google Ads, and RevenueCat. Use when the user asks for a performance review, weekly
  numbers, marketing report, or how ads/revenue are doing.
---

# weekly-review — one report across every channel

## Inputs
- Date range (default: the last complete Mon–Sun week).
- Which apps (default: all under `apps/`).

## Steps
1. **Pull spend + delivery** for the range:
   - `meta-ads` insights (spend, impressions, clicks, installs, results) per ad account.
   - `apple-ads` Apple Search Ads performance (spend, installs, TTR, CPA).
   - `google-ads` GAQL reporting (spend, conversions) — read-only.
2. **Pull revenue** from `revenuecat` (installs→trials→paid, revenue, active subs) per app.
3. **Normalize** into one table per app × channel:
   **spend · installs · CPI · trials · paid · CPA · ROAS**.
   - CPI = spend ÷ installs. CPA = spend ÷ paid conversions.
   - ROAS = RevenueCat revenue ÷ spend (RevenueCat revenue, not store proceeds).
4. **Add week-over-week deltas** vs the prior report in `dashboards/`.
5. **Attribute creatives:** cross-reference `creatives/uploaded/` so "best/worst creative"
   names a real asset.
6. **Write** `dashboards/YYYY-Www.md`: the table, deltas, and 3–5 flagged callouts
   (rising CPA, winning creative, budget to shift). Note any numbers from unverified MCPs.

## Guardrails
- Reporting only. Any suggested budget/bid move is a recommendation — do not execute
  without an explicit, read-back confirmation.

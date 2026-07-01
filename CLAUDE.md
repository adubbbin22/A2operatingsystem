# A2 Operating System — operating manual

This repo is a personal operating system for running an app portfolio through Claude Code.
You (the agent) drive external systems through **MCP servers only** — there is no custom API
code to write. Markdown files in this repo are the durable memory.

Read `PLAN.md` for the full architecture and phases. This file is your standing instructions.

## What lives where
- `apps/<app>/app.md` — registry: App Store ID, bundle ID, Play package, RevenueCat project, Meta ad account ID.
- `apps/<app>/roadmap.md` — Now / Next / Later.
- `apps/<app>/changelog.md` — user-facing release history.
- `creatives/briefs/` — ad briefs (input). `creatives/generated/` — nano-banana output. `creatives/uploaded/` — what shipped, with IDs.
- `dashboards/` — generated performance reports.
- `.claude/skills/` — the repeatable workflows.

## MCP tools you have (see `.mcp.json`)
- **nano-banana** — generate/edit ad images (Gemini image model).
- **meta-ads** — Meta/Instagram campaigns, ad sets, ads, creative upload, insights.
- **apple-ads** — Apple Search Ads performance + keyword/bid management.
- **app-store-connect** — iOS app metadata, versions, TestFlight.
- **google-ads** — Google Ads reporting (read-only).
- **play-console** — Google Play releases, rollouts, Android vitals.
- **revenuecat** — MRR, subscriptions, trials, churn, LTV.
- **github** — this repo, issues, releases.

## Rules of engagement (always)
1. **Never activate ad spend or publish a release without explicit confirmation.** Meta ads are
   created PAUSED — leave them paused until told otherwise. Same for Play releases and ASC metadata.
2. **Read back any budget/bid change** (before → after) and wait for a yes before executing.
3. **Log everything shipped.** New ad → write a record in `creatives/uploaded/`. New release seen →
   append to the app's `changelog.md`.
4. **Never print secrets.** Keys live in `.env`; reference env vars only.
5. **Prefer a skill.** If a request matches `new-ad`, `weekly-review`, or `ship-log`, run that skill.
6. When numbers come from a new/unverified MCP, say so and suggest cross-checking the native dashboard.

## Metric definitions (keep reports consistent)
- **CPI** = ad spend ÷ installs. **CPA** = ad spend ÷ paid conversions (trial→paid or direct purchase).
- **ROAS** = RevenueCat revenue ÷ ad spend (use RevenueCat revenue, not store-reported proceeds).
- Report per **app × channel**, with week-over-week deltas.

# A2 Operating System — Build Plan

> A single place to run the app portfolio: review marketing performance, generate
> and ship ads, watch revenue, and keep roadmaps + changelogs honest.

## The core idea

This repo **is** the operating system. There is no separate app to build and host.
Claude Code is the runtime, MCP servers are the integrations, and Markdown files are
the memory (roadmaps, changelogs, generated reports, creative briefs).

You decided:
- **MCP-driven, not API-driven** — every external system is reached through an MCP
  server, so you never write or maintain API glue code. You talk to Claude Code; it
  calls the tools.
- **Ad-creation pipeline first** — Phase 1 is the nano-banana → Meta pipeline.

```
                 ┌─────────────────────────────────────────┐
   You  ───────► │            Claude Code (agent)           │
                 │   + skills in .claude/skills/*           │
                 └───────────────────┬─────────────────────┘
                                     │  MCP
   ┌──────────────┬──────────────┬───┴──────┬──────────────┬───────────────┐
   ▼              ▼              ▼          ▼              ▼               ▼
 Nano Banana   Meta Ads     Apple Ads /   Google Ads /   RevenueCat    GitHub
 (Gemini img)  (create/     App Store     Play Console   (revenue,     (this repo,
  generate +    upload ads,  Connect       (metrics,      subs, LTV)    versions)
  edit)         metrics)     (ASA metrics, releases)
                             app metadata,
                             versions)
                                     │
                                     ▼
                        Markdown memory in this repo
             apps/*/roadmap.md · apps/*/changelog.md · dashboards/*.md · creatives/*
```

---

## The MCP stack (all verified to exist)

| Capability | MCP server | Read | Write | Notes |
|---|---|---|---|---|
| Ad image gen + edit | `nano-banana` (Gemini 2.5/3 Flash Image) | — | gen/edit | Needs a Gemini API key. Community servers: `zhongweili/nanobanana-mcp-server`, `nano-banana-pro-mcp`. |
| Meta / Instagram Ads | `pipeboard-co/meta-ads-mcp` | ✅ insights | ✅ campaigns, ad sets, ads, **creative upload** | 30+ tools. Creates campaigns **PAUSED** by default — nothing goes live without you. Hosted at `meta-ads.mcp.pipeboard.co` or self-host via PyPI. |
| Apple Search Ads | `ppcprophet/apple-ads-mcp` | ✅ | ✅ bids/keywords | Campaign perf, CPA, TTR, keyword mgmt. |
| App Store Connect | `JoshuaRileyDev/app-store-connect-mcp-server` | ✅ metadata, versions, TestFlight | ✅ metadata | Source of truth for iOS **version history**. |
| Google Ads | Official Google Ads API MCP (open source, Oct 2025) | ✅ GAQL reporting | read-only today | Reporting/diagnostics. Community `gomarble-ai` alt exists. |
| Google Play Console | `devexpert-io/play-store-mcp` | ✅ rollouts, vitals | ✅ releases | Source of truth for Android **version history** + crash rates. |
| Revenue / subscriptions | RevenueCat official `mcp.revenuecat.ai/mcp` | ✅ 26 tools | ✅ products/entitlements | Bearer auth with a v2 secret key. |
| Repo / issues / releases | `github` MCP (already connected) | ✅ | ✅ | Roadmap issues, release notes, this repo. |

> Reality check: some servers are community-maintained. Treat any **write** action
> (spend changes, publishing ads, promoting releases) as human-in-the-loop — see
> "Safety rails" below. Start each integration in read-only mode, confirm the numbers
> match the native dashboards, then enable writes.

---

## Repo layout

```
A2operatingsystem/
├── README.md              # what this is + daily driver commands
├── PLAN.md                # this file
├── CLAUDE.md              # operating manual the agent reads on every session
├── .mcp.json              # MCP server wiring (checked in; secrets stay in .env)
├── .env.example           # every key/token needed, with where to get it
├── .gitignore
├── apps/
│   ├── _template/         # copy this per app
│   │   ├── app.md         #   portfolio registry entry (IDs, links, positioning)
│   │   ├── roadmap.md     #   now / next / later
│   │   └── changelog.md   #   human-readable release history
│   └── <your-apps>/
├── creatives/
│   ├── briefs/            # one .md per ad brief (input to the pipeline)
│   ├── generated/         # nano-banana output, by app + date
│   └── uploaded/          # what actually went to Meta, with campaign/ad IDs
├── dashboards/            # generated performance reports (weekly/monthly)
└── .claude/skills/
    ├── new-ad/            # nano-banana → Meta pipeline  (PHASE 1)
    ├── weekly-review/     # unified performance report    (PHASE 2)
    └── ship-log/          # pull versions → update changelogs (PHASE 4)
```

---

## Phased build

### Phase 0 — Foundation (½ day)
Wire the plumbing so every later phase just works.
- [ ] Fill in `.env` from `.env.example` (Gemini key, Pipeboard/Meta token, RevenueCat v2 key, ASA + ASC keys, Google Ads + Play creds).
- [ ] Confirm `.mcp.json` servers all connect (`/mcp` in Claude Code lists them green).
- [ ] Create one `apps/<app>/` folder per live app from `_template/`. Fill `app.md` with the App Store ID, bundle ID, Play package name, RevenueCat project ID, Meta ad account ID.
- [ ] Read `CLAUDE.md` — that's the standing instructions for the agent.

**Done when:** `/mcp` shows every server connected and `apps/` mirrors your live portfolio.

### Phase 1 — Ad creation pipeline  ⭐ PRIORITY  (1–2 days)
The hero workflow: idea → images → live-but-paused Meta ad.
- [ ] Write a creative brief in `creatives/briefs/` (product, angle, audience, format, copy).
- [ ] `new-ad` skill: nano-banana generates N concept images at the right aspect ratios (1:1, 4:5, 9:16 for Meta placements) into `creatives/generated/<app>/<date>/`.
- [ ] You pick the winners in chat; the agent iterates edits via nano-banana (swap background, add text, resize) until approved.
- [ ] Meta Ads MCP uploads the approved image(s), builds the creative (headline, primary text, CTA, destination), and creates the ad **PAUSED** inside the chosen ad set.
- [ ] Record what shipped in `creatives/uploaded/` with the returned campaign/ad set/ad IDs so the weekly review can tie spend back to a creative.

**Done when:** one command takes a brief to a paused, review-ready Meta ad with images generated in-house, and the record is written back to the repo.

### Phase 2 — Marketing performance dashboard  (1 day)
One report across every channel.
- [ ] `weekly-review` skill pulls a fixed date range from Meta, Apple Search Ads, and Google Ads insights, plus installs/revenue from RevenueCat.
- [ ] Normalize to a common table: **spend, installs, CPI, trials, paid conversions, CPA, ROAS/blended ROAS** per app per channel.
- [ ] Write `dashboards/YYYY-Www.md` with the table, week-over-week deltas, and 3–5 flagged callouts (rising CPA, winning creative, budget to shift).
- [ ] Cross-reference `creatives/uploaded/` so "best creative this week" names an actual asset.

**Done when:** one command produces a dated Markdown report you'd actually read on Monday.

### Phase 3 — Revenue / monetization deep-dive  (½ day)
- [ ] RevenueCat MCP: MRR, active subs, trial-start → conversion, churn, refunds, LTV by cohort/app.
- [ ] Roll the top-line numbers into the weekly review; keep the deep cuts in `dashboards/revenue/`.
- [ ] Tie ROAS in Phase 2 to real RevenueCat revenue, not just store-reported proceeds.

**Done when:** the weekly review's ROAS uses RevenueCat revenue and you can ask "LTV of app X's July cohort" and get an answer.

### Phase 4 — Roadmap, changelogs, version history  (½ day, ongoing)
- [ ] Per app: maintain `roadmap.md` (Now / Next / Later) and `changelog.md` (human-readable, user-facing).
- [ ] `ship-log` skill: pull released versions from App Store Connect (iOS) and Play Console (Android) MCPs, append any new ones to `changelog.md` with date, version, and build number.
- [ ] Optionally mirror roadmap items to GitHub issues via the `github` MCP so there's one backlog.

**Done when:** `changelog.md` auto-reconciles against the stores and roadmaps live in one place.

---

## Safety rails (non-negotiable for the write-capable MCPs)

1. **Paused by default.** Meta creates ads paused; never auto-activate. Google Play
   releases and ASC metadata changes require explicit "yes, publish" in chat.
2. **Confirm before spend.** Any budget/bid change is read back to you with the before/after
   number before it executes.
3. **Read-only first.** Point each new MCP at reporting only; verify totals match the native
   dashboard for one week before enabling any write scope.
4. **Secrets never committed.** Everything lives in `.env` (gitignored). `.mcp.json` references
   `${ENV_VARS}` only.
5. **Everything shipped is logged.** Ads → `creatives/uploaded/`, releases → `changelog.md`.
   The repo is the audit trail.

---

## First three moves
1. Run Phase 0: fill `.env`, get `/mcp` all-green, create your `apps/` folders.
2. Run Phase 1 end-to-end on one real ad for one app.
3. Once an ad has spend, run Phase 2's `weekly-review` and tune from there.

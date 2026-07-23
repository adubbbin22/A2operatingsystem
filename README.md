# A2 Operating System

One place to run the whole app portfolio through Claude Code: **generate + ship ads**,
**review marketing performance**, **watch RevenueCat revenue**, and keep **roadmaps +
changelogs** honest — all driven through MCP servers, no API glue to maintain.

- **How it's built and why:** see [`PLAN.md`](./PLAN.md).
- **How the agent should behave:** see [`CLAUDE.md`](./CLAUDE.md) (read automatically each session).

## Setup (Phase 0)
1. `cp .env.example .env` and fill in the keys.
2. Open this repo in Claude Code, run `/mcp`, confirm every server is connected.
3. Copy `apps/_template/` to `apps/<your-app>/` for each live app and fill in `app.md`.

## Daily driver
Talk to Claude Code in plain language, or invoke a skill:

| Skill | What it does |
|---|---|
| `new-ad` | Brief → nano-banana generates concepts → edit → upload to Meta as a **paused** ad → log it. |
| `weekly-review` | Pull Meta + Apple + Google + RevenueCat → one dated report in `dashboards/`. |
| `ship-log` | Reconcile released versions from App Store Connect + Play Console into each `changelog.md`. |
| `focus` | Pull Goals + Projects + Roadmap + Epics from Notion → ranked "do next" dashboard in `dashboards/focus/`. |

## Safety
Ads are created **paused**; releases and metadata publish only on explicit confirmation.
Budget/bid changes are read back before → after before executing. Secrets stay in `.env`.
See "Safety rails" in `PLAN.md`.

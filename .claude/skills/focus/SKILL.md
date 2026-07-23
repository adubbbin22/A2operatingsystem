---
name: focus
description: >
  Build the daily focus dashboard from Notion — pull Goals, Projects, Roadmap, and Epics
  from the App Command Center, rank the most important work, and write a dated dashboard.
  Use when the user asks what to work on, what's most important, for priorities, a to-do
  overview, or the focus dashboard.
---

# focus — what should I work on today?

One ranked answer to "what's the most important thing," pulled live from Notion.

## Notion sources (App Command Center)

Hub page: `337c5951-aa52-81c2-a1f1-fef4e17ca29d`. Query each data source **separately**
(single-source SQL only — multi-source queries and heavy use hit plan limits):

| Data source | Collection ID | Key columns |
|---|---|---|
| Projects | `collection://7ede16cc-f8ad-426a-b74d-239dde761cf5` | Name, Status, Priority, Platform, Monthly Revenue |
| Roadmap | `collection://0354593e-7f18-4bb2-8e86-634ba701e11a` | Name, Status, Priority, Type, Project, Epic, KPI |
| Goals | `collection://46d78009-cab3-4fc0-91d4-56aa1d66d20b` | Name, Target, Current, Status, Timeframe |
| Epics | `collection://65c3318e-a9ff-42e0-b87c-233930ffbeb6` | Name, Status, Priority, Projects |

## Steps

1. **Pull** all four sources (4 queries total, select only the key columns).
2. **Rank** open roadmap items (Status ≠ Done) into the "Do next" queue:
   1. P0 **bugs** blocking a release, in flight first.
   2. P0 items serving the **most at-risk goal's primary lever** (currently the
      Subscription & Monetization epic for the $100K/mo goal).
   3. Remaining P0s **In Progress** — finishing beats starting.
   4. P0 **ToDo/Backlog**, oldest `createdTime` first.
   5. P1s only when the P0 lane is empty. Never rank an unnamed item — flag it instead.
3. **Surface USER ACTION items** (anything whose name/body flags a step only the user can
   do, e.g. entitlement applications) as a separate "unblock" row — these start clocks.
4. **Contrast effort vs. money:** active items per project vs. Monthly Revenue per
   project. Call out revenue leaders with zero active items and $0 projects absorbing
   most of the effort.
5. **Count WIP.** If In Progress > ~10 items, say so plainly — too much WIP is the
   #1 reason prioritization feels impossible.
6. **Flag data hygiene:** unnamed rows, missing Status/Priority, goals whose
   Current/Target contradict their Status. Bad inputs make every future ranking worse.
7. **Write** `dashboards/focus/YYYY-MM-DD.md` with: Do-this-first, Goals table,
   ranked P0 queue (with Notion links), money-vs-effort table, WIP count, hygiene
   checklist. Optionally also render an HTML version alongside if the user wants a
   visual dashboard.

## Live dashboard (artifact)

A live, interactive version exists as a Claude artifact:
`https://claude.ai/code/artifact/2d9a1626-7a72-464e-af3e-637d849dc821`
- Source: `dashboards/focus/live-dashboard.html`. It queries Notion **in the viewer's
  browser** via the artifact `mcp` capability (connector "Notion", tool
  `notion-query-data-sources`) — same three queries, ranking computed client-side.
- To change it: edit the source file, then republish with the Artifact tool passing
  that `url` so the link stays stable, with capabilities
  `{"mcp": {"servers": [{"server": "Notion", "tools": ["notion-query-data-sources"]}]}}`.
- It caches results up to 5 min and refreshes on demand (no polling) to respect
  Notion free-plan query limits.

## Guardrails

- Read-only against Notion by default. Fixing hygiene items in Notion (naming rows,
  setting statuses) only on explicit request.
- Revenue figures on Projects are self-entered — when RevenueCat is connected,
  cross-check and note discrepancies rather than silently trusting either.
- Keep it to one screen. The dashboard's job is one clear #1, not a second backlog.

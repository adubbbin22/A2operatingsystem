# dashboards/

Generated performance reports (Phase 2+). The `weekly-review` skill writes dated files here.

- `YYYY-Www.md` — weekly report: spend / installs / CPI / CPA / ROAS per app × channel,
  week-over-week deltas, and flagged callouts.
- `focus/YYYY-MM-DD.md` — daily priority dashboard from Notion (the `focus` skill):
  ranked P0 queue, goals, effort-vs-revenue, WIP count, data-hygiene flags.
- `focus/live-dashboard.html` — source of the **live** dashboard artifact (reads Notion
  in the browser, ranks client-side; URL + redeploy notes in the focus skill).
- `revenue/` — deeper RevenueCat cuts (cohorts, churn, LTV) when you want them (Phase 3).

Reports are read-only outputs. Nothing here changes spend or publishes anything.

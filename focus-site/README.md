# A2 Everything Dashboard

One website for the whole operation: **goals, every app, and the ranked ticket queue** —
with GitHub commit verification, and metric slots ready for Firebase / BigQuery.

**Data model:** no external task tool. `data/portfolio.json` is the source of truth and
**Claude maintains it** — tell Claude in this repo to add/close/reprioritize tickets, update
goal numbers, or add an app; it edits the JSON and pushes. (Notion integration is paused;
its IDs are preserved in `.claude/skills/focus/SKILL.md` if you ever want it back.)

```
focus-site/
├── wrangler.toml            # Pages config (project "a2-focus", serves public/)
├── data/portfolio.json      # goals + apps + tickets — Claude-edited, git-versioned
├── public/index.html        # the dashboard (no secrets in it)
└── functions/api/
    ├── data.js              # GET /api/data    (serves portfolio.json, password-gated)
    ├── github.js            # GET /api/github?repo=owner/name&since=…
    └── _utils.js            # shared auth + json helpers
```

## Deploy (~5 min)

```sh
cd focus-site
npx wrangler login
npx wrangler pages project create a2-focus
npx wrangler pages deploy
npx wrangler pages secret put DASH_PASSWORD --project-name a2-focus   # pick a password
npx wrangler pages secret put GITHUB_TOKEN  --project-name a2-focus   # optional, see below
```

Open `https://a2-focus.pages.dev`, enter the password once.

- `GITHUB_TOKEN` (optional but recommended): a fine-grained PAT with **Contents: Read-only**
  + **Metadata: Read-only** on your repos. Powers the "Reality check" section and the
  ✓ shipped? badges. Without it that section shows an error and everything else still works.

**Recommended:** connect the Pages project to this GitHub repo (Cloudflare dashboard →
Pages → a2-focus → Settings → Builds; root directory `focus-site`, no build command,
output `public`). Then every push — including Claude's ticket updates — redeploys the
site automatically. Until then, redeploy manually with `npx wrangler pages deploy`.

## Updating the dashboard

Say it to Claude in this repo, in plain language:
- "close ss-healthkit-dates" / "mark the HealthKit bug done"
- "add a P0 ticket to AO3: …"
- "set R Radio revenue to $19K" / "update the goals"
- "link AO3 to repo adubbbin22/…"  ← repos make the reality check + shipped? badges work

Claude edits `data/portfolio.json`, commits, pushes → site updates.

## Next phase: Firebase / BigQuery metrics

Each app has a `metrics` field (currently `null`) rendered as tiles (Installs 7d, DAU,
Revenue 7d). The plan: connect a Firebase / BigQuery MCP in a Claude session, have Claude
pull per-app numbers and write them into `metrics` (e.g.
`{"installs": 1240, "dau": 8300, "revenue7d": "$2.1K", "asOf": "2026-07-23"}`), push, done —
the tiles light up. No dashboard changes needed for the first version; a `metrics-history/`
file can come later for sparklines.

## Security notes
- The page and its data sit behind the `DASH_PASSWORD` shared secret; tokens live only as
  Cloudflare secrets. For stronger auth put Cloudflare Access in front and delete the
  password check in `functions/api/_utils.js`.
- Everything is read-only; the site never writes to GitHub or anywhere else.

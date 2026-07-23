# A2 Focus — standalone website

The focus dashboard as a real website on Cloudflare Pages (same host as ao3wiki).
A static page + two tiny Pages Functions that read Notion and GitHub **server-side**,
so your tokens never reach the browser. The page is password-protected.

```
focus-site/
├── wrangler.toml            # Pages config (project "a2-focus", serves public/)
├── public/index.html        # the dashboard (no secrets in it)
└── functions/api/
    ├── notion.js            # POST /api/notion   {source: projects|roadmap|goals}
    ├── github.js            # GET  /api/github?repo=owner/name&since=YYYY-MM-DD
    └── _utils.js            # shared auth + json helpers
```

## One-time setup (~10 min)

### 1. Notion token
1. notion.so → Settings → Connections → *Develop or manage integrations* → **New internal integration**
   (workspace: "a2 apps's Notion"). Copy the secret (`ntn_…`).
2. Open the **App Command Center** page → `⋯` → *Connections* → add your integration.
   (That grants access to Projects, Roadmap, and Goals — all children of that page.)

### 2. GitHub token
GitHub → Settings → Developer settings → **Fine-grained personal access token**:
- Repository access: the repos linked on your Notion Projects rows (or all your repos).
- Permissions: **Contents: Read-only** and **Metadata: Read-only**. Nothing else.

### 3. Deploy
```sh
cd focus-site
npx wrangler login
npx wrangler pages project create a2-focus
npx wrangler pages deploy
npx wrangler pages secret put NOTION_TOKEN  --project-name a2-focus   # paste ntn_…
npx wrangler pages secret put GITHUB_TOKEN  --project-name a2-focus   # paste github_pat_…
npx wrangler pages secret put DASH_PASSWORD --project-name a2-focus   # pick a password
```

Open `https://a2-focus.pages.dev`, enter the password once (it's remembered per browser).

## Redeploying after changes
```sh
cd focus-site && npx wrangler pages deploy
```

## Troubleshooting
- **401 / password prompt loops** — wrong `DASH_PASSWORD`; re-enter it (the page forgets a
  rejected password) or reset the secret.
- **"Notion 404"** — the integration isn't connected to the App Command Center page (step 1.2).
- **"Notion 400 … data_sources"** — your workspace may still be on an older API surface;
  check that the integration was created recently and retry.
- **GitHub rows say "GitHub 404"** — the fine-grained token doesn't cover that repo.
- **A project is missing from the Reality check** — its Notion Projects row has no GitHub URL.
  Fill the `GitHub` property; the section picks it up on the next refresh.

## Security notes
- Tokens live only as Cloudflare secrets; the browser only ever sees dashboard JSON.
- The password gate is a shared secret — fine for personal use. If you want real auth,
  put Cloudflare Access in front of the Pages project and delete the password check
  in `functions/api/_utils.js`.
- Both endpoints are read-only; the site never writes to Notion or GitHub.

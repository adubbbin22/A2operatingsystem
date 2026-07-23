# Supabase RLS exposure — found 2026-07-23

Three Supabase projects have Row Level Security **disabled** on public tables: anyone with
the project's anon key (shipped inside the client apps/sites) can read **and write** every row.

**Do not run the SQL blindly** — enabling RLS without policies blocks the app's own access.
Per table: enable RLS, then add policies matching how the app reads/writes (or move access
to Edge Functions using the service role).

## 1. baby app (`ktbilgfkyumpoonnlfba`) — CRITICAL, real family data
Exposed: `babies`, `ledger` (393 feed/care events), `users`, `households`,
`household_members`, `invitations`, `roadmap_milestones`, `insight_vectors`.

```sql
ALTER TABLE public.babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
```

## 2. M&A (`snookhwbojzljadhwjpe`) — CRITICAL, all outreach email content
Exposed: `targets` (5,191), `email_threads` (1,641), `emails` (2,005),
`ai_recommendations`, `app_cache`, `target_contacts`.

```sql
ALTER TABLE public.targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_contacts ENABLE ROW LEVEL SECURITY;
```
Note: if the M&A Flask app talks to Postgres with the service role key (server-side only),
enabling RLS is safe immediately; verify which key it uses first.

## 3. Viral Tracker (`bkanzuiakbqtqtfrerjn`) — low data volume today, same hole
Exposed: `users`, `brands`, `niche_graphs`, `discovered_posts`, `generations`,
`schedules`, `performance`.

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niche_graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovered_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance ENABLE ROW LEVEL SECURITY;
```

Source: Supabase MCP security advisories, surfaced during the 2026-07-23 KPI pull.
Tracked as tickets `lullaby-supabase-rls`, `ma-supabase-rls`, `viral-supabase-rls`.

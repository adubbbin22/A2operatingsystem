---
name: ship-log
description: >
  Reconcile released app versions from App Store Connect (iOS) and Play Console (Android)
  into each app's changelog. Use when the user wants to update changelogs, log a release,
  or check version history.
---

# ship-log — sync store releases into changelogs

## Steps
1. For each app under `apps/`, read `app.md` for the bundle ID / Play package.
2. Pull released versions:
   - `app-store-connect` — iOS app versions + build numbers + release dates.
   - `play-console` — Android released versions + version codes + rollout status.
3. Compare against `apps/<app>/changelog.md`. For any release not already logged, append a
   row (date, version, build/code, platform, notes). Ask the user for user-facing notes if
   the store notes are thin.
4. Optionally mirror significant items into the `Shipped` section of `roadmap.md`.

## Guardrails
- This skill only **reads** store state and **writes to the repo**. It does not create,
  promote, or modify releases. Publishing/rollout changes require a separate explicit request.

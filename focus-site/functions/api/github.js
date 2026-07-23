import { auth, json } from "./_utils.js";

export async function onRequestGet({ request, env }) {
  const deny = auth(request, env);
  if (deny) return deny;
  if (!env.GITHUB_TOKEN) return json({ error: "GITHUB_TOKEN secret is not set on the Pages project" }, 500);

  const u = new URL(request.url);
  const repo = u.searchParams.get("repo") || "";
  const since = u.searchParams.get("since") || "";
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) return json({ error: "bad repo parameter" }, 400);

  const qs = new URLSearchParams({ per_page: "100" });
  if (since) qs.set("since", since);
  const gh = await fetch(`https://api.github.com/repos/${repo}/commits?${qs}`, {
    headers: {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      accept: "application/vnd.github+json",
      "user-agent": "a2-focus-dashboard",
    },
  });
  if (gh.status === 409) return json([]); // empty repository
  if (!gh.ok) return json({ error: `GitHub ${gh.status} for ${repo}` }, 502);

  const commits = await gh.json();
  return json(
    (Array.isArray(commits) ? commits : []).map((c) => ({
      sha: c.sha,
      html_url: c.html_url,
      commit: {
        message: (c.commit && c.commit.message) || "",
        author: { date: (c.commit && c.commit.author && c.commit.author.date) || null },
      },
    })),
  );
}

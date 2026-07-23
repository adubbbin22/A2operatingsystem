import { auth, json } from "./_utils.js";

// Data sources in the App Command Center (see .claude/skills/focus/SKILL.md)
const SOURCES = {
  projects: "7ede16cc-f8ad-426a-b74d-239dde761cf5",
  roadmap: "0354593e-7f18-4bb2-8e86-634ba701e11a",
  goals: "46d78009-cab3-4fc0-91d4-56aa1d66d20b",
};

const hex = (id) => (id || "").replace(/-/g, "");

// Normalize a Notion REST page into the flat row shape the front-end uses
// (property name -> plain value; relations as a JSON array of page URLs).
function flatten(page) {
  const row = {
    url: `https://app.notion.com/${hex(page.id)}`,
    createdTime: page.created_time,
  };
  for (const [name, prop] of Object.entries(page.properties || {})) {
    switch (prop.type) {
      case "title":
        row[name] = prop.title.map((t) => t.plain_text).join("") || null;
        break;
      case "rich_text":
        row[name] = prop.rich_text.map((t) => t.plain_text).join("") || null;
        break;
      case "select":
        row[name] = prop.select ? prop.select.name : null;
        break;
      case "status":
        row[name] = prop.status ? prop.status.name : null;
        break;
      case "number":
        row[name] = prop.number;
        break;
      case "url":
        row[name] = prop.url;
        break;
      case "relation":
        row[name] = JSON.stringify(prop.relation.map((r) => `https://app.notion.com/${hex(r.id)}`));
        break;
      case "multi_select":
        row[name] = JSON.stringify(prop.multi_select.map((o) => o.name));
        break;
      default:
        break;
    }
  }
  return row;
}

export async function onRequestPost({ request, env }) {
  const deny = auth(request, env);
  if (deny) return deny;
  if (!env.NOTION_TOKEN) return json({ error: "NOTION_TOKEN secret is not set on the Pages project" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "expected a JSON body" }, 400);
  }
  const id = SOURCES[body.source];
  if (!id) return json({ error: `unknown source "${body.source}"` }, 400);

  const rows = [];
  let cursor;
  for (let i = 0; i < 5; i++) {
    const res = await fetch(`https://api.notion.com/v1/data_sources/${id}/query`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.NOTION_TOKEN}`,
        "notion-version": "2025-09-03",
        "content-type": "application/json",
      },
      body: JSON.stringify(cursor ? { page_size: 100, start_cursor: cursor } : { page_size: 100 }),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300);
      return json({ error: `Notion ${res.status} — ${detail}` }, 502);
    }
    const data = await res.json();
    for (const page of data.results || []) rows.push(flatten(page));
    if (!data.has_more || !data.next_cursor) break;
    cursor = data.next_cursor;
  }
  return json({ results: rows });
}

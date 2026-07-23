import { auth, json } from "./_utils.js";
import portfolio from "../../data/portfolio.json";

// The everything-dashboard's data: goals, apps, tickets (Claude-maintained).
// Update flow: edit focus-site/data/portfolio.json, push — Pages redeploys.
export async function onRequestGet({ request, env }) {
  const deny = auth(request, env);
  if (deny) return deny;
  return json(portfolio);
}

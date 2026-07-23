export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

// Shared-secret gate. The static page is public but carries no data; every
// data endpoint requires the password set as the DASH_PASSWORD secret.
export function auth(request, env) {
  if (!env.DASH_PASSWORD) return json({ error: "DASH_PASSWORD secret is not set on the Pages project" }, 500);
  if (request.headers.get("x-dash-key") !== env.DASH_PASSWORD) return json({ error: "unauthorized" }, 401);
  return null;
}

// Supabase Edge Function (Deno) — populates public.fixtures_cache.
//
// WHY: keeps the app within a free-tier sports API's request budget. Run it on a
// schedule (e.g. every 5 min via Supabase cron) so ONE server request refreshes
// the cache that all clients read — instead of every device calling the API.
//
// Deploy:
//   supabase functions deploy cache-fixtures --no-verify-jwt
//   supabase secrets set SPORTS_API_URL="https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4429&s=2026"
// Schedule (every 5 minutes):
//   select cron.schedule('cache-fixtures','*/5 * * * *',
//     $$ select net.http_post(
//          url := 'https://<project-ref>.functions.supabase.co/cache-fixtures',
//          headers := '{"Authorization":"Bearer <anon-or-service-key>"}'::jsonb) $$);

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      // Service role bypasses RLS so the function can write the cache.
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const apiUrl = Deno.env.get("SPORTS_API_URL")!;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Sports API responded ${res.status}`);
    const raw = await res.json();

    // NOTE: map `raw` into the app's Match[] shape here (mirror lib/data/thesportsdb.ts).
    // Stored as-is for now; adapt to your chosen provider's response.
    const data = raw;

    const { error } = await supabase
      .from("fixtures_cache")
      .upsert({ id: "wc2026", data, updated_at: new Date().toISOString() });
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
});

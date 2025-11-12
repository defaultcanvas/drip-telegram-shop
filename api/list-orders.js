// /api/list-orders.js — returns last 50 orders (server-side only)
export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return res.status(200).json({ ok:true, orders: [] });

  try {
    const r = await fetch(`${url}/rest/v1/orders?select=*&order=created_at.desc&limit=50`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    });
    if (!r.ok) return res.status(500).json({ ok:false, error: await r.text() });
    const data = await r.json();
    return res.status(200).json({ ok:true, orders: data });
  } catch (e) {
    return res.status(500).json({ ok:false, error:String(e) });
  }
}

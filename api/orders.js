// /api/orders.js — Vercel Serverless (Node 18+)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok:false, error:'Method not allowed' });
  }

  const order = req.body;
  if (!order?.id) return res.status(400).json({ ok:false, error:'Missing order id' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  // If Supabase not configured, accept anyway so frontend can proceed
  if (!url || !key) {
    console.log('Order (no DB configured):', order);
    return res.status(200).json({ ok:true, id: order.id, warning:'Saved locally only' });
  }

  // Persist to Supabase via REST
  const payload = {
    id: order.id,
    unique_ref: order.uniqueRef,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    payment_method: order.payment?.method || 'bank_transfer',
    payment_status: order.payment?.status || 'AWAITING_REVIEW',
    user_email: order.user?.email || null,
    user_phone: order.user?.phone || null,
    user_name: order.user?.name || null,
    address: order.user?.address || null,
    city: order.user?.city || null,
    postcode: order.user?.postcode || null,
    country: order.user?.country || null,
    items: order.items || [],
    proof: order.proof || null,
    status: order.status || 'AWAITING_PAYMENT'
  };

  try {
    const r = await fetch(`${url}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ ok:false, error:`Supabase error: ${txt}` });
    }

    const data = await r.json();
    return res.status(200).json({ ok:true, id: data?.[0]?.id || order.id });
  } catch (e) {
    return res.status(500).json({ ok:false, error:String(e) });
  }
}

import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();   

    const { 
      telegram_user_id,
      telegram_username,
      telegram_chat_id,
      total,
      items 
    } = body;

    // Save order
    const { data, error } = await supabase
      .from("orders")
      .insert({
        telegram_user_id,
        telegram_username,
        telegram_chat_id,
        total_gbp: total,
        payload: items
      })
      .select()
      .single();

    if (error) return Response.json({ error }, { status: 400 });

    return Response.json({ ok: true, order: data });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
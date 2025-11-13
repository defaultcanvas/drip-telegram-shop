import { supabase } from "@/lib/supabase";

export async function GET(req, { params }) {
  const { id } = params;

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  if (error) return Response.json({ error }, { status: 404 });

  return Response.json(data);
}

export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("products")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return Response.json({ error }, { status: 400 });

  return Response.json(data);
}

export async function DELETE(req, { params }) {
  const { id } = params;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) return Response.json({ error }, { status: 400 });

  return Response.json({ ok: true });
}
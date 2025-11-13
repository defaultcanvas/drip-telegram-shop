import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error }, { status: 400 });

  return Response.json(data);
}

export async function POST(req) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("products")
    .insert(body)
    .select()
    .single();

  if (error) return Response.json({ error }, { status: 400 });

  return Response.json(data);
}
import { supabase } from "@/lib/supabase";

export async function POST(req, { params }) {
  const { id } = params;
  const body = await req.json(); // expects { urls: [] }

  const inserts = body.urls.map((url, i) => ({
    product_id: id,
    image_url: url,
    position: i,
    is_primary: i === 0,
  }));

  const { data, error } = await supabase
    .from("product_images")
    .insert(inserts)
    .select();

  if (error) return Response.json({ error }, { status: 400 });

  return Response.json(data);
}
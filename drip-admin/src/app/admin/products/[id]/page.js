import ProductForm from "@/components/ProductForm";
import { supabase } from "@/lib/supabase";

export default async function EditPage({ params }) {
  const { id } = params;

  let { data: product } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Edit Product</h1>
      <ProductForm mode="edit" product={product} />
    </div>
  );
}
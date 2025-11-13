"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    let { data } = await supabase.from("products").select("*, product_images(*)").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="px-5 py-2 bg-yellow-400 text-black rounded-xl font-semibold hover:bg-yellow-300">
          + Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const img = product.product_images?.find(i => i.is_primary) || product.product_images?.[0];
  
  return (
    <a href={`/admin/products/${product.id}`} className="group">
      <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
        
        {img ? (
          <img src={img.image_url} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-black/30 flex items-center justify-center text-white/40">
            No Image
          </div>
        )}

        <div className="p-4">
          <div className="text-xl font-semibold">{product.title}</div>
          <div className="text-white/50">{product.brand}</div>
          <div className="mt-2 text-yellow-400 font-bold">£{product.price_gbp}</div>
        </div>

      </div>
    </a>
  );
}
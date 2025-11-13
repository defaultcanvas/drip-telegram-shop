export default function ProductCard({ product }) {
  const img = product.product_images?.find(i => i.is_primary) || product.product_images?.[0];

  return (
    <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-2 shadow-xl">
      <img src={img?.image_url} className="h-40 w-full object-cover rounded-lg" />

      <div className="mt-2 text-sm font-bold">{product.title}</div>
      <div className="text-xs text-white/50">{product.brand}</div>
      <div className="text-yellow-400 mt-1 font-bold">£{product.price_gbp}</div>
    </div>
  );
}
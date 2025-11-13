export default function PDPModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  const img = product.product_images?.find(i => i.is_primary) || product.product_images?.[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
      <div className="bg-gradient-to-t from-slate-900 to-purple-900 w-full rounded-t-3xl p-6 transform transition-transform">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{product.title}</h2>
          <button onClick={onClose} className="text-white/50 text-2xl">&times;</button>
        </div>
        
        <img src={img?.image_url} className="w-full h-64 object-cover rounded-lg mb-4" />
        
        <div className="space-y-2 mb-6">
          <div className="text-white/70">{product.brand}</div>
          <div className="text-yellow-400 text-2xl font-bold">£{product.price_gbp}</div>
          <p className="text-sm text-white/60">{product.description}</p>
        </div>
        
        <button 
          onClick={() => onAddToCart(product)}
          className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
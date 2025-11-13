export default function CartSheet({ cart, isOpen, onClose, onCheckout }) {
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.price_gbp * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
      <div className="bg-gradient-to-t from-slate-900 to-purple-900 w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Cart ({cart.length})</h2>
          <button onClick={onClose} className="text-white/50 text-2xl">&times;</button>
        </div>
        
        {cart.length === 0 ? (
          <p className="text-white/60 text-center py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                  <div className="text-sm flex-1">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-white/50">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-yellow-400 font-bold">£{(item.price_gbp * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-yellow-400">£{total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={onCheckout}
              className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl"
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
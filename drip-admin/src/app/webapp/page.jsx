"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "./components/ProductCard";
import CategoryTabs from "./components/CategoryTabs";
import PDPModal from "./components/PDPModal";
import CartSheet from "./components/CartSheet";

export default function WebStore() {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState("Men");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("is_active", true)
      .eq("category", cat)
      .order("created_at", { ascending: false });

    setProducts(data || []);
  }

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setSelectedProduct(null);
  }

  async function checkout() {
    if (!cart.length) return;

    const total = cart.reduce((sum, item) => sum + (item.price_gbp * item.quantity), 0);
    
    // Telegram WebApp checkout
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.HapticFeedback?.notificationOccurred("success");

      const payload = {
        telegram_user_id: tg.initDataUnsafe?.user?.id,
        telegram_username: tg.initDataUnsafe?.user?.username,
        telegram_chat_id: tg.initDataUnsafe?.receiver?.id ?? "",
        total,
        items: cart
      };

      await fetch("/api/telegram/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      tg.close?.();
    }
  }

  useEffect(() => { load(); }, [cat]);

  return (
    <div className="p-4">
      {/* Header with cart icon */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">DRIP Store</h1>
        <button 
          onClick={() => setShowCart(true)}
          className="relative bg-white/10 p-3 rounded-full"
        >
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <CategoryTabs active={cat} setActive={setCat} />

      <div className="grid grid-cols-2 gap-4 mt-4">
        {products.map((p) => (
          <div key={p.id} onClick={() => setSelectedProduct(p)}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <PDPModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      <CartSheet
        cart={cart}
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={checkout}
      />
    </div>
  );
}
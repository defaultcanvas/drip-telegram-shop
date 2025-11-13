/* --------------------------------------------
   DRIP CLUB — ENGINE.JS
   Telegram WebApp Clothing Store Engine
-------------------------------------------- */

// Safe Telegram WebApp wrapper (works in dev & in Telegram)
const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : {
  colorScheme: "dark",
  MainButton: {
    setParams: () => {},
    show: () => {},
    hide: () => {}
  },
  sendData: data => console.log("Mock sendData:", data),
  close: () => console.log("Mock close WebApp"),
  onEvent: () => {},
  ready: () => {},
  showAlert: msg => alert(msg)
};

tg.ready();

/* ------------------------------------------------
   THEME
--------------------------------------------------- */

function applyTheme() {
  try {
    const scheme = tg.colorScheme;
    if (scheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  } catch (e) {
    // ignore
  }
}

applyTheme();
tg.onEvent && tg.onEvent("themeChanged", applyTheme);

/* ------------------------------------------------
   CATEGORY + SUBCATEGORY CONFIG
--------------------------------------------------- */

const CATEGORIES = {
  Men: ["Hoodies", "Tees", "Tracksuits", "Jackets", "Cargos"],
  Women: ["Tops", "Hoodies", "Leggings", "Tracksuits", "Coats"],
  Footwear: ["Jordans", "Air Max", "Dunks", "Running", "Slides"],
  Accessories: ["Bags", "Caps", "Wallets", "Fragrance", "Jewellery"]
};

/* ------------------------------------------------
   SAMPLE PRODUCTS (10 DEMO ITEMS)
--------------------------------------------------- */

const PRODUCTS = [
  {
    id: "M1",
    category: "Men",
    sub: "Hoodies",
    brand: "Nike",
    name: "Tech Fleece Hoodie",
    price: 89.99,
    sizes: ["S", "M", "L", "XL"],
    condition: "BNWT",
    delivery: "In hand",
    stock: 3,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800"
    ],
    lottie: null
  },
  {
    id: "M2",
    category: "Men",
    sub: "Tees",
    brand: "Jordan",
    name: "Jumpman Tee",
    price: 39.99,
    sizes: ["S", "M", "L", "XL"],
    condition: "Verified",
    delivery: "2–5 days",
    stock: 10,
    images: [
      "https://images.unsplash.com/photo-1542293787938-c9e299b88054?q=80&w=800"
    ]
  },
  {
    id: "M3",
    category: "Men",
    sub: "Tracksuits",
    brand: "Adidas",
    name: "3-Stripes Tracksuit",
    price: 74.99,
    sizes: ["S", "M", "L"],
    condition: "Like New",
    delivery: "In hand",
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1563170423-18f482d82cc8?q=80&w=800"
    ]
  },
  {
    id: "W1",
    category: "Women",
    sub: "Tops",
    brand: "Nike",
    name: "Ribbed Crop Top",
    price: 29.99,
    sizes: ["XS", "S", "M"],
    condition: "BNWT",
    delivery: "2–5 days",
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800"
    ]
  },
  {
    id: "W2",
    category: "Women",
    sub: "Coats",
    brand: "North Face",
    name: "Nuptse Puffer",
    price: 149.99,
    sizes: ["S", "M", "L"],
    condition: "Verified",
    delivery: "In hand",
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03acae1?q=80&w=800"
    ]
  },
  {
    id: "F1",
    category: "Footwear",
    sub: "Jordans",
    brand: "Jordan",
    name: "Jordan 4 Retro",
    price: 199.99,
    sizes: ["7", "8", "9", "10"],
    condition: "Verified",
    delivery: "In hand",
    stock: 4,
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b1669?q=80&w=800"
    ]
  },
  {
    id: "F2",
    category: "Footwear",
    sub: "Air Max",
    brand: "Nike",
    name: "Air Max 97 Silver Bullet",
    price: 159.99,
    sizes: ["7", "8", "9", "10", "11"],
    condition: "BNWT",
    delivery: "2–5 days",
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1606812691131-5d180b1a3e44?q=80&w=800"
    ]
  },
  {
    id: "A1",
    category: "Accessories",
    sub: "Fragrance",
    brand: "Dior",
    name: "Sauvage 100ml",
    price: 84.0,
    sizes: ["100ml"],
    condition: "Sealed",
    delivery: "In hand",
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1556228482-75d31a499eae?q=80&w=800"
    ]
  },
  {
    id: "A2",
    category: "Accessories",
    sub: "Caps",
    brand: "New Era",
    name: "NY Yankees Cap",
    price: 29.99,
    sizes: ["One Size"],
    condition: "BNWT",
    delivery: "2–5 days",
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800"
    ]
  },
  {
    id: "A3",
    category: "Accessories",
    sub: "Bags",
    brand: "Supreme",
    name: "Shoulder Bag",
    price: 89.99,
    sizes: ["One Size"],
    condition: "Verified",
    delivery: "In hand",
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800"
    ]
  }
];

/* ------------------------------------------------
   STATE
--------------------------------------------------- */

let state = {
  category: "Men",
  subcategory: "Hoodies",
  cart: [],
  currentPDP: null,
  carouselIndex: 0
};

/* ------------------------------------------------
   HELPERS
--------------------------------------------------- */

const $id = id => document.getElementById(id);

function withCardAnimation(feedEl) {
  // add a small class so CSS can animate cards on re-render
  if (!feedEl) return;
  feedEl.classList.remove("feed-anim");
  void feedEl.offsetWidth; // force reflow
  feedEl.classList.add("feed-anim");
}

function bounceCartBadge() {
  const el = $id("cart-count");
  if (!el) return;
  el.classList.remove("badge-bounce");
  void el.offsetWidth;
  el.classList.add("badge-bounce");
}

/* ------------------------------------------------
   CATEGORY RENDERING
--------------------------------------------------- */

function renderCategories() {
  const row = $id("category-row");
  if (!row) return;
  row.innerHTML = "";

  Object.keys(CATEGORIES).forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = state.category === cat ? "active" : "";
    btn.onclick = () => {
      if (state.category === cat) return;
      state.category = cat;
      state.subcategory = CATEGORIES[cat][0];
      renderCategories();
      renderSubcategories();
      renderProducts(true);
    };
    row.appendChild(btn);
  });
}

/* ------------------------------------------------
   SUBCATEGORY RENDERING
--------------------------------------------------- */

function renderSubcategories() {
  const row = $id("subcategory-row");
  if (!row) return;
  row.innerHTML = "";

  CATEGORIES[state.category].forEach(sub => {
    const btn = document.createElement("button");
    btn.textContent = sub;
    btn.className = state.subcategory === sub ? "active" : "";
    btn.onclick = () => {
      if (state.subcategory === sub) return;
      state.subcategory = sub;
      renderSubcategories();
      renderProducts(true);
    };
    row.appendChild(btn);
  });
}

/* ------------------------------------------------
   PRODUCT FEED RENDERING
--------------------------------------------------- */

function renderProducts(withAnim = false) {
  const feed = $id("product-feed");
  if (!feed) return;
  feed.innerHTML = "";

  const products = PRODUCTS.filter(
    p => p.category === state.category && p.sub === state.subcategory
  );

  products.forEach((p, idx) => {
    const card = document.createElement("div");
    card.className = "card ripple";
    card.style.animationDelay = (idx * 30) + "ms";
    card.onclick = () => openPDP(p.id);

    card.innerHTML = `
      <img src="${p.images[0]}" alt="${p.name}" />
      <div class="card-brand">${p.brand}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-price">£${p.price.toFixed(2)}</div>
      <div class="card-badges">
        ${p.condition === "BNWT" ? `<span class="badge hot">🔥 BNWT</span>` : ""}
        ${p.condition === "Verified" ? `<span class="badge verified">⭐ Verified</span>` : ""}
        <span class="badge">${p.delivery}</span>
      </div>
    `;

    feed.appendChild(card);
  });

  if (withAnim) withCardAnimation(feed);
}

/* ------------------------------------------------
   PDP MODAL
--------------------------------------------------- */

function openPDP(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  state.currentPDP = product;
  state.carouselIndex = 0;

  const img = $id("pdp-image");
  const brand = $id("pdp-brand");
  const name = $id("pdp-name");
  const price = $id("pdp-price");
  const cond = $id("pdp-condition");
  const delivery = $id("pdp-delivery");
  const sizesWrap = $id("pdp-sizes");
  const modal = $id("pdp-modal");

  if (!img || !brand || !name || !price || !cond || !delivery || !sizesWrap || !modal) return;

  img.src = product.images[0];
  brand.textContent = product.brand;
  name.textContent = product.name;
  price.textContent = "£" + product.price.toFixed(2);
  cond.textContent = product.condition;
  delivery.textContent = product.delivery;

  sizesWrap.innerHTML = "";
  product.sizes.forEach(size => {
    const btn = document.createElement("button");
    btn.textContent = size;
    btn.onclick = () => {
      sizesWrap.querySelectorAll("button").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
    };
    sizesWrap.appendChild(btn);
  });

  modal.classList.add("open");
}

function closePDP() {
  const modal = $id("pdp-modal");
  if (!modal) return;
  modal.classList.remove("open");
}

/* ------------------------------------------------
   PDP CAROUSEL
--------------------------------------------------- */

function carouselPrev() {
  const p = state.currentPDP;
  if (!p) return;
  state.carouselIndex = (state.carouselIndex - 1 + p.images.length) % p.images.length;
  const img = $id("pdp-image");
  if (img) img.src = p.images[state.carouselIndex];
}

function carouselNext() {
  const p = state.currentPDP;
  if (!p) return;
  state.carouselIndex = (state.carouselIndex + 1) % p.images.length;
  const img = $id("pdp-image");
  if (img) img.src = p.images[state.carouselIndex];
}

/* ------------------------------------------------
   ADD TO CART
--------------------------------------------------- */

function addCurrentToCart() {
  const product = state.currentPDP;
  if (!product) return;

  const sizeEl = document.querySelector("#pdp-sizes button.active");
  if (!sizeEl) {
    if (tg.showAlert) tg.showAlert("Select a size first.");
    else alert("Select a size first.");
    return;
  }

  const size = sizeEl.textContent;
  const existing = state.cart.find(i => i.id === product.id && i.size === size);

  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      size,
      price: product.price,
      img: product.images[0],
      qty: 1
    });
  }

  updateCartCount();
  closePDP();
}

/* ------------------------------------------------
   CART DRAWER
--------------------------------------------------- */

function openCart() {
  const drawer = $id("cart-drawer");
  if (!drawer) return;
  drawer.classList.add("open");
  renderCart();
}

function closeCart() {
  const drawer = $id("cart-drawer");
  if (!drawer) return;
  drawer.classList.remove("open");
}

function renderCart() {
  const wrap = $id("cart-items");
  if (!wrap) return;
  wrap.innerHTML = "";

  state.cart.forEach((item, idx) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center">
        <img src="${item.img}" style="width:60px;height:60px;border-radius:10px;object-fit:cover;" />
        <div>
          <div>${item.name}</div>
          <div class="muted">${item.size}</div>
        </div>
      </div>
      <div style="margin-left:auto;text-align:right">
        <div>£${(item.price * item.qty).toFixed(2)}</div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px">
          <button type="button" data-idx="${idx}" data-dir="-1" class="cart-qty-btn">−</button>
          <span>${item.qty}</span>
          <button type="button" data-idx="${idx}" data-dir="1" class="cart-qty-btn">+</button>
        </div>
      </div>
    `;

    wrap.appendChild(row);
  });

  // wire +/- inside cart
  wrap.querySelectorAll(".cart-qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const dir = Number(btn.dataset.dir);
      if (dir > 0) incQty(idx);
      else decQty(idx);
    });
  });

  updateCartTotal();
}

function incQty(i) {
  state.cart[i].qty++;
  renderCart();
}

function decQty(i) {
  state.cart[i].qty--;
  if (state.cart[i].qty < 1) state.cart.splice(i, 1);
  renderCart();
}

/* CART TOTAL + BADGE */

function updateCartTotal() {
  const total = state.cart.reduce((a, b) => a + b.price * b.qty, 0);
  const totalEl = $id("cart-total");
  if (totalEl) totalEl.textContent = "£" + total.toFixed(2);

  const hasItems = total > 0;
  tg.MainButton.setParams({
    text: hasItems ? `Checkout — £${total.toFixed(2)}` : "Checkout",
    is_visible: hasItems
  });
  if (hasItems && tg.MainButton.show) tg.MainButton.show();
  if (!hasItems && tg.MainButton.hide) tg.MainButton.hide();
}

function updateCartCount() {
  const count = state.cart.reduce((a, b) => a + b.qty, 0);
  const countEl = $id("cart-count");
  if (countEl) {
    countEl.textContent = count;
    if (count > 0) bounceCartBadge();
  }
  updateCartTotal();
}

/* ------------------------------------------------
   CHECKOUT (SENDS CART JSON TO BOT)
--------------------------------------------------- */

async function checkout() {
  if (!state.cart.length) return;
  
  tg.HapticFeedback.notificationOccurred("success");

  const payload = {
    telegram_user_id: tg.initDataUnsafe.user?.id,
    telegram_username: tg.initDataUnsafe.user?.username,
    telegram_chat_id: tg.initDataUnsafe.receiver?.id ?? "",
    total: state.total,
    items: state.cart
  };

  await fetch("/api/telegram/checkout", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  tg.close();
}

/* ------------------------------------------------
   INIT
--------------------------------------------------- */

function init() {
  // PDP modal click outside to close
  const pdpModal = $id("pdp-modal");
  if (pdpModal) {
    pdpModal.addEventListener("click", e => {
      if (e.target === pdpModal) closePDP();
    });
  }

  // PDP carousel
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  if (prevBtn) prevBtn.addEventListener("click", carouselPrev);
  if (nextBtn) nextBtn.addEventListener("click", carouselNext);

  // PDP add to cart
  const pdpAdd = $id("pdp-add");
  if (pdpAdd) pdpAdd.addEventListener("click", addCurrentToCart);

  // Cart open/close
  const cartCount = $id("cart-count");
  if (cartCount) cartCount.addEventListener("click", openCart);
  const cartClose = $id("cart-close");
  if (cartClose) cartClose.addEventListener("click", closeCart);

  // Checkout button in drawer
  const checkoutBtn = $id("checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);

  // Telegram MainButton click
  if (tg.onEvent) {
    tg.onEvent("mainButtonClicked", checkout);
  }

  // Initial render
  renderCategories();
  renderSubcategories();
  renderProducts(true);
  updateCartCount();
}

// Make sure DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

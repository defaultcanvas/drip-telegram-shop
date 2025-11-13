/* Simple Cafe.js adapted for clothing items
   - Handles add/remove and populates order overview
   - API calls are placeholders; this is a client-side demo
*/
const Cafe = (function () {
  const qs = (s) => document.querySelector(s);
  const qsa = (s) => Array.from(document.querySelectorAll(s));

  let items = [];
  let backButton = null;

  const subBars = Object.create(null);
  const subButtons = Object.create(null);
  const activeSubFilters = Object.create(null);

  let activeCategory = null;
  let forceBounce = false;

  let currentOrder = { items: [], total: 0 };

  // Optional Telegram WebApp integration
  const tg =
    window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  // ---------- Helpers ----------

  function readItemsFromDOM() {
    items = qsa(".cafe-item").map((el) => {
      const nameEl = el.querySelector(".cafe-item-title");
      const imgEl = el.querySelector(".cafe-item-photo img");

      // Attach animation cleanup once
      el.addEventListener("animationend", (evt) => {
        if (evt.animationName === "bounceIn") {
          el.classList.remove("item-appear");
        }
        if (evt.animationName === "tapPulse") {
          el.classList.remove("item-tap");
        }
      });

      return {
        id: el.dataset.itemId,
        price: Number(el.dataset.itemPrice) / 100,
        name: nameEl ? nameEl.textContent : "",
        img: imgEl ? imgEl.src : "",
        qty: 0,
        category: el.dataset.category || "",
        subcategory: el.dataset.subcategory || "",
        el,
      };
    });
  }

  function findItem(id) {
    return items.find((i) => String(i.id) === String(id));
  }

  function pulseCard(el) {
    if (!el) return;
    el.classList.remove("item-tap");
    // restart CSS animation
    void el.offsetWidth;
    el.classList.add("item-tap");
  }

  // ---------- Cart logic ----------

  function addOne(id, sourceEl) {
    const it = findItem(id);
    if (!it) return;
    it.qty += 1;
    if (sourceEl) pulseCard(sourceEl);
    renderOrder();
  }

  function removeOne(id, sourceEl) {
    const it = findItem(id);
    if (!it) return;
    if (it.qty > 0) it.qty -= 1;
    if (sourceEl) pulseCard(sourceEl);
    renderOrder();
  }

  function renderOrder() {
    const container = qs(".js-order-items");
    if (!container) return;

    container.innerHTML = "";

    const selected = items.filter((i) => i.qty > 0);
    const total = selected.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );

    currentOrder = { items: selected, total };

    selected.forEach((i) => {
      const row = document.createElement("div");
      row.className = "js-order-item";
      row.dataset.itemId = i.id;
      row.innerHTML = `
        <img src="${i.img}" alt="${i.name}">
        <div style="flex:1">
          <div class="cafe-order-item-title">
            ${i.name}
            <span class="cafe-order-item-counter">${i.qty}x</span>
          </div>
        </div>
        <div class="cafe-order-item-price">£${(i.price * i.qty).toFixed(2)}</div>
      `;
      container.appendChild(row);
    });

    updateStatusBar();
    updateMainButton();
  }

  function updateStatusBar() {
    const status = qs(".js-status");
    if (!status) return;

    if (!currentOrder.items.length) {
      status.textContent = "";
      return;
    }

    const count = currentOrder.items.length;
    status.textContent = `${count} item${count > 1 ? "s" : ""} • £${currentOrder.total.toFixed(
      2
    )}`;
  }

  function updateMainButton() {
    if (!tg) return;

    if (!currentOrder.items.length) {
      tg.MainButton.hide();
      return;
    }

    tg.MainButton.setText(`Checkout • £${currentOrder.total.toFixed(2)}`);
    tg.MainButton.show();
  }

  // ---------- Filters & categories ----------

  function resetSubSelection(cat) {
    if (!cat) return;
    activeSubFilters[cat] = null;
    (subButtons[cat] || []).forEach((btn) => btn.classList.remove("active"));
  }

  function resetAllSubSelections() {
    Object.keys(subButtons).forEach((cat) => resetSubSelection(cat));
  }

  function hideAllSubBars() {
    Object.values(subBars).forEach((bar) => {
      if (bar) bar.style.display = "none";
    });
  }

  function applyFilters() {
    const activeSub = activeCategory ? activeSubFilters[activeCategory] : null;

    items.forEach((item) => {
      const el = item.el;
      if (!el) return;

      const matchesCategory =
        !activeCategory || item.category === activeCategory;

      const hasSubBar = activeCategory
        ? Boolean(subBars[activeCategory])
        : false;

      const matchesSub = hasSubBar
        ? !activeSub || item.subcategory === activeSub
        : true;

      const shouldShow = matchesCategory && matchesSub;
      const wasHidden = el.style.display === "none";

      if (shouldShow) {
        if (wasHidden || forceBounce) {
          el.style.display = "";
          el.classList.remove("item-appear");
          void el.offsetWidth; // restart animation
          el.classList.add("item-appear");
        } else {
          el.style.display = "";
        }
      } else if (!wasHidden) {
        el.style.display = "none";
        el.classList.remove("item-appear");
      }
    });

    forceBounce = false;
  }

  // ---------- UI wiring ----------

  function wireButtons() {
    qsa(".js-item-incr-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".cafe-item");
        if (!card) return;
        const id = card.dataset.itemId;
        addOne(id, card);
      });
    });

    qsa(".js-item-decr-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".cafe-item");
        if (!card) return;
        const id = card.dataset.itemId;
        removeOne(id, card);
      });
    });
  }

  function showLanding() {
    const landing = qs("#landing");
    const itemsSection = qs("#items-section");

    if (landing) landing.style.display = "";
    if (itemsSection) itemsSection.style.display = "none";
    if (backButton) backButton.style.display = "none";

    hideAllSubBars();
    resetAllSubSelections();

    activeCategory = null;
    forceBounce = false;
    applyFilters();
  }

  function showItemsForCategory(cat) {
    const landing = qs("#landing");
    const itemsSection = qs("#items-section");

    if (landing) landing.style.display = "none";
    if (itemsSection) itemsSection.style.display = "";
    if (backButton) backButton.style.display = "inline-flex";

    activeCategory = cat || null;

    hideAllSubBars();
    if (cat && subBars[cat]) {
      subBars[cat].style.display = "flex";
      resetSubSelection(cat);
    }

    forceBounce = true;
    applyFilters();
  }

  function wireMenu() {
    qsa(".menu-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.cat;
        showItemsForCategory(cat);
      });
    });
  }

  // ---------- Public API ----------

  return {
    init(opts) {
      readItemsFromDOM();

      backButton = qs("#global-back");

      // Subcategory bars
      qsa(".subcategory-bar").forEach((bar) => {
        const cat = bar.dataset.cat;
        if (!cat) return;

        subBars[cat] = bar;

        const buttons = Array.from(bar.querySelectorAll(".sub-btn"));
        subButtons[cat] = buttons;
        activeSubFilters[cat] = null;

        buttons.forEach((btn) => {
          btn.addEventListener("click", () => {
            const sub = btn.dataset.sub;
            if (!sub) return;

            const isActive = btn.classList.contains("active");

            if (isActive) {
              resetSubSelection(cat);
            } else {
              activeSubFilters[cat] = sub;
              buttons.forEach((b) =>
                b.classList.toggle("active", b === btn)
              );
            }

            forceBounce = true;
            applyFilters();
          });
        });
      });

      if (backButton) {
        backButton.addEventListener("click", showLanding);
      }

      wireButtons();
      wireMenu();
      renderOrder();
      showLanding();

      // Telegram WebApp setup (optional)
      if (tg) {
        tg.ready();
        tg.MainButton.hide();
        tg.MainButton.onClick(() => {
          if (!currentOrder.items.length) return;
          tg.sendData(
            JSON.stringify({
              type: "order",
              total: currentOrder.total,
              items: currentOrder.items.map((i) => ({
                id: i.id,
                name: i.name,
                qty: i.qty,
                price: i.price,
              })),
            })
          );
        });
      }

      console.log("Cafe.init", opts || {});
    },

    // Optional helper if you ever need the order from outside
    getOrder() {
      return { ...currentOrder };
    },
  };
})();

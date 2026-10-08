const SHOP_WHATSAPP_NUMBER = "919711946733";
const SOCIAL_PROFILES = {
  instagram: "https://www.instagram.com/buffalocowghee?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
  facebook: "",
  youtube: "",
};

const products = [
  { id: "cow-1", category: "cow", name: "Cow Ghee", size: "1 kg", price: 3000, image: "cow-1" },
  { id: "cow-2", category: "cow", name: "Cow Ghee", size: "2 kg", price: 6000, image: "cow-2" },
  { id: "cow-5", category: "cow", name: "Cow Ghee", size: "5 kg", price: 15000, image: "cow-5" },
  { id: "cow-10", category: "cow", name: "Cow Ghee", size: "10 kg", price: 30000, image: "cow-10" },
  { id: "cow-20", category: "cow", name: "Cow Ghee", size: "20 kg", price: 60000, image: "cow-20" },
  { id: "buffalo-1", category: "buffalo", name: "Buffalo Ghee", size: "1 kg", price: 2500, image: "buffalo-1" },
  { id: "buffalo-2", category: "buffalo", name: "Buffalo Ghee", size: "2 kg", price: 5000, image: "buffalo-2" },
  { id: "buffalo-5", category: "buffalo", name: "Buffalo Ghee", size: "5 kg", price: 12500, image: "buffalo-5" },
  { id: "buffalo-10", category: "buffalo", name: "Buffalo Ghee", size: "10 kg", price: 25000, image: "buffalo-10" },
  { id: "buffalo-20", category: "buffalo", name: "Buffalo Ghee", size: "20 kg", price: 50000, image: "buffalo-20" },
  { id: "atta-10", category: "atta", name: "Whole Wheat Flour (Atta)", size: "10 kg", price: 1000, image: "atta-10" },
  { id: "atta-20", category: "atta", name: "Whole Wheat Flour (Atta)", size: "20 kg", price: 2000, image: "atta-20" },
  { id: "atta-50", category: "atta", name: "Whole Wheat Flour (Atta)", size: "50 kg", price: 5000, image: "atta-50" },
  { id: "atta-100", category: "atta", name: "Whole Wheat Flour (Atta)", size: "100 kg", price: 10000, image: "atta-100" },
  { id: "atta-500", category: "atta", name: "Whole Wheat Flour (Atta)", size: "500 kg", price: 50000, image: "atta-500" },
];

const DELIVERY_THRESHOLD = 10000;
const BASE_DELIVERY_CHARGE = 199;
const cart = new Map();
const productGrid = document.querySelector("#product-grid");
const cartItems = document.querySelector("#cart-items");
const emptyCart = document.querySelector("#cart-empty");
const formMessage = document.querySelector("#form-message");
const buttonFeedbackTimers = new WeakMap();
let recentlyAddedProductId = null;

function formatPrice(price) {
  return `Rs. ${price.toLocaleString("en-PK")}`;
}

document.querySelectorAll("[data-social]").forEach((link) => {
  const profileUrl = SOCIAL_PROFILES[link.dataset.social];
  if (!profileUrl) return;
  const platform = link.dataset.social[0].toUpperCase() + link.dataset.social.slice(1);
  link.href = profileUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Open Desi Ghee Haryana on ${platform}`);
  link.removeAttribute("aria-disabled");
  link.removeAttribute("tabindex");
  link.removeAttribute("title");
  link.classList.remove("is-disabled");
});

function getDeliveryDetails(subtotal) {
  if (subtotal === 0) {
    return { charge: 0, note: "Delivery charge is calculated from your order subtotal." };
  }
  if (subtotal < DELIVERY_THRESHOLD) {
    return {
      charge: BASE_DELIVERY_CHARGE,
      note: "Rs. 199 minimum delivery charge for orders below Rs. 10,000; it may be higher depending on your location.",
    };
  }
  return {
    charge: 0,
    note: "No base delivery charge for orders of Rs. 10,000 or more. Any location-based adjustment will be confirmed on WhatsApp.",
  };
}

function renderProducts(category = "all") {
  const visibleProducts = category === "all" ? products : products.filter((product) => product.category === category);
  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-image ${product.image}" role="img" aria-label="${product.name}">
        <span class="product-tag">${product.category === "atta" ? "Daily staple" : "Pure & rich"}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.size} pack</p>
        <div class="product-actions">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name}, ${product.size}, to bag"><span aria-hidden="true">+</span> Add to bag</button>
        </div>
      </div>
    </article>`).join("");
}

function renderCart() {
  const entries = [...cart.entries()];
  const itemCount = entries.reduce((total, [, quantity]) => total + quantity, 0);
  const subtotal = entries.reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return total + product.price * quantity;
  }, 0);
  const delivery = getDeliveryDetails(subtotal);

  document.querySelector("#header-count").textContent = itemCount;
  document.querySelector("#cart-item-count").textContent = `(${itemCount})`;
  document.querySelector("#cart-total").textContent = formatPrice(subtotal);
  document.querySelector("#delivery-charge").textContent = formatPrice(delivery.charge);
  document.querySelector("#cart-grand-total").textContent = formatPrice(subtotal + delivery.charge);
  document.querySelector("#delivery-note").textContent = delivery.note;
  emptyCart.hidden = entries.length > 0;
  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return `<div class="cart-line${id === recentlyAddedProductId ? " is-new" : ""}">
      <span class="cart-line-title">${product.name} · ${product.size}</span>
      <span class="cart-line-price">${formatPrice(product.price * quantity)}</span>
      <span class="cart-line-meta">${formatPrice(product.price)} each</span>
      <span class="quantity-control" aria-label="Quantity for ${product.name}, ${product.size}">
        <button type="button" data-change="${id}" data-delta="-1" aria-label="Remove one ${product.size} ${product.name}">−</button>
        <span>${quantity}</span>
        <button type="button" data-change="${id}" data-delta="1" aria-label="Add one ${product.size} ${product.name}">+</button>
      </span>
    </div>`;
  }).join("");
  recentlyAddedProductId = null;
}

document.querySelector(".category-tabs").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-category]");
  if (!tab) return;
  document.querySelectorAll(".category-tab").forEach((button) => {
    const active = button === tab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  renderProducts(tab.dataset.category);
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  cart.set(id, (cart.get(id) || 0) + 1);
  recentlyAddedProductId = id;
  formMessage.textContent = "";
  renderCart();

  window.clearTimeout(buttonFeedbackTimers.get(button));
  const originalLabel = button.innerHTML;
  const originalAriaLabel = button.getAttribute("aria-label");
  button.classList.add("is-added");
  button.innerHTML = '<span aria-hidden="true">&#10003;</span> Added';
  const productDescription = originalAriaLabel.replace(/^Add /, "").replace(/, to bag$/, "");
  button.setAttribute("aria-label", `Added ${productDescription} to bag`);
  buttonFeedbackTimers.set(button, window.setTimeout(() => {
    button.classList.remove("is-added");
    button.innerHTML = originalLabel;
    button.setAttribute("aria-label", originalAriaLabel);
    buttonFeedbackTimers.delete(button);
  }, 1200));

  const cartCount = document.querySelector("#header-count");
  cartCount.classList.remove("is-bumping");
  void cartCount.offsetWidth;
  cartCount.classList.add("is-bumping");
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-change]");
  if (!button) return;
  const id = button.dataset.change;
  const nextQuantity = (cart.get(id) || 0) + Number(button.dataset.delta);
  if (nextQuantity <= 0) cart.delete(id);
  else cart.set(id, nextQuantity);
  renderCart();
});

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (cart.size === 0) {
    formMessage.textContent = "Please add at least one product to your bag first.";
    return;
  }

  const whatsappNumber = SHOP_WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!whatsappNumber) {
    formMessage.textContent = "WhatsApp number is not set as of now. kindly add whatsapp number in app.js SHOP_WHATSAPP_NUMBER .";
    return;
  }

  const form = new FormData(event.currentTarget);
  const orderLines = [...cart.entries()].map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return `- ${product.name} (${product.size}) x ${quantity}: ${formatPrice(product.price * quantity)}`;
  });
  const subtotal = [...cart.entries()].reduce((total, [id, quantity]) => {
    return total + products.find((item) => item.id === id).price * quantity;
  }, 0);
  const delivery = getDeliveryDetails(subtotal);
  const message = [
    "Hello Desi Ghee Haryana, I'd like to place an order:",
    "",
    ...orderLines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Delivery charges (minimum): ${formatPrice(delivery.charge)}`,
    `Estimated charges: ${formatPrice(subtotal + delivery.charge)}`,
    `Delivery note: ${delivery.note}`,
    "",
    `Name: ${form.get("name")}`,
    `Phone: +91 ${form.get("phone")}`,
    `Delivery address: ${form.get("address")}`,
    `Pincode: ${form.get("pincode")}`,
    form.get("note") ? `Order note: ${form.get("note")}` : "",
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

renderProducts();
renderCart();

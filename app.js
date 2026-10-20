const WA = "919711946733";
const IG = "https://www.instagram.com/buffalocowghee?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==";
const MAIL = "sandeepyadav334002@gmail.com";
const FREE_ABOVE = 10000, BASE_DELIVERY = 199;

const CATS = {
  cow: ["Cow Ghee", "cghee1kg.jpeg"], buffalo: ["Buffalo Ghee", "bghee1kg.jpeg"],
  atta: ["Whole Wheat Flour (Atta)", "atta10kg.jpeg"], oil: ["Mustard Oil", "mustard%20oil.jpeg"],
  millet: ["Millet Flour (Bajra Atta)", "millet%20comes.jpeg"], pickle: ["Pickle", "pickle.jpeg"],
};
const P = [
  ["cow-1", "cow", "Cow Ghee", "1 kg", 2500, "cghee1kg"], ["cow-2", "cow", "Cow Ghee", "2 kg", 5000, "cghee2kg"],
  ["cow-5", "cow", "Cow Ghee", "5 kg", 12500, "cghee5kg"], ["cow-10", "cow", "Cow Ghee", "10 kg", 25000, "cghee10kg"],
  ["cow-20", "cow", "Cow Ghee", "20 kg", 50000, "cghee20kg"],
  ["buffalo-1", "buffalo", "Buffalo Ghee", "1 kg", 2000, "bghee1kg"], ["buffalo-2", "buffalo", "Buffalo Ghee", "2 kg", 4000, "bghee2kg"],
  ["buffalo-5", "buffalo", "Buffalo Ghee", "5 kg", 10000, "bghee5kg"], ["buffalo-10", "buffalo", "Buffalo Ghee", "10 kg", 20000, "bghee10kg"],
  ["buffalo-20", "buffalo", "Buffalo Ghee", "20 kg", 40000, "bghee20kg"],
  ["atta-10", "atta", "Whole Wheat Flour (Atta)", "10 kg", 1000, "atta10kg"], ["atta-20", "atta", "Whole Wheat Flour (Atta)", "20 kg", 2000, "atta20kg"],
  ["atta-50", "atta", "Whole Wheat Flour (Atta)", "50 kg", 5000, "atta50kg"], ["atta-100", "atta", "Whole Wheat Flour (Atta)", "100 kg", 10000, "atta100kg"],
  ["atta-500", "atta", "Whole Wheat Flour (Atta)", "500 kg", 50000, "atta500kg"],
  ["oil-1l", "oil", "Mustard Oil", "1 litre", 300, "mustard%20oil"],
  ["millet-5", "millet", "Bajra Atta (Millet Flour)", "5 kg", 1000, "millet%20comes"],
  ["pickle-1", "pickle", "Green Chilli Pickle (Hari Mirch Achar)", "1 kg", 500, "pickle"],
].map(([id, cat, name, size, price, img]) => ({ id, cat, name, size, price, img: img + ".jpeg" }));

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n) => "Rs. " + n.toLocaleString("en-IN");
const find = (id) => P.find((p) => p.id === id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
const page = document.body.dataset.page;
let lenis = null;

/* ---------- cart (remembered across pages) ---------- */
let cart = {};
try { cart = JSON.parse(localStorage.getItem("ff-cart") || "{}"); } catch (e) { cart = {}; }
Object.keys(cart).forEach((k) => { if (!find(k)) delete cart[k]; });
const save = () => { try { localStorage.setItem("ff-cart", JSON.stringify(cart)); } catch (e) {} };
const subtotal = () => Object.entries(cart).reduce((t, [id, q]) => t + find(id).price * q, 0);
const delivery = (s) => s === 0 ? { c: 0, n: "Delivery charge is calculated from your order subtotal." }
  : s < FREE_ABOVE ? { c: BASE_DELIVERY, n: "Rs. 199 minimum delivery charge for orders below Rs. 10,000; it may be higher depending on your location." }
  : { c: 0, n: "No base delivery charge for orders of Rs. 10,000 or more. Any location-based adjustment will be confirmed on WhatsApp." };

/* ---------- shared layout ---------- */
const nav = [["index.html", "home", "Home"], ["shop.html", "shop", "Shop"], ["about.html", "about", "About"], ["contact.html", "contact", "Contact"]];
const brand = `<a class="brand" href="index.html" aria-label="Fauji Farms home"><img src="main_logo.png" alt="" /><span>Fauji Farms<small>PURE PANTRY GOODS</small></span></a>`;
document.body.insertAdjacentHTML("afterbegin", `
<div class="top">Freshly packed pantry essentials · Order directly on WhatsApp</div>
<header class="site-header"><div class="wrap nav">${brand}
  <nav class="links" id="links" aria-label="Main">${nav.map(([h, k, l]) => `<a href="${h}"${k === page ? ' class="on" aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
  <button class="bag-btn" id="open-bag" type="button" aria-label="Open your bag"><span>Bag</span><b id="bag-count">0</b></button>
  <button class="burger" id="burger" type="button" aria-label="Menu" aria-expanded="false"><i></i></button>
</div></header>`);
document.body.insertAdjacentHTML("beforeend", `
<footer class="foot"><div class="wrap"><div class="foot-grid">
  <div>${brand}<p style="max-width:330px">Honest ghee and everyday pantry staples, packed fresh and ready for your family table.</p></div>
  <div><h4>EXPLORE</h4>${nav.map(([h, , l]) => `<a href="${h}">${l}</a>`).join("")}</div>
  <div><h4>REACH US</h4><a href="tel:+919711946733">+91 97119 46733</a><a href="mailto:${MAIL}">${MAIL}</a><a href="${IG}" target="_blank" rel="noopener noreferrer">Instagram</a></div>
</div><div class="copy"><span>© ${new Date().getFullYear()} Fauji Farms. Made for your everyday table.</span><a href="#top" data-top>Back to top ↑</a></div></div></footer>
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" aria-hidden="true" aria-labelledby="bag-title">
  <div class="d-head"><h2 id="bag-title">Your bag <span id="bag-n" class="muted" style="font:600 15px var(--sans)">(0)</span></h2><button class="x" id="close-bag" type="button" aria-label="Close bag">×</button></div>
  <div class="d-body">
    <div id="lines" aria-live="polite"></div>
    <div class="empty" id="empty"><h3>Your bag is waiting.</h3><p>Add something good from the pantry.</p><a class="btn btn-green" href="shop.html">Browse the shop</a></div>
    <div class="tot" id="tot">
      <div><span>Subtotal</span><b id="t-sub"></b></div>
      <div><span>Delivery charges (minimum)</span><b id="t-del"></b></div>
      <div class="g"><span>Estimated total</span><b id="t-all"></b></div>
    </div>
    <p class="note" id="t-note"></p>
    <form class="f" id="order" novalidate>
      <h3 style="font-size:22px;margin:6px 0 4px">Where should we send it?</h3>
      <label for="o-name">Your name</label><input id="o-name" name="name" autocomplete="name" placeholder="Sandeep Yadav" required />
      <label for="o-phone">Phone number</label><div class="pf"><em>+91</em><input id="o-phone" name="phone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national" placeholder="10-digit mobile number" required /></div>
      <label for="o-addr">Delivery address</label><textarea id="o-addr" name="address" rows="2" autocomplete="street-address" placeholder="House, street and city" required></textarea>
      <label for="o-pin">Pincode</label><input id="o-pin" name="pincode" type="number" inputmode="numeric" min="100000" max="999999" step="1" autocomplete="postal-code" placeholder="6-digit pincode" required />
      <label for="o-note">Order note <span>(optional)</span></label><input id="o-note" name="note" placeholder="Anything we should know?" />
      <p class="err" id="o-err" role="alert"></p>
      <button class="btn btn-green" type="submit">Send order on WhatsApp ↗</button>
    </form>
  </div>
</aside>`);

function renderCart() {
  const ids = Object.keys(cart), n = ids.reduce((t, id) => t + cart[id], 0), s = subtotal(), d = delivery(s);
  $("#bag-count").textContent = n; $("#bag-n").textContent = `(${n})`;
  $("#t-sub").textContent = fmt(s); $("#t-del").textContent = fmt(d.c); $("#t-all").textContent = fmt(s + d.c); $("#t-note").textContent = d.n;
  $("#empty").hidden = n > 0; $("#tot").hidden = $("#order").hidden = $("#t-note").hidden = n === 0;
  $("#lines").innerHTML = ids.map((id) => { const p = find(id), q = cart[id]; return `<div class="line">
    <img src="${p.img}" alt="" /><b>${p.name} · ${p.size}</b><b>${fmt(p.price * q)}</b>
    <small>${fmt(p.price)} each</small>
    <span class="qty"><button type="button" data-q="${id}" data-d="-1" aria-label="Remove one ${p.name} ${p.size}">−</button>${q}<button type="button" data-q="${id}" data-d="1" aria-label="Add one ${p.name} ${p.size}">+</button></span></div>`; }).join("");
}
const bump = (el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };
function drawer(open) {
  document.body.classList.toggle("drawer-open", open);
  $("#drawer").setAttribute("aria-hidden", String(!open));
  if (lenis) open ? lenis.stop() : lenis.start();
  if (open) $("#close-bag").focus(); else $("#open-bag").focus({ preventScroll: true });
}
$("#open-bag").onclick = () => drawer(true);
$("#close-bag").onclick = $("#scrim").onclick = () => drawer(false);
$(".d-body").addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
addEventListener("keydown", (e) => { if (e.key === "Escape") drawer(false); });
$("#lines").addEventListener("click", (e) => {
  const b = e.target.closest("[data-q]"); if (!b) return;
  const id = b.dataset.q; cart[id] = (cart[id] || 0) + Number(b.dataset.d);
  if (cart[id] <= 0) delete cart[id]; save(); renderCart();
});
$("#order").addEventListener("submit", (e) => {
  e.preventDefault(); const err = $("#o-err"); err.textContent = "";
  const f = new FormData(e.currentTarget), ph = (f.get("phone") || "").trim(), pin = (f.get("pincode") || "").trim();
  if (!Object.keys(cart).length) return (err.textContent = "Please add at least one product to your bag first.");
  if (!f.get("name").trim() || !f.get("address").trim()) return (err.textContent = "Please fill in your name and delivery address.");
  if (!/^\d{10}$/.test(ph)) return (err.textContent = "Enter a 10-digit mobile number.");
  if (!/^\d{6}$/.test(pin)) return (err.textContent = "Enter a 6-digit pincode.");
  const s = subtotal(), d = delivery(s);
  const msg = ["Hello Fauji Farms, I'd like to place an order:", "",
    ...Object.entries(cart).map(([id, q]) => `- ${find(id).name} (${find(id).size}) x ${q}: ${fmt(find(id).price * q)}`), "",
    `Subtotal: ${fmt(s)}`, `Delivery charges (minimum): ${fmt(d.c)}`, `Estimated charges: ${fmt(s + d.c)}`, `Delivery note: ${d.n}`, "",
    `Name: ${f.get("name")}`, `Phone: +91 ${ph}`, `Delivery address: ${f.get("address")}`, `Pincode: ${pin}`,
    f.get("note") ? `Order note: ${f.get("note")}` : ""].filter((x, i, a) => x !== "" || a[i - 1] !== "").join("\n");
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
});

/* ---------- products ---------- */
const card = (p, i = 0) => `<article class="card" data-tilt style="animation-delay:${Math.min(i, 8) * 50}ms">
  <div class="card-img${p.cat === "oil" || p.cat === "millet" ? " contain" : ""}"><img src="${p.img}" alt="${p.name} ${p.size}" loading="lazy" /><span class="tag">${p.size}</span></div>
  <div class="card-body"><h3>${p.name}</h3><p class="muted">${p.size} pack</p>
  <div class="row"><b>${fmt(p.price)}</b><button class="add" type="button" data-add="${p.id}" aria-label="Add ${p.name}, ${p.size}, to bag">Add to bag</button></div></div></article>`;
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-add]"); if (!b) return;
  cart[b.dataset.add] = (cart[b.dataset.add] || 0) + 1; save(); renderCart(); bump($("#bag-count"));
  b._o = b._o || b.textContent; b.classList.add("done"); b.textContent = "✓ Added";
  clearTimeout(b._t); b._t = setTimeout(() => { b.classList.remove("done"); b.textContent = b._o; }, 1100);
});
const featured = $("#featured");
if (featured) featured.innerHTML = ["cow-1", "buffalo-1", "atta-10", "oil-1l"].map((id, i) => card(find(id), i)).join("");
const catsEl = $("#cats");
if (catsEl) catsEl.innerHTML = Object.entries(CATS).map(([k, [n, img]]) => `<a class="cat reveal" href="shop.html?cat=${k}"><img src="${img}" alt="" loading="lazy" /><h3>${n}</h3><span>${P.filter((p) => p.cat === k).length} sizes available →</span></a>`).join("");
const grid = $("#grid");
if (grid) {
  const tabs = $("#tabs"), cnt = $("#count");
  tabs.innerHTML = [["all", "All products"], ...Object.entries(CATS).map(([k, v]) => [k, v[0]])].map(([k, l]) => `<button class="tab" type="button" role="tab" data-c="${k}">${l}</button>`).join("");
  const show = (c) => {
    const list = c === "all" ? P : P.filter((p) => p.cat === c);
    $$(".tab", tabs).forEach((t) => { const on = t.dataset.c === c; t.classList.toggle("on", on); t.setAttribute("aria-selected", on); });
    grid.innerHTML = list.map(card).join(""); cnt.textContent = `Showing ${list.length} product${list.length > 1 ? "s" : ""}`;
    history.replaceState(null, "", c === "all" ? "shop.html" : `shop.html?cat=${c}`);
  };
  tabs.onclick = (e) => { const t = e.target.closest(".tab"); if (t) show(t.dataset.c); };
  const q = new URLSearchParams(location.search).get("cat");
  show(CATS[q] ? q : "all");
}

/* contact enquiry -> WhatsApp */
const enq = $("#enquiry");
if (enq) enq.addEventListener("submit", (e) => {
  e.preventDefault(); const f = new FormData(enq), err = $("#e-err");
  if (!/^\d{10}$/.test((f.get("phone") || "").trim())) return (err.textContent = "Enter a 10-digit mobile number.");
  const msg = `Hello Fauji Farms,\n\n${f.get("message")}\n\nName: ${f.get("name")}\nPhone: +91 ${f.get("phone")}`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
});

/* ---------- motion ---------- */
if (window.Lenis && !reduce) {
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
}
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const h = a.getAttribute("href"), t = h === "#top" ? document.body : $(h); if (!t) return;
  e.preventDefault(); lenis ? lenis.scrollTo(t, { offset: h === "#top" ? 0 : -80 }) : scrollTo({ top: h === "#top" ? 0 : t.offsetTop - 80, behavior: reduce ? "auto" : "smooth" });
});
const hd = $(".site-header");
addEventListener("scroll", () => hd.classList.toggle("scrolled", scrollY > 8), { passive: true });
const links = $("#links"), burger = $("#burger");
burger.onclick = () => { const o = links.classList.toggle("open"); burger.setAttribute("aria-expanded", o); };
links.addEventListener("click", () => { links.classList.remove("open"); burger.setAttribute("aria-expanded", false); });

if (fine && !reduce) {
  const tilt = (el, e, m) => { const r = el.getBoundingClientRect(); el.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * m + "deg"); el.style.setProperty("--rx", -((e.clientY - r.top) / r.height - .5) * m + "deg"); };
  document.addEventListener("pointermove", (e) => { const c = e.target.closest("[data-tilt]"); if (c) { c.classList.add("hov"); tilt(c, e, 14); } });
  document.addEventListener("pointerout", (e) => { const c = e.target.closest("[data-tilt]"); if (c && !c.contains(e.relatedTarget)) { c.classList.remove("hov"); c.style.removeProperty("--rx"); c.style.removeProperty("--ry"); } });
  const st = $(".stage"), sk = $(".stack");
  if (st) {
    st.addEventListener("pointermove", (e) => { const r = st.getBoundingClientRect(); sk.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 34 + "deg"); sk.style.setProperty("--rx", -((e.clientY - r.top) / r.height - .5) * 22 + "deg"); });
    st.addEventListener("pointerleave", () => { sk.style.removeProperty("--rx"); sk.style.removeProperty("--ry"); });
  }
}
const rev = () => { const els = $$(".reveal:not(.in)");
  if (!("IntersectionObserver" in window) || reduce) return els.forEach((x) => x.classList.add("in"));
  const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .12 });
  els.forEach((x) => io.observe(x)); };
rev();
renderCart();

/* ---------- photo preview ---------- */
document.body.insertAdjacentHTML("beforeend", '<div class="lb" id="lb" aria-hidden="true"><button class="x" type="button" aria-label="Close preview">×</button><img alt="" /></div>');
const lb = $("#lb");
const closeLb = () => { lb.classList.remove("on"); if (lenis && !document.body.classList.contains("drawer-open")) lenis.start(); };
document.addEventListener("click", (e) => {
  const im = e.target.closest(".card-img img");
  if (im) { $("img", lb).src = im.src; $("img", lb).alt = im.alt; lb.classList.add("on"); if (lenis) lenis.stop(); return; }
  if (e.target.closest("#lb")) closeLb();
});
addEventListener("keydown", (e) => { if (e.key === "Escape" && lb.classList.contains("on")) closeLb(); });

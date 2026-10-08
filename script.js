/* RBAS — interactions */

const nav = document.getElementById("nav");
const progress = document.getElementById("progress");
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

/* --- nav state + scroll progress --- */
function onScroll() {
  nav.classList.toggle("scrolled", scrollY > 30);
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    burger.classList.remove("open");
    navLinks.classList.remove("open");
  })
);

/* --- reveal on scroll --- */
const revealObs = new IntersectionObserver(
  entries => {
    entries.forEach((en, i) => {
      if (!en.isIntersecting) return;
      setTimeout(() => en.target.classList.add("in"), i * 80);
      revealObs.unobserve(en.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

/* --- counters --- */
const countObs = new IntersectionObserver(
  entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = +el.dataset.count;
      const dur = 1400;
      const t0 = performance.now();
      const step = now => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach(el => countObs.observe(el));

/* --- 3D tilt --- */
document.querySelectorAll("[data-tilt]").forEach(el => {
  const s = parseFloat(el.dataset.tilt) || 10;
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform =
      `translateY(-6px) rotateY(${x * s}deg) rotateX(${-y * s}deg)`;
  });
  el.addEventListener("pointerleave", () => {
    el.style.transform = "rotateY(0) rotateX(0) translateY(0)";
  });
});

/* --- hero parallax (scroll + pointer) --- */
const heroVisual = document.getElementById("heroVisual");
const heroImg = document.querySelector("[data-parallax]");
const hero = document.getElementById("hero");

hero.addEventListener("pointermove", e => {
  const r = hero.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  heroVisual.style.transform =
    `rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
});
hero.addEventListener("pointerleave", () => {
  heroVisual.style.transform = "rotateY(0) rotateX(0)";
});

addEventListener(
  "scroll",
  () => {
    if (!heroImg) return;
    const y = Math.min(scrollY, 900);
    heroImg.style.transform = `translate3d(0, ${y * 0.1}px, 0) scale(1.06)`;
  },
  { passive: true }
);

/* --- 3D walkthrough stage --- */
const stage = document.getElementById("wtStage");
const stageInner = document.getElementById("stageInner");
if (stage && stageInner) {
  stage.addEventListener("pointermove", e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stageInner.style.transform =
      `rotateY(${x * 16}deg) rotateX(${-y * 11}deg)`;
  });
  stage.addEventListener("pointerleave", () => {
    stageInner.style.transform = "rotateY(0) rotateX(0)";
  });
}

/* --- collection filter --- */
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll("#grid .card");
const grid = document.getElementById("grid");

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    grid.classList.toggle("filtered", f !== "all");

    cards.forEach(card => {
      const show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("hidden", !show);
      if (show) {
        card.style.animation = "none";
        void card.offsetWidth;
        card.style.animation = "cardIn .6s cubic-bezier(.2,.8,.2,1) both";
      }
    });
  });
});

const kf = document.createElement("style");
kf.textContent =
  "@keyframes cardIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}";
document.head.appendChild(kf);

/* =========================================================
   Property detail modal
   ========================================================= */
const IMG = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const PROPERTIES = {
  1: {
    ref: "RBAS-01", title: "Casa Marena", type: "Villa · For sale · Freehold",
    loc: "Assagao, North Goa", price: "₹14.2 Cr", psf: "₹19,189 / sqft",
    badge: "3D Tour available",
    specs: [["5","Bedrooms"],["6","Bathrooms"],["7,400","Built-up sqft"],["Ground + 1","Configuration"],["2021","Year built"],["4","Car parking"]],
    desc: [
      "A five-bedroom house set behind a frangipani court, eight minutes from Assagao church square. The plan runs along a single north-facing spine, so every room takes morning light and misses the afternoon glare entirely. Structural work completed in 2021; joinery is local teak, floors are Athangudi tile.",
      "The 42-foot pool sits on the western edge, shaded by two coconut palms retained during construction. A separate 900 sqft staff cottage sits at the rear with its own entrance."
    ],
    amen: ["42-foot private pool","Detached staff cottage","Solar water heating","Bore well + municipal supply","Hand-built teak joinery","Athangudi tile floors","Rainwater harvesting","1,150 sqft fenced plot"],
    near: [["Assagao Church","0.6 km"],["Anjuna Saturday Market","2.4 km"],["Ashwem Beach","3.2 km"],["Manohar Intl. Airport","34 km"]],
    agent: ["NI","Naina Iyer","Your advisor · Villas & Estates"],
    images: ["photo-1613490493576-7fde63acd811","photo-1600566753086-00f18fb6b3ea","photo-1600573472550-8090b5e0745e","photo-1580587771525-78b9dba3b914"]
  },
  2: {
    ref: "RBAS-02", title: "The Worli Penthouse", type: "Penthouse · For sale · Freehold",
    loc: "Worli Sea Face, Mumbai", price: "₹18.5 Cr", psf: "₹36,275 / sqft",
    badge: "Terrace · Sea facing",
    specs: [["4","Bedrooms"],["5","Bathrooms"],["5,100","Built-up sqft"],["32nd + 33rd","Floor"],["2019","Year built"],["3","Car parking"]],
    desc: [
      "The upper two floors of a 2019 tower on the north end of Worli Sea Face, with a private lift lobby and a 1,100 sqft terrace facing the bay. Ceiling heights are 3.3 metres throughout — unusual for the building, and the reason we took the listing.",
      "Four bedrooms are arranged as two suites on the quiet side. The living and dining room runs the full width of the plan and opens onto the terrace through a nine-metre sliding wall."
    ],
    amen: ["1,100 sqft private terrace","Full sea-facing elevation","Private lift lobby","Two servant rooms","Imported kitchen","Central air conditioning","Tower gym & pool","24×7 concierge"],
    near: [["Sea Face promenade","200 m"],["Peninsula Park","1.1 km"],["Lodha World School","1.4 km"],["Mumbai Intl. Airport","17 km"]],
    agent: ["AR","Aarav Rao","Your advisor · Bandra & South Mumbai"],
    images: ["photo-1600607687939-ce8a6c25118c","photo-1600585154526-990dced4db0d","photo-1560448204-e02f11c3d0e2","photo-1486406146926-c627a92ad1ab"]
  },
  3: {
    ref: "RBAS-03", title: "Chapel Road Apartment", type: "Apartment · For sale · Society share",
    loc: "Bandra West, Mumbai", price: "₹6.4 Cr", psf: "₹29,767 / sqft",
    badge: "Corner unit",
    specs: [["3","Bedrooms"],["3","Bathrooms"],["2,150","Built-up sqft"],["4th of 6","Floor"],["2016","Year built"],["1","Car parking"]],
    desc: [
      "A corner apartment in a small six-unit building two lanes off Chapel Road. Three sides are open, which is why the flat is unusually quiet for the address — the only shared wall is the lift shaft.",
      "Developer finishes were stripped back in 2022 and replaced with lime-plastered walls, oak flooring and a kitchen that actually seats four. Well maintained, with no structural history."
    ],
    amen: ["True corner layout","Open on three sides","Wide-plank oak floors","Lime-plaster walls","Fitted four-seat kitchen","Full inverter backup","Covered resident parking","Visitor management"],
    near: [["Chapel Road","90 m"],["Pali Hill","700 m"],["Bandra Station","1.5 km"],["Bandra–Worli Sea Link","3.6 km"]],
    agent: ["AR","Aarav Rao","Your advisor · Bandra & South Mumbai"],
    images: ["photo-1600210492486-724fe5c67fb0","photo-1502005229762-cf1b2da7c5d6","photo-1484154218962-a197022b5858","photo-1600607687920-4e2a09cf159d"]
  },
  4: {
    ref: "RBAS-04", title: "Palm Grove House", type: "Villa · For sale · Freehold",
    loc: "Kihim, Alibaug", price: "₹11.9 Cr", psf: "₹12,935 / sqft",
    badge: "1.8 acres",
    specs: [["6","Bedrooms"],["7","Bathrooms"],["9,200","Built-up sqft"],["Ground + 2","Configuration"],["2019","Year built"],["5","Car parking"]],
    desc: [
      "A 9,200 sqft main house on 1.8 acres with a separate guest cottage and a 60-foot pool running the length of the lawn. Built in 2019 and occupied since — the garden is mature, the driveway is settled, nothing feels provisional.",
      "The Mandwa ferry terminal is eleven minutes by car, which is the whole argument for this address. The house runs on a 15 kVA generator with automatic changeover."
    ],
    amen: ["60-foot swimming pool","Detached guest cottage","1.8-acre freehold plot","15 kVA auto changeover","Bore well + tanker reserve","Established landscape garden","Separate service kitchen","Three staff rooms"],
    near: [["Kihim Beach","1.2 km"],["Alibaug Town","6 km"],["Mandwa Ferry","8.4 km"],["JNPT","21 km"]],
    agent: ["NI","Naina Iyer","Your advisor · Villas & Estates"],
    images: ["photo-1580587771525-78b9dba3b914","photo-1568605114967-8130f3a36994","photo-1522771739844-6a9f6d5f14af","photo-1554995207-c18c203602cb"]
  },
  5: {
    ref: "RBAS-05", title: "One Millers Bay", type: "Apartment · For sale · Freehold",
    loc: "Lower Parel, Mumbai", price: "₹8.7 Cr", psf: "₹33,462 / sqft",
    badge: "Mill pond view",
    specs: [["3","Bedrooms"],["4","Bathrooms"],["2,600","Built-up sqft"],["28th floor","Floor"],["2017","Year built"],["2","Car parking"]],
    desc: [
      "East-facing over Millers Lane and the old mill pond, in a 2017 tower with one of the better amenity floors in the district. Held by the original owner since handover and never rented out.",
      "Living room and master bedroom face the water. The third bedroom has been opened into a study but can be closed back in a weekend."
    ],
    amen: ["Mill pond aspect","Full club floor","24×7 power & water","Concierge & valet","Two dedicated bays","Staff room","Never rented out","Low-density floor plate"],
    near: [["Kamala Mills","400 m"],["Lower Parel Station","1.1 km"],["Senapati Bapat Marg","800 m"],["Eastern Express Hwy","1.6 km"]],
    agent: ["KM","Kabir Mehta","Your advisor · Investment"],
    images: ["photo-1486406146926-c627a92ad1ab","photo-1567767292278-a4f21aa2d36e","photo-1586023492125-27b2c045efd7","photo-1505873242700-f289a29e1e0f"]
  },
  6: {
    ref: "RBAS-06", title: "Verandah House", type: "Bungalow · For sale · Freehold",
    loc: "Juhu, Mumbai", price: "₹9.3 Cr", psf: "₹24,474 / sqft",
    badge: "Immediate possession",
    specs: [["4","Bedrooms"],["4","Bathrooms"],["3,800","Built-up sqft"],["Ground + 1","Configuration"],["2014","Year built"],["3","Car parking"]],
    desc: [
      "A bungalow-style house on a 1,900 sqft plot with a 30-foot verandah running across the front — the reason it carries the name it does. Two minutes from the beach road, on a quiet lane of nothing but residential stock.",
      "The roof was re-laid in 2023 after our monsoon survey, and wiring and plumbing were replaced the same year. Vacant, clean, ready for immediate possession."
    ],
    amen: ["30-foot front verandah","Roof re-laid 2023","New wiring & plumbing","Rooftop terrace","Two servant rooms","Parking for three","Immediate possession","Quiet residential lane"],
    near: [["Juhu Beach","900 m"],["ISKCON Temple","1.4 km"],["Versova Metro","2.1 km"],["Mumbai Intl. Airport","9 km"]],
    agent: ["KM","Kabir Mehta","Your advisor · Investment"],
    images: ["photo-1568605114967-8130f3a36994","photo-1493809842364-78817add7ffb","photo-1522708323590-d24dbb6b0267","photo-1600566753190-17f0baa2a6c3"]
  }
};

const modal    = document.getElementById("modal");
const mHeroImg = document.getElementById("mHeroImg");
const mThumbs  = document.getElementById("mThumbs");
const mCount   = document.getElementById("mCount");
const bookForm = document.getElementById("bookForm");
const bfOk     = document.getElementById("bfOk");
const bfOkTxt  = document.getElementById("bfOkTxt");
const bfErr    = document.getElementById("bfErr");
const bookDate = document.getElementById("bookDate");

let gallery = [], heroIdx = 0, lastFocus = null, current = null;

const el = id => document.getElementById(id);
const setText = (id, v) => { const n = el(id); if (n) n.textContent = v; };
const todayISO = () => new Date().toISOString().slice(0, 10);

function renderGallery() {
  mHeroImg.style.animation = "none";
  void mHeroImg.offsetWidth;
  mHeroImg.style.animation = "";
  mHeroImg.src = IMG(gallery[heroIdx]);
  mHeroImg.alt = current.title + " — photograph " + (heroIdx + 1);
  mCount.textContent =
    String(heroIdx + 1).padStart(2, "0") + " / " + String(gallery.length).padStart(2, "0");

  mThumbs.innerHTML = "";
  gallery.forEach((id, i) => {
    if (i === heroIdx) return;
    const b = document.createElement("button");
    b.className = "m-thumb";
    b.type = "button";
    b.setAttribute("aria-label", "Show photograph " + (i + 1));
    b.innerHTML = `<img src="${IMG(id)}" alt="" onerror="this.remove()">`;
    b.addEventListener("click", () => {
      [gallery[heroIdx], gallery[i]] = [gallery[i], gallery[heroIdx]];
      heroIdx = i;
      renderGallery();
    });
    mThumbs.appendChild(b);
  });
}

function openModal(id) {
  const p = PROPERTIES[id];
  if (!p) return;
  current = p;
  lastFocus = document.activeElement;

  setText("mRef", "Ref. RBAS · " + p.ref);
  setText("mType", p.type);
  setText("mTitle", p.title);
  setText("mLoc", p.loc);
  setText("mPrice", p.price);
  setText("mPsf", p.psf);
  setText("mBadge", p.badge);
  setText("mAgentName", p.agent[1]);
  setText("mAgentInit", p.agent[0]);
  setText("mAgentRole", p.agent[2]);

  el("mSpecs").innerHTML = p.specs
    .map(s => `<div class="m-spec"><b>${s[0]}</b><span>${s[1]}</span></div>`).join("");

  el("mDesc").innerHTML = p.desc.map(t => `<p>${t}</p>`).join("");
  el("mAmen").innerHTML = p.amen.map(a => `<li>${a}</li>`).join("");
  el("mNear").innerHTML = p.near
    .map(n => `<li><b>${n[0]}</b><i></i><em>${n[1]}</em></li>`).join("");

  gallery = [...p.images];
  heroIdx = 0;
  renderGallery();

  bookForm.reset();
  bookForm.classList.remove("submitted");
  bfOk.hidden = true;
  bfErr.hidden = true;
  bookDate.min = todayISO();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  setTimeout(() => modal.querySelector(".modal-close").focus(), 60);
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
  if (lastFocus) lastFocus.focus();
}

/* --- triggers --- */
document.querySelectorAll("#grid .card").forEach(card => {
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute(
    "aria-label",
    "View details for " + (card.querySelector("h3") ? card.querySelector("h3").textContent : "residence")
  );
  card.addEventListener("click", () => openModal(card.dataset.id));
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(card.dataset.id);
    }
  });
});

document.querySelectorAll("[data-open]").forEach(node => {
  node.addEventListener("click", e => {
    e.preventDefault();
    openModal(node.dataset.open);
  });
});

modal.querySelectorAll("[data-close]").forEach(n => n.addEventListener("click", closeModal));

addEventListener("keydown", e => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

/* --- booking --- */
bookForm.addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(bookForm);
  const name = (f.get("name") || "").toString().trim();
  const phone = (f.get("phone") || "").toString().trim();
  const date = (f.get("date") || "").toString();
  const time = (f.get("time") || "").toString();

  if (!name || !phone || !date || !time) {
    bfErr.hidden = false;
    return;
  }
  bfErr.hidden = true;

  const pretty = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
  });

  bfOkTxt.textContent =
    `${current.title}, ${current.loc} — ${pretty} at ${time}. ` +
    `We have your number (${phone}); ${current.agent[1].split(" ")[0]} will call to confirm within the hour.`;

  bookForm.classList.add("submitted");
  bfOk.hidden = false;
  bfOk.scrollIntoView({ behavior: "smooth", block: "center" });
});

el("bfAgain").addEventListener("click", () => {
  bookForm.reset();
  bookForm.classList.remove("submitted");
  bfOk.hidden = true;
  bfErr.hidden = true;
  bookDate.min = todayISO();
  bookForm.querySelector("input[name=name]").focus();
});

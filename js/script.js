const WHATSAPP_NUMBER = "16893167399";

const header = document.querySelector(".site-header");
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
}, {passive:true});

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}));

const defaultText = encodeURIComponent("Olá! Vim pelo site da BrMoveToGo e gostaria de solicitar uma cotação.");
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultText}`;

["whatsappFloat","footerWhatsapp"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = waUrl;
});

document.getElementById("quoteForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const val = id => document.getElementById(id)?.value.trim() || "";
  const message = [
    "Olá! Vim pelo site da BrMoveToGo e gostaria de solicitar uma cotação.",
    "",
    `Nome: ${val("name")}`,
    `WhatsApp: ${val("phone")}`,
    `Origem: ${val("origin")}`,
    `Destino: ${val("destination")}`,
    `Tipo: ${val("type")}`,
    `Data prevista: ${val("date") || "A definir"}`,
    `Itens / detalhes: ${val("details") || "Não informado"}`
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold:0.08});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));


// Mini Move Simulator
const calcFactors = {
  small: 0.255,      // approx. 24x24x27 in
  large: 0.453,      // approx. 24x24x48 in
  tv: 0.30,          // visual estimate only
  furniture: 0.50    // visual estimate only
};

function getQty(id){
  const el = document.getElementById(id);
  if (!el) return 0;
  const n = parseInt(el.value || "0", 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function updateEstimate(){
  const quantities = {
    small: getQty("small"),
    large: getQty("large"),
    tv: getQty("tv"),
    furniture: getQty("furniture")
  };

  const items = Object.values(quantities).reduce((a,b) => a+b, 0);
  const volume =
    quantities.small * calcFactors.small +
    quantities.large * calcFactors.large +
    quantities.tv * calcFactors.tv +
    quantities.furniture * calcFactors.furniture;

  const volumeEl = document.getElementById("estimatedVolume");
  const itemsEl = document.getElementById("estimatedItems");
  const progressEl = document.getElementById("calcProgress");
  const hintEl = document.getElementById("calcHint");

  if (volumeEl) volumeEl.textContent = `${volume.toFixed(2).replace(".", ",")} m³`;
  if (itemsEl) itemsEl.textContent = String(items);

  const pct = Math.min((volume / 20) * 100, 100);
  if (progressEl) progressEl.style.width = `${pct}%`;

  if (hintEl){
    if (items === 0) hintEl.textContent = "Adicione seus itens para começar.";
    else if (volume < 3) hintEl.textContent = "Perfil compacto — pode se encaixar bem em uma mini mudança.";
    else if (volume < 8) hintEl.textContent = "Volume intermediário — vale uma avaliação personalizada.";
    else hintEl.textContent = "Volume maior — nossa equipe pode avaliar a melhor configuração de envio.";
  }
}

document.querySelectorAll(".stepper button").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const current = Math.max(0, parseInt(input.value || "0", 10) || 0);
    input.value = btn.dataset.action === "plus" ? current + 1 : Math.max(0, current - 1);
    updateEstimate();
  });
});

["small","large","tv","furniture"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", updateEstimate);
});

document.getElementById("sendEstimate")?.addEventListener("click", () => {
  const small = getQty("small");
  const large = getQty("large");
  const tv = getQty("tv");
  const furniture = getQty("furniture");

  const items = small + large + tv + furniture;
  const volume =
    small * calcFactors.small +
    large * calcFactors.large +
    tv * calcFactors.tv +
    furniture * calcFactors.furniture;

  const message = [
    "Olá! Usei o simulador de Mini Mudança no site da BrMoveToGo.",
    "",
    `Caixas pequenas: ${small}`,
    `Caixas grandes: ${large}`,
    `TVs: ${tv}`,
    `Móveis / peças: ${furniture}`,
    "",
    `Total de volumes: ${items}`,
    `Volume estimado: ${volume.toFixed(2).replace(".", ",")} m³`,
    "",
    "Gostaria de receber uma cotação."
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

updateEstimate();


// Privacy / Terms dialogs
const legalMap = {
  privacyOpen: "privacyModal",
  termsOpen: "termsModal"
};
Object.entries(legalMap).forEach(([triggerId, modalId]) => {
  document.getElementById(triggerId)?.addEventListener("click", (e) => {
    e.preventDefault();
    const modal = document.getElementById(modalId);
    modal?.classList.add("open");
    modal?.setAttribute("aria-hidden","false");
  });
});
document.querySelectorAll(".legal-modal").forEach(modal => {
  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
  };
  modal.querySelector(".legal-close")?.addEventListener("click", close);
  modal.addEventListener("click", e => { if(e.target === modal) close(); });
});
document.addEventListener("keydown", e => {
  if(e.key === "Escape") document.querySelectorAll(".legal-modal.open").forEach(m => m.classList.remove("open"));
});


// Compact navigation dropdowns
document.querySelectorAll(".nav-dropdown-toggle").forEach(toggle => {
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const current = toggle.closest(".nav-dropdown");
    document.querySelectorAll(".nav-dropdown.open").forEach(item => {
      if (item !== current) {
        item.classList.remove("open");
        item.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded","false");
      }
    });
    const isOpen = current.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-dropdown")) {
    document.querySelectorAll(".nav-dropdown.open").forEach(item => {
      item.classList.remove("open");
      item.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded","false");
    });
  }
});

document.querySelectorAll(".nav-dropdown-menu a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-dropdown.open").forEach(item => {
      item.classList.remove("open");
      item.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded","false");
    });
  });
});

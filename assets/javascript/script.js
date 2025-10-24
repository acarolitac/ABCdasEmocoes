document.addEventListener("DOMContentLoaded", async () => {
  const PARTIALS_BASE = "/partials/";
  const ASSETS_BASE   = "/assets/";

  async function inject(targetId, url) {
    const holder = document.getElementById(targetId);
    if (!holder) { console.warn(`Holder #${targetId} não encontrado`); return; }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar ${url}`);
    holder.innerHTML = await res.text();
    console.log(`OK: ${url} injetado em #${targetId}`);
  }

  try { await inject("header-holder",   PARTIALS_BASE + "header.html"); } catch(e){ console.error("HEADER:", e); }
  try { await inject("footer-holder",   PARTIALS_BASE + "footer.html"); } catch(e){ console.error("FOOTER:", e); }
  try { await inject("whatsapp-holder", PARTIALS_BASE + "whatsapp.html"); } catch(e){ console.error("WPP:", e); }

  // depois que TUDO foi injetado:
  document.querySelectorAll("img[data-asset-src]").forEach(img => {
    img.src = ASSETS_BASE + img.dataset.assetSrc;
  });

  // interações do header
  const toggle = document.getElementById("menuToggle");
  const navbar = document.getElementById("navbar");
  if (toggle && navbar) {
    toggle.addEventListener("click", () => {
      const opened = navbar.classList.toggle("show");
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  });

  // link ativo
  const current = location.pathname;
  document.querySelectorAll(".navbar a").forEach(a => {
    if (a.getAttribute("href") === current) a.classList.add("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".contato-form");
  const whatsappInput = document.querySelector("#whatsapp");

  // === Máscara dinâmica para o campo de WhatsApp ===
  if (whatsappInput) {
    whatsappInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // remove tudo que não for número

      if (value.length > 11) value = value.slice(0, 11); // limita 11 dígitos

      if (value.length <= 10) {
        // formato (61) 9999-9999
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
      } else {
        // formato (61) 99999-9999
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
      }

      e.target.value = value.trim();
    });
  }

  // === Validação customizada do formulário ===
  if (form) {
    form.addEventListener("submit", (e) => {
      // impede envio automático
      if (!form.checkValidity()) {
        e.preventDefault();
        alert("Por favor, preencha todos os campos corretamente antes de enviar.");
        return;
      }

      // validação extra para WhatsApp
      const rawNumber = whatsappInput.value.replace(/\D/g, "");
      if (rawNumber.length < 10 || rawNumber.length > 11) {
        e.preventDefault();
        alert("Digite um número de WhatsApp válido, incluindo o DDD.");
        whatsappInput.focus();
        return;
      }

      // se quiser exibir mensagem de sucesso
      alert("Mensagem enviada com sucesso!");
    });
  }
});



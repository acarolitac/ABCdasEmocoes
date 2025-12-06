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

/* ---------- Modal JS (coloque no final do body) ---------- */
(function () {
  // Seletores
  const pills = document.querySelectorAll('.pill');
  // Mapeamento de conteúdo do modal por classe (editar textos conforme necessidade)
  const modalTexts = {
    'pill-1': {
      title: 'Educação emocional',

      text: 'Tendo como base os estudos de Daniel Goleman - o Pai da Inteligência Emocional, seus estudos impactaram positivamente na promoção da educação emocional desde a infância, destacando a importância das habilidades emocionais como autoconsciência, autogestão, empatia e habilidades sociais.'
    },
    'pill-2': {
      title: 'Neurociência da Educação',
      text: 'Apoiados nos estudos da Neurociência da Educação infantil que busca informar práticas pedagógicas mais eficazes, adaptadas ao desenvolvimento das crianças pequenas, e promover um ambiente de aprendizagem socioemocional que leve em consideração as necessidades específicas do cérebro nessa faixa etária.'
    },
    'pill-3': {
      title: 'Arte – Educação',
      text: 'A Arte-Educação é uma abordagem pedagógica que integra as artes visuais, música, dança e teatro ao currículo escolar das crianças. Com essa prática, nosso objetivo principal é estimular a expressão criativa, a imaginação, a sensibilidade estética e o desenvolvimento integral das crianças, promovendo o aprendizado por meio de experiências artísticas. A arte permite que as crianças expressem suas emoções de maneira saudável.'
    },
    'pill-4': {
      title: 'Pedagogia afetiva',
      text: 'Embasados nos estudos de Howard Gardner, que contribuiu significativamente para o desenvolvimento da Pedagogia Afetiva, destacando a importância das emoções, do relacionamento afetivo entre educadores e crianças e do ambiente emocionalmente seguro no processo de aprendizagem. Suas ideias influenciaram práticas educacionais que visam cultivar de ensino mais acolhedor e eficaz.'
    },
    'pill-5': {
      title: 'Psicologia positiva',
      text: 'A Psicologia Positiva se concentra no estudo e na promoção do bem-estar emocional, da felicidade e das forças humanas. Apoiados nos estudos de Martin Seligman - o Pai da Psicologia Positiva, cujo o trabalho enfatiza a importância do otimismo, do pensamento positivo, da resiliência e do florescimento humano.'
    }
  };

  // Cria o modal no DOM (apenas uma vez)
  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'pilaresModal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal__overlay" data-close></div>
      <div class="modal__dialog" role="document" aria-labelledby="pilaresModalTitle" tabindex="-1">
        <button class="modal__close" aria-label="Fechar modal">&times;</button>
        <h3 class="modal__title" id="pilaresModalTitle"></h3>
        <div class="modal__content" id="pilaresModalContent"></div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  const modal = createModal();
  const overlay = modal.querySelector('.modal__overlay');
  const dialog = modal.querySelector('.modal__dialog');
  const closeBtn = modal.querySelector('.modal__close');
  const titleEl = modal.querySelector('#pilaresModalTitle');
  const contentEl = modal.querySelector('#pilaresModalContent');

  let lastFocused = null;

  // Abre o modal com conteúdo (recebe objeto {title, text})
  function openModal({ title, text }) {
    lastFocused = document.activeElement;
    titleEl.textContent = title;
    contentEl.textContent = text;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // foco no dialog (para screen readers e teclado)
    // busca elementos focáveis dentro do modal
    const focusable = getFocusableElements();
    if (focusable.length) {
      focusable[0].focus();
    } else {
      dialog.focus();
    }

    document.addEventListener('keydown', onKeyDown);
  }

  // Fecha o modal
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeyDown);
    // restaura foco
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  // Retorna elementos focáveis dentro do modal
  function getFocusableElements() {
    const selector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    return Array.from(modal.querySelectorAll(selector)).filter(el => el.offsetParent !== null);
  }

  // Mantém o foco dentro do modal (trap)
  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = getFocusableElements();
    if (!focusable.length) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  // Keydown handler para ESC e tab trap
  function onKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'Tab') {
      trapFocus(e);
    }
  }

  // Evento: clique nas pills
  pills.forEach((pill) => {
    pill.style.cursor = 'pointer'; // indica que é clicável (pode remover se não quiser)
    pill.addEventListener('click', () => {
      // identifica a classe pill-1..pill-5
      const classes = Array.from(pill.classList);
      const pillClass = classes.find(c => /^pill-\d+$/.test(c));
      const content = modalTexts[pillClass] || { title: pill.textContent.trim(), text: 'Conteúdo em manutenção.' };
      openModal(content);
    });

    // acessibilidade: abre modal ao pressionar Enter/Space quando a pill estiver focada
    pill.setAttribute('tabindex', '0');
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pill.click();
      }
    });
  });

  // Eventos de fechamento
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // fecha se clicar fora do dialog interno (em navegadores que não capturam overlay)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
})();




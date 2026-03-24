// layout.js
// Gestiona: modo oscuro, menú hamburguesa, dropdown desktop (tabs),
// acordeón móvil, selector de idioma, cookies y animación de cards.

document.addEventListener("DOMContentLoaded", () => {

  // ── MODO OSCURO ────────────────────────────────────────────────────────────
  const darkBtn = document.getElementById('theme-toggle');
  const isDark = localStorage.getItem('theme') === 'dark';
  if (darkBtn) {
    darkBtn.textContent = isDark ? '🌙' : '☀️';
    darkBtn.classList.add('ready');
  }

  darkBtn?.addEventListener('click', () => {
    const nowDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', nowDark ? 'dark' : 'light');
    if (darkBtn) darkBtn.textContent = nowDark ? '🌙' : '☀️';
  });

  // ── MENÚ HAMBURGUESA ───────────────────────────────────────────────────────
  const header = document.querySelector('header');
  if (!header) return;

  const menuToggle      = header.querySelector('.menu-toggle');
  const menuClose       = header.querySelector('.menu-close-btn');
  const mainNav         = header.querySelector('.main-nav');
  const dropbtn         = header.querySelector('.dropbtn');
  const dropdownContent = header.querySelector('.dropdown-content');

  menuToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    mainNav.classList.add('active');
    menuToggle.style.display = 'none';
  });

  menuClose?.addEventListener('click', (e) => {
    e.preventDefault();
    mainNav.classList.remove('active');
    menuToggle.style.display = 'block';
    dropdownContent?.classList.remove('show');
  });

  // ── DROPDOWN: abrir / cerrar ───────────────────────────────────────────────
  if (dropbtn && dropdownContent) {
    dropbtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownContent.classList.toggle('show');

      if (isOpen && isDesktop()) {
        const firstTab = header.querySelector('.dropdown-tab');
        if (firstTab && !header.querySelector('.dropdown-tab.active')) {
          activateTab(firstTab.dataset.tab);
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!dropdownContent.contains(e.target) && !dropbtn.contains(e.target)) {
        dropdownContent.classList.remove('show');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dropdownContent.classList.remove('show');
    });
  }

  // ── DESKTOP: TABS ──────────────────────────────────────────────────────────
  const firstTab = header.querySelector('.dropdown-tab');
  if (firstTab && window.innerWidth >= 993) activateTab(firstTab.dataset.tab);

  header.querySelectorAll('.dropdown-tab').forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  function activateTab(catKey) {
    header.querySelectorAll('.dropdown-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === catKey);
    });
    header.querySelectorAll('.dropdown-column').forEach(col => {
      col.classList.toggle('column-active', col.dataset.cat === catKey);
    });
  }

  // ── MÓVIL: ACORDEÓN ────────────────────────────────────────────────────────
  header.querySelectorAll('.dropdown-column h3').forEach(h3 => {
    h3.addEventListener('click', (e) => {
      if (isDesktop()) return;
      e.stopPropagation();
      const col = h3.closest('.dropdown-column');
      const wasActive = col.classList.contains('column-active');
      header.querySelectorAll('.dropdown-column').forEach(c => c.classList.remove('column-active'));
      if (!wasActive) col.classList.add('column-active');
    });
  });

  // ── SELECTOR DE IDIOMA ─────────────────────────────────────────────────────
  const langSwitcher = document.getElementById('lang-switcher');
  const langModal    = document.getElementById('lang-modal');
  const langModalConfirm = document.getElementById('lang-modal-confirm');
  const langModalCancel  = document.getElementById('lang-modal-cancel');

  if (langSwitcher) {
    let currentValue = langSwitcher.value;
    let pendingDest  = null;

    const closeLangModal = () => {
      langModal?.classList.remove('modal-visible');
      pendingDest = null;
    };

    langSwitcher.addEventListener('change', (e) => {
      const dest = e.target.value;

      if (dest.includes('alert=not-found')) {
        pendingDest = dest.split('?')[0]; // home del idioma destino
        langModal?.classList.add('modal-visible');
        // Restaurar visualmente el selector al idioma actual
        e.target.value = currentValue;
      } else {
        currentValue = dest;
        window.location.href = dest;
      }
    });

    // Confirmar → ir al home del idioma destino
    langModalConfirm?.addEventListener('click', () => {
      if (pendingDest) window.location.href = pendingDest;
      closeLangModal();
    });

    // Cancelar → cerrar modal, quedarse en la página actual
    langModalCancel?.addEventListener('click', closeLangModal);

    // Cerrar al clicar el overlay fuera de la modal
    langModal?.addEventListener('click', (e) => {
      if (e.target === langModal) closeLangModal();
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLangModal();
    });
  }

  // ── COOKIES ────────────────────────────────────────────────────────────────
  const banner       = document.getElementById('cookie-banner');
  const mainView     = document.getElementById('cookie-main-view');
  const settingsView = document.getElementById('cookie-settings-view');
  const cerrarBanner = () => { if (banner) banner.style.display = 'none'; };

  document.getElementById('open-cookie-settings-footer')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (banner) {
      banner.style.display = 'flex';
      if (mainView)     mainView.style.display = 'block';
      if (settingsView) settingsView.style.display = 'none';
    }
  });

  document.getElementById('btn-accept-all')?.addEventListener('click', () => {
    localStorage.setItem('cookies-accepted', 'all');
    cerrarBanner();
  });

  document.getElementById('btn-reject-all')?.addEventListener('click', () => {
    localStorage.setItem('cookies-accepted', 'none');
    cerrarBanner();
  });

  document.getElementById('btn-open-settings')?.addEventListener('click', () => {
    if (mainView)     mainView.style.display = 'none';
    if (settingsView) settingsView.style.display = 'block';
  });

  document.getElementById('btn-back')?.addEventListener('click', () => {
    if (settingsView) settingsView.style.display = 'none';
    if (mainView)     mainView.style.display = 'block';
  });

  document.getElementById('btn-save-settings')?.addEventListener('click', () => {
    const analytics = document.getElementById('check-analytics')?.checked;
    const marketing = document.getElementById('check-marketing')?.checked;
    localStorage.setItem('cookies-pref', JSON.stringify({ analytics, marketing }));
    cerrarBanner();
  });

  if (localStorage.getItem('cookies-accepted') || localStorage.getItem('cookies-pref')) {
    cerrarBanner();
  }

  // ── CARDS: animación de entrada ────────────────────────────────────────────
  const container = document.querySelector('.cards-container');
  if (container) {
    requestAnimationFrame(() => container.classList.add('is-ready'));
  }

  // ── HELPER ─────────────────────────────────────────────────────────────────
  function isDesktop() {
    return window.innerWidth >= 993;
  }

});
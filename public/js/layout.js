document.addEventListener("DOMContentLoaded", () => {

    // --- MODO OSCURO ---

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


  // --- MENÚ HAMBURGUESA ---
  const header = document.querySelector('header');
  if (header) {
    const menuToggle = header.querySelector('.menu-toggle');
    const menuClose = header.querySelector('.menu-close-btn');
    const mainNav = header.querySelector('.main-nav');

    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        mainNav.classList.add('active');
        menuToggle.style.display = 'none';
      });
    }

    if (menuClose && mainNav) {
      menuClose.addEventListener('click', (e) => {
        e.preventDefault();
        mainNav.classList.remove('active');
        menuToggle.style.display = 'block';
      });
    }

    // --- MEGA DROPDOWN & ACORDEÓN MÓVIL ---
    const dropbtn = header.querySelector('.dropbtn');
    const dropdownContent = header.querySelector('.dropdown-content');
    const columnTitles = header.querySelectorAll('.dropdown-column h3');

    if (dropbtn && dropdownContent) {
      dropbtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!dropdownContent.contains(e.target) && !dropbtn.contains(e.target)) {
          dropdownContent.classList.remove('show');
        }
      });

      columnTitles.forEach(title => {
        title.addEventListener('click', (e) => {
          if (window.innerWidth <= 992) {
            e.stopPropagation();
            const parent = title.parentElement;
            const wasActive = parent.classList.contains('column-active');
            header.querySelectorAll('.dropdown-column').forEach(col => {
              col.classList.remove('column-active');
            });
            if (!wasActive) parent.classList.add('column-active');
          }
        });
      });
    }
  }

  // --- LÓGICA DE COOKIES ---
  const banner = document.getElementById('cookie-banner');
  const mainView = document.getElementById('cookie-main-view');
  const settingsView = document.getElementById('cookie-settings-view');
  const cerrarBanner = () => { if (banner) banner.style.display = 'none'; };

  const footerCookieBtn = document.getElementById('open-cookie-settings-footer');
  if (footerCookieBtn) {
    footerCookieBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (banner) {
        banner.style.display = 'flex';
        if (mainView) mainView.style.display = 'block';
        if (settingsView) settingsView.style.display = 'none';
      }
    });
  }

  document.getElementById('btn-accept-all')?.addEventListener('click', () => {
    localStorage.setItem('cookies-accepted', 'all');
    cerrarBanner();
  });

  document.getElementById('btn-reject-all')?.addEventListener('click', () => {
    localStorage.setItem('cookies-accepted', 'none');
    cerrarBanner();
  });

  document.getElementById('btn-open-settings')?.addEventListener('click', () => {
    if (mainView) mainView.style.display = 'none';
    if (settingsView) settingsView.style.display = 'block';
  });

  document.getElementById('btn-back')?.addEventListener('click', () => {
    if (settingsView) settingsView.style.display = 'none';
    if (mainView) mainView.style.display = 'block';
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

  // --- CARDS (Reordenar nuevas) ---
  const container = document.querySelector('.cards-container');
  const cardNueva = document.querySelector('.card.nuevo');
  if (container) {
    if (cardNueva) container.prepend(cardNueva);
    requestAnimationFrame(() => container.classList.add('is-ready'));
  }

});
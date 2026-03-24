// ==================== CONFIGURACIÓN DE GTM (DELAYED) ====================
function loadGTM() {
  if (window.gtmLoaded) return;
  window.gtmLoaded = true;

  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-TC6PKX2V');
}

// ==================== BANNER DE COOKIES ====================
document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('cookie-banner');
  const mainView = document.getElementById('cookie-main-view');
  const settingsView = document.getElementById('cookie-settings-view');
  const openSettingsBtn = document.getElementById('open-cookie-settings-footer');

  const savedConsent = JSON.parse(localStorage.getItem('cookie_consent_v1'));

  if (savedConsent) {
    const savedDate = new Date(savedConsent.date);
    const monthsDiff = (new Date() - savedDate) / (1000 * 60 * 60 * 24 * 30);

    if (monthsDiff > 6) {
      localStorage.removeItem('cookie_consent_v1');
      if (banner) banner.style.display = 'flex';
    } else {
      activateScripts(savedConsent);
    }
  } else {
    if (banner) banner.style.display = 'flex';
  }

  // --- CARGA INTELIGENTE GTM (PageSpeed Boost) ---
  // Usa requestIdleCallback si está disponible (espera a que el navegador esté libre),
  // con fallback a setTimeout. Los eventos de interacción lo disparan antes si el
  // usuario ya está interactuando con la página.
  if (savedConsent && savedConsent.analytics) {
    const triggerEvents = ['touchstart', 'scroll', 'mouseover', 'keydown'];
    let idleHandle;

    const doLoad = () => {
      if ('requestIdleCallback' in window) {
        cancelIdleCallback(idleHandle);
      } else {
        clearTimeout(idleHandle);
      }
      loadGTM();
    };

    idleHandle = 'requestIdleCallback' in window
      ? requestIdleCallback(doLoad, { timeout: 3500 })
      : setTimeout(loadGTM, 3500);

    triggerEvents.forEach(event => {
      window.addEventListener(event, doLoad, { once: true, passive: true });
    });
  }

  // --- NAVEGACIÓN DE BANNER ---
  document.getElementById('btn-open-settings')?.addEventListener('click', () => {
    if (mainView && settingsView) {
      mainView.style.display = 'none';
      settingsView.style.display = 'block';
    }
  });

  document.getElementById('btn-back')?.addEventListener('click', () => {
    if (mainView && settingsView) {
      mainView.style.display = 'block';
      settingsView.style.display = 'none';
    }
  });

  document.getElementById('btn-accept-all')?.addEventListener('click', () => saveAndApply(true, true));
  document.getElementById('btn-reject-all')?.addEventListener('click', () => saveAndApply(false, false));

  document.getElementById('btn-save-settings')?.addEventListener('click', () => {
    const ana = document.getElementById('check-analytics')?.checked || false;
    const mark = document.getElementById('check-marketing')?.checked || false;
    saveAndApply(ana, mark);
  });

  function saveAndApply(analytics, marketing) {
    const prevConsent = JSON.parse(localStorage.getItem('cookie_consent_v1'));
    const consent = { analytics, marketing, date: new Date().toISOString() };

    localStorage.setItem('cookie_consent_v1', JSON.stringify(consent));
    if (banner) banner.style.display = 'none';

    if (prevConsent && ((prevConsent.analytics && !analytics) || (prevConsent.marketing && !marketing))) {
      location.reload();
    } else {
      activateScripts(consent);
      if (analytics) loadGTM();
    }
  }

  openSettingsBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (banner && mainView && settingsView) {
      banner.style.display = 'flex';
      mainView.style.display = 'none';
      settingsView.style.display = 'block';
      const current = JSON.parse(localStorage.getItem('cookie_consent_v1'));
      if (current) {
        const anaCheck = document.getElementById('check-analytics');
        const markCheck = document.getElementById('check-marketing');
        if (anaCheck) anaCheck.checked = current.analytics;
        if (markCheck) markCheck.checked = current.marketing;
      }
    }
  });
});

function activateScripts(consent) {
  const scripts = document.querySelectorAll('script[type="text/plain"][data-cookie-category]');
  scripts.forEach(script => {
    const category = script.getAttribute('data-cookie-category');
    if (consent[category] === true) {
      if (script.src.includes('googletagmanager')) {
        loadGTM();
      } else {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach(attr => {
          if (attr.name !== 'type' && attr.name !== 'data-cookie-category') {
            newScript.setAttribute(attr.name, attr.value);
          }
        });
        if (script.innerHTML) newScript.innerHTML = script.innerHTML;
        document.head.appendChild(newScript);
      }
      script.remove();
    }
  });
}

// ==================== RIBBON "NUEVO" ====================
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card-link[data-fecha]');
  const HOY = new Date();
  const DIAS_PARA_CADUCAR = 14;

  cards.forEach(card => {
    const fechaAttr = card.getAttribute('data-fecha');
    if (!fechaAttr) return;

    const fechaPublicacion = new Date(fechaAttr);
    const diferenciaDias = (HOY - fechaPublicacion) / (1000 * 60 * 60 * 24);

    if (diferenciaDias >= 0 && diferenciaDias <= DIAS_PARA_CADUCAR) {
      card.setAttribute('data-estado', 'nuevo');
    } else {
      card.removeAttribute('data-estado');
    }
  });
});

// ==================== VALIDACIÓN DE INPUTS ====================
function validarNumeros(inputs) {
  return inputs.every(input => {
    const valor = input.value.replace(',', '.').trim();
    return valor !== '' && !isNaN(Number(valor)) && isFinite(Number(valor));
  });
}


// ==================== ADBLOCK DETECTOR ====================
// Descomenta este bloque cuando actives Google AdSense
//
// function inyectarBannerAdblock() {
//   const bannerHTML = `
//     <div id="adblock-banner" class="adblock-msg">
//       <div class="adblock-content">
//         <span class="adblock-icon">☕</span>
//         <p><strong>¡Hola!</strong> Los anuncios mantienen gratis estas herramientas.
//         Si te sirven, considera desactivar tu bloqueador. ¡Gracias!</p>
//         <button id="close-adblock" class="adblock-close">Vale</button>
//       </div>
//     </div>`;
//   document.body.insertAdjacentHTML('beforeend', bannerHTML);
//   document.getElementById('close-adblock').addEventListener('click', (e) => {
//     e.target.closest('.adblock-msg').remove();
//     sessionStorage.setItem('adblock_msg_dismissed', 'true');
//   });
// }
//
// setTimeout(() => {
//   const yaCerrado = sessionStorage.getItem('adblock_msg_dismissed');
//   if (window.canRunAds === undefined && !yaCerrado) {
//     inyectarBannerAdblock();
//   }
// }, 30000);
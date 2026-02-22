// ==================== CONFIGURACIÓN DE GTM (DELAYED) ====================
// Esta función carga GTM solo cuando es necesario
function loadGTM() {
    if (window.gtmLoaded) return;
    window.gtmLoaded = true;

    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TC6PKX2V');
}

// ==================== MODO OSCURO ====================
const toggleDark = document.getElementById('dark-toggle');
toggleDark?.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

// ==================== BANNER DE COOKIES ====================
document.addEventListener("DOMContentLoaded", () => {
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

    // --- LOGICA DE CARGA INTELIGENTE (PageSpeed Boost) ---
    // Si ya hay consentimiento, esperamos a la interacción para cargar GTM
    if (savedConsent && savedConsent.analytics) {
        const triggerEvents = ['touchstart', 'scroll', 'mouseover', 'keydown'];
        const idleTimer = setTimeout(loadGTM, 3500); // Carga tras 3.5s de inactividad

        triggerEvents.forEach(event => {
            window.addEventListener(event, () => {
                clearTimeout(idleTimer);
                loadGTM();
            }, { once: true, passive: true });
        });
    }

    // --- NAVEGACIÓN Y EVENTOS ---
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
          if (analytics) loadGTM(); // Si acepta ahora, cargamos GTM
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
                if (document.getElementById('check-analytics')) document.getElementById('check-analytics').checked = current.analytics;
                if (document.getElementById('check-marketing')) document.getElementById('check-marketing').checked = current.marketing;
            }
        }
    });
});

function activateScripts(consent) {
  const scripts = document.querySelectorAll('script[type="text/plain"][data-cookie-category]');
  scripts.forEach(script => {
      const category = script.getAttribute('data-cookie-category');
      if (consent[category] === true) {
          // Si es GTM, usamos nuestra función optimizada en lugar de crear un nodo nuevo
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

// ==================== GESTIÓN DE RIBBON "NUEVO" ====================
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card-link[data-fecha]');
    const HOY = new Date();
    const DIAS_PARA_CADUCAR = 14;

    cards.forEach(card => {
        const fechaAttr = card.getAttribute('data-fecha');
        if (!fechaAttr) return;

        const fechaPublicacion = new Date(fechaAttr);
        
        // Calculamos la diferencia en días
        const diferenciaDias = (HOY - fechaPublicacion) / (1000 * 60 * 60 * 24);

        // Si la diferencia es positiva (no es futuro) y tiene menos de 14 días
        if (diferenciaDias >= 0 && diferenciaDias <= DIAS_PARA_CADUCAR) {
            card.setAttribute('data-estado', 'nuevo');
        } else {
            card.removeAttribute('data-estado');
        }
    });
});

// Declaración global limpia
function validarNumeros(inputs) {
    return inputs.every(input => {
        // Soporte para comas y puntos decimales
        const valor = input.value.replace(',', '.').trim();
        return valor !== "" && !isNaN(Number(valor)) && isFinite(Number(valor));
    });
}

/**
 * Lógica del Selector de Idioma
 */
document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.querySelector('.lang-selector select');
    
    if (langSelect) {
        // 1. Detectar idioma por la URL y marcar el 'selected'
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/en/')) {
            langSelect.value = '/en/';
        } else {
            langSelect.value = '/es/';
        }

        // 2. Gestionar el cambio de idioma
        langSelect.addEventListener('change', (e) => {
            const targetPath = e.target.value;
            
            // Solo redirige si es una ruta distinta a la actual
            if (!window.location.pathname.startsWith(targetPath)) {
                window.location.href = targetPath;
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const sw = document.getElementById('lang-switcher');
    
    if (sw) {
        // 1. FORZAR RENDERIZADO: El navegador a veces ignora el atributo HTML 'selected'.
        // Buscamos la opción que tiene el atributo y forzamos el valor del select.
        const selectedOpt = sw.querySelector('option[selected]');
        if (selectedOpt) {
            sw.value = selectedOpt.value;
        }

        // 2. ESCUCHADOR DE CAMBIOS:
        sw.addEventListener('change', function() {
            const dest = this.value;
            if (dest.includes('alert=not-found')) {
                // Aquí usamos una cadena de texto fija o un data-attribute si quieres traducirlo
                const msg = "This tool is not available in this language. Go to Home?";
                if (confirm(msg)) {
                    window.location.href = dest;
                } else {
                    this.value = window.location.pathname;
                }
            } else {
                window.location.href = dest;
            }
        });

        // 3. TRUCO FINAL: Un pequeño "toque" al estilo para forzar el repintado
        sw.style.display = 'inline-block';
    }
});
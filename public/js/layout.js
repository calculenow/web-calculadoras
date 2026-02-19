document.addEventListener("DOMContentLoaded", () => {
    // 1. DEFINICIÓN DE HTML
//     const navHTML = `
//         <button class="menu-toggle">Menu</button>
        
//         <nav class="main-nav">
//         <div class="search-box">
//             <input type="text" 
//                    id="calc-search" 
//                    placeholder="Buscar..." 
//                    autocomplete="off" 
//                    class="search-input">
//             <ul id="search-results" class="search-dropdown"></ul>
//         </div>
//             <a href="/">Inicio</a>
//             <div class="dropdown">
//                 <button class="dropbtn" aria-haspopup="true">Herramientas ▼</button>
//                 <div class="dropdown-content">
//                     <a href="/calculadora-porcentajes">📊 Porcentajes</a>
//                     <a href="/calculadora-descuentos">🏷️ Descuentos</a>
//                     <a href="/calculadora-propinas">☕ Propinas</a>
//                     <a href="/calculadora-iva">💶 IVA</a>
//                     <a href="/calculadora-divisas">💱 Cambio de Divisas</a>
//                     <a href="/calculadora-prestamos">🏦 Préstamos e Hipotecas</a>
//                     <a href="/calculadora-imc">⚖️ IMC</a>
//                     <a href="/calculadora-calorias">🔥 Calorías (TMB)</a>
//                     <a href="/validador-dni">🪪 Validador DNI/NIE</a>
//                 </div>
//             </div>
//             <a href="/contacto">Contacto</a>
//             <button class="toggle-dark-inline" id="theme-toggle" aria-label="Cambiar modo de color">
//   🌙 Modo Oscuro
// </button>
//         </nav>
//     `;

    // const footerHTML = `
    //     <div class="footer-links">
    //         <a href="/aviso-legal">Aviso legal</a> ·
    //         <a href="/privacidad">Privacidad</a> ·
    //         <a href="/cookies">Cookies</a> ·
    //         <a href="#" id="open-cookie-settings-footer">Configuración de Cookies</a> ·
    //         <a href="/contacto">Contacto</a>
    //     </div>
    //     <p>&copy; 2026 Calculenow. Todos los derechos reservados.</p>
    // `;

    // 2. INYECCIÓN Y ASIGNACIÓN DE EVENTOS INMEDIATOS
    const header = document.querySelector('header');
    if (header) {
       // header.innerHTML = navHTML;

        // --- LÓGICA MENÚ MÓVIL ---
        const menuToggle = header.querySelector('.menu-toggle');
        const mainNav = header.querySelector('.main-nav');

        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                mainNav.classList.toggle('active');
                menuToggle.textContent = mainNav.classList.contains('active') ? '✕ Cerrar' : 'Menu';
            });
        }

        // --- LÓGICA DROPDOWN (Herramientas) ---
        const dropbtn = header.querySelector('.dropbtn');
        const dropdownContent = header.querySelector('.dropdown-content');

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
        }

        // --- LÓGICA MODO OSCURO ---
        // Busca el botón en todo el documento por ID o por Clase
const darkBtn = document.querySelector('#dark-toggle') || document.querySelector('.toggle-dark-inline');

const applyTheme = (isDark) => {
    // Es mejor aplicarlo al documentElement (HTML) para que el CSS sea más consistente
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    
    if (darkBtn) {
        // Actualizamos el icono o texto
        darkBtn.textContent = isDark ? '☀️' : '🌙';
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Carga inicial
if (localStorage.getItem('theme') === 'dark') {
    applyTheme(true);
}

// Evento de clic
if (darkBtn) {
    darkBtn.addEventListener('click', () => {
        const isDark = !document.documentElement.classList.contains('dark');
        applyTheme(isDark);
    });
}
    }

    // const footer = document.querySelector('footer');
    // if (footer) footer.innerHTML = footerHTML;

    // 3. LÓGICA DE COOKIES (Sin cambios)
    const banner = document.getElementById('cookie-banner');
    const mainView = document.getElementById('cookie-main-view');
    const settingsView = document.getElementById('cookie-settings-view');

    const cerrarBanner = () => { if(banner) banner.style.display = 'none'; };

    const footerCookieBtn = document.getElementById('open-cookie-settings-footer');
    if (footerCookieBtn) {
        footerCookieBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(banner) {
                banner.style.display = 'flex';
                if(mainView) mainView.style.display = 'block';
                if(settingsView) settingsView.style.display = 'none';
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
        if(mainView) mainView.style.display = 'none';
        if(settingsView) settingsView.style.display = 'block';
    });

    document.getElementById('btn-back')?.addEventListener('click', () => {
        if(settingsView) settingsView.style.display = 'none';
        if(mainView) mainView.style.display = 'block';
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
});

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.cards-container');
    const cardNueva = document.querySelector('.card.nuevo'); // O la de Préstamos

    if (container && cardNueva) {
        // 1. Movemos la card al principio del contenedor
        container.prepend(cardNueva);

        // 2. Forzamos un pequeño "reflow" para que el navegador asimile el cambio
        // y luego activamos la visibilidad
        requestAnimationFrame(() => {
            container.classList.add('is-ready');
        });
    } else if (container) {
        // Si no hay ninguna card nueva que mover, lo mostramos igual
        container.classList.add('is-ready');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Función para crear el banner
    const inyectarBannerAdblock = () => {
        const bannerHTML = `
            <div id="adblock-banner" class="adblock-msg">
                <div class="adblock-content">
                    <span class="adblock-icon">☕</span>
                    <p><strong>¡Hola!</strong> Los anuncios mantienen gratis estas herramientas. Si te sirven, considera desactivar tu bloqueador. ¡Gracias!</p>
                    <button id="close-adblock" class="adblock-close">Vale</button>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        // Al hacer clic en cerrar, guardamos la preferencia
        document.getElementById('close-adblock').addEventListener('click', (e) => {
            e.target.closest('.adblock-msg').remove();
            sessionStorage.setItem('adblock_msg_dismissed', 'true');
        });
    };

    const tiempoDeEspera = 30000; // 30 segundos
    
    setTimeout(() => {
        // 2. Comprobamos 3 cosas: 
        // - Si canRunAds no existe (bloqueo)
        // - Si el usuario NO lo ha cerrado ya en esta sesión
        const yaCerrado = sessionStorage.getItem('adblock_msg_dismissed');

        if (window.canRunAds === undefined && !yaCerrado) {
            inyectarBannerAdblock();
            
            const banner = document.getElementById('adblock-banner');
            if (banner) {
                banner.style.display = 'block';
                console.log("Psst... un cafelito para el autor no vendría mal ☕");
            }
        }
    }, tiempoDeEspera);
});
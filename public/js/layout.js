document.addEventListener("DOMContentLoaded", () => {
    // 1. DEFINICIÓN DE HTML (Nav & Mega Menú con doble botón para móvil)
//     const navHTML = `
//         <button class="menu-toggle">Menu</button>

// <nav class="main-nav">
//     <button class="menu-close-btn">✕ Cerrar</button>
    
//     <div class="nav-center-group">
//         <div class="nav-links">
//             <a href="/es">Inicio</a>
//             <div class="dropdown">
//                 <button class="dropbtn">Herramientas ▼</button>
//                 <div class="dropdown-content">
//                     <div class="dropdown-column">
//                         <h3>Finanzas</h3>
//                         <ul>
//                             <li><a href="/es/calculadora-iva">💶 IVA</a></li>
//                             <li><a href="/es/calculadora-descuentos">🏷️ Descuentos</a></li>
//                             <li><a href="/es/calculadora-propinas">☕ Propinas</a></li>
//                             <li><a href="/es/calculadora-prestamos">🏦 Préstamos</a></li>
//                             <li><a href="/es/calculadora-divisas">💱 Divisas</a></li>
//                             <li><a href="/es/calculadora-interes-compuesto">📈 Interés</a></li>
//                         </ul>
//                     </div>
//                     <div class="dropdown-column">
//                         <h3>Salud y Mates</h3>
//                         <ul>
//                             <li><a href="/es/calculadora-imc">⚖️ IMC</a></li>
//                             <li><a href="/es/calculadora-calorias">🔥 Calorías (TMB)</a></li>
//                             <li><a href="/es/calculadora-hidratacion">💧 Hidratación</a></li>
//                             <li><a href="/es/calculadora-porcentajes">📊 Porcentajes</a></li>
//                         </ul>
//                     </div>
//                     <div class="dropdown-column">
//                         <h3>Administración</h3>
//                         <ul><li><a href="/es/validador-dni">🪪 DNI</a></li></ul>
//                     </div>
//                     <div class="dropdown-column">
//                         <h3>Utilidades</h3>
//                         <ul><li><a href="/es/calculadora-conversion">📐 Conversor</a></li></ul>
//                     </div>
//                 </div>
//             </div>
//             <a href="/es/contacto">Contacto</a>
//         </div>

//         <div class="search-box">
//             <input type="text" id="calc-search" placeholder="Buscar..." autocomplete="off" class="search-input">
//             <ul id="search-results" class="search-dropdown"></ul>
//         </div>
//     </div>

//     <div class="nav-controls">
//         <div class="lang-selector">
//     <select onchange="window.location.href=this.value">
//         <option value="/es/">🇪🇸 Español</option>
//         <option value="/en/">🇬🇧 English</option>
//     </select>
// </div>
//         <button class="toggle-dark-inline" id="theme-toggle">☀️</button>
//     </div>
// </nav>
//     `;

    // 2. INYECCIÓN Y LÓGICA DE NAVEGACIÓN
    const header = document.querySelector('header');
    if (header) {
     //   header.innerHTML = navHTML;

        // --- LÓGICA MENÚ HAMBURGUESA (Doble Botón) ---
        const menuToggle = header.querySelector('.menu-toggle');      // Botón "Menu" (Abrir)
        const menuClose = header.querySelector('.menu-close-btn');    // Botón "✕ Cerrar" (Cerrar)
        const mainNav = header.querySelector('.main-nav');

        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                mainNav.classList.add('active');
                menuToggle.style.display = 'none'; // Ocultamos el botón de abrir
            });
        }

        if (menuClose && mainNav) {
            menuClose.addEventListener('click', (e) => {
                e.preventDefault();
                mainNav.classList.remove('active');
                menuToggle.style.display = 'block'; // Mostramos el botón de abrir de nuevo
            });
        }

        // --- LÓGICA MEGA DROPDOWN & ACORDEÓN ---
        const dropbtn = header.querySelector('.dropbtn');
        const dropdownContent = header.querySelector('.dropdown-content');
        const columnTitles = header.querySelectorAll('.dropdown-column h3');

        if (dropbtn && dropdownContent) {
            // Abrir dropdown principal
            dropbtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownContent.classList.toggle('show');
            });

            // Cerrar al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!dropdownContent.contains(e.target) && !dropbtn.contains(e.target)) {
                    dropdownContent.classList.remove('show');
                }
            });

            // Acordeón interno para móvil
            columnTitles.forEach(title => {
                title.addEventListener('click', (e) => {
                    if (window.innerWidth <= 992) {
                        e.stopPropagation();
                        const parent = title.parentElement;
                        const wasActive = parent.classList.contains('column-active');

                        // Cerrar otros
                        header.querySelectorAll('.dropdown-column').forEach(col => {
                            col.classList.remove('column-active');
                        });

                        // Abrir actual
                        if (!wasActive) {
                            parent.classList.add('column-active');
                        }
                    }
                });
            });
        }

        // --- LÓGICA MODO OSCURO ---
        const darkBtn = document.querySelector('#dark-toggle') || document.querySelector('.toggle-dark-inline');
        const applyTheme = (isDark) => {
            document.documentElement.classList.toggle('dark', isDark);
            document.body.classList.toggle('dark', isDark);
            if (darkBtn) darkBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };

        if (localStorage.getItem('theme') === 'dark') applyTheme(true);
        if (darkBtn) {
            darkBtn.addEventListener('click', () => {
                const isDark = !document.documentElement.classList.contains('dark');
                applyTheme(isDark);
            });
        }
    }

    // 3. LÓGICA DE COOKIES
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

    // 4. LÓGICA DE CARDS (Reordenar nuevas)
    const container = document.querySelector('.cards-container');
    const cardNueva = document.querySelector('.card.nuevo');
    if (container) {
        if (cardNueva) container.prepend(cardNueva);
        requestAnimationFrame(() => container.classList.add('is-ready'));
    }

    // 5. LÓGICA ADBLOCK (Aviso después de 30s)
    // const inyectarBannerAdblock = () => {
    //     const bannerHTML = `
    //         <div id="adblock-banner" class="adblock-msg">
    //             <div class="adblock-content">
    //                 <span class="adblock-icon">☕</span>
    //                 <p><strong>¡Hola!</strong> Los anuncios mantienen gratis estas herramientas. Si te sirven, considera desactivar tu bloqueador. ¡Gracias!</p>
    //                 <button id="close-adblock" class="adblock-close">Vale</button>
    //             </div>
    //         </div>`;
    //     document.body.insertAdjacentHTML('beforeend', bannerHTML);
    //     document.getElementById('close-adblock').addEventListener('click', (e) => {
    //         e.target.closest('.adblock-msg').remove();
    //         sessionStorage.setItem('adblock_msg_dismissed', 'true');
    //     });
    // };

    setTimeout(() => {
        const yaCerrado = sessionStorage.getItem('adblock_msg_dismissed');
        if (window.canRunAds === undefined && !yaCerrado) {
            inyectarBannerAdblock();
            const adBanner = document.getElementById('adblock-banner');
            if (adBanner) adBanner.style.display = 'block';
        }
    }, 30000);
});
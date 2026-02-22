import { i18n } from "./data/translations.js";

export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const html = await response.text();
  const url = new URL(request.url);
  const currentPath = url.pathname;

  // 1. Detectar idioma actual (es, en, fr...) basado en la primera carpeta de la URL
  const langPath = currentPath.split('/').filter(Boolean)[0] || 'en';
  const t = i18n[langPath] || i18n.en;

  // 2. Lógica de redirección (Encuentra la misma herramienta en otro idioma)
  const getTargetUrl = (targetLangCode) => {
    const targetI18n = i18n[targetLangCode];
    
    // Unificamos todos los links para buscar el ID actual
    const currentAllLinks = [
      ...Object.values(t.links).flat(),
      ...t.footer.links,
      { id: "home", url: t.homeUrl },
      { id: "contact", url: t.contactUrl }
    ];

    const currentItem = currentAllLinks.find(l => l.url === currentPath);
    if (!currentItem) return targetI18n.homeUrl;

    const targetAllLinks = [
      ...Object.values(targetI18n.links).flat(),
      ...targetI18n.footer.links,
      { id: "home", url: targetI18n.homeUrl },
      { id: "contact", url: targetI18n.contactUrl }
    ];

    const match = targetAllLinks.find(l => l.id === currentItem.id);
    return match ? match.url : `${targetI18n.homeUrl}?alert=not-found`;
  };

  // 3. GENERACIÓN DINÁMICA DEL SELECTOR (Aquí está la escalabilidad)
  const langOptions = Object.keys(i18n).map(code => {
    const labelKey = `lang${code.charAt(0).toUpperCase() + code.slice(1)}`; // langEs, langEn...
    return {
      code,
      name: t[labelKey] || code.toUpperCase(),
      url: getTargetUrl(code)
    };
  });

  const renderColumn = (catKey) => {
    const links = t.links[catKey] || [];
    if (links.length === 0) return ""; // No renderiza columnas vacías (como admin en inglés)
    return `
      <div class="dropdown-column">
        <h3>${t.categories[catKey]}</h3>
        <ul>
          ${links.map(l => `<li><a href="${l.url}">${l.name}</a></li>`).join('')}
        </ul>
      </div>`;
  };

  const navHTML = `
    <button class="menu-toggle">Menu</button>
    <nav class="main-nav">
        <button class="menu-close-btn">${t.close}</button>
        <div class="nav-center-group">
            <div class="nav-links">
                <a href="${t.homeUrl}">${t.home}</a>
                <div class="dropdown">
                    <button class="dropbtn" type="button">${t.tools}</button>
                    <div class="dropdown-content">
                        ${Object.keys(t.links).map(cat => renderColumn(cat)).join('')}
                    </div>
                </div>
                <a href="${t.contactUrl}">${t.contact}</a>
            </div>
            <div class="search-box">
                <input type="text" id="calc-search" placeholder="${t.search}" autocomplete="off" class="search-input">
                <ul id="search-results" class="search-dropdown"></ul>
            </div>
        </div>
        <div class="nav-controls">
            <div class="lang-selector">
                <select id="lang-switcher">
                    ${langOptions.map(opt => {
                        // LA CLAVE DEL ERROR VISUAL:
                        // Si la URL actual empieza por el código de idioma, lo marcamos como seleccionado.
                        const isSelected = currentPath.startsWith(`/${opt.code}`);
                        return `<option value="${opt.url}" ${isSelected ? 'selected' : ''}>${opt.name}</option>`;
                    }).join('')}
                </select>
            </div>
            <button type="button" class="toggle-dark-inline" id="theme-toggle">☀️</button>
        </div>
    </nav>
    <script>
      document.getElementById('lang-switcher').addEventListener('change', function() {
        if (this.value.includes('alert=not-found')) {
          if (confirm("${t.alertMsg}")) window.location.href = this.value;
          else this.value = window.location.pathname;
        } else {
          window.location.href = this.value;
        }
      });
    </script>
  `;

  // El resto del código (footerHTML y replace) se mantiene igual...
  const footerHTML = `
    <div class="footer-links">
        ${t.footer.links.map((l, idx) => `<a href="${l.url}">${l.name}</a>${idx < t.footer.links.length - 1 ? ' · ' : ''}`).join('')}
        · <a href="#" id="open-cookie-settings-footer">${t.footer.cookieSet}</a>
    </div>
    <p>&copy; ${new Date().getFullYear()} Calculenow. ${t.footer.copy}</p>
  `;

  const nuevoHtml = html
    .replace(/<header>([\s\S]*?)<\/header>/i, `<header>${navHTML}</header>`)
    .replace(/<footer>([\s\S]*?)<\/footer>/i, `<footer>${footerHTML}</footer>`);

  return new Response(nuevoHtml, response);
};

export const config = { path: "/*" };
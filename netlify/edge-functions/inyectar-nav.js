import { i18n } from "./data/translations.js";

export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const html = await response.text();
  const url = new URL(request.url);
  const currentPath = url.pathname;

  // 1. Detección robusta del idioma actual
  const segments = currentPath.split('/');
  const langPath = (segments[1] && i18n[segments[1]]) ? segments[1] : 'en';
  const t = i18n[langPath];

  // 2. Lógica de traducción inteligente (Busca por ID)
  const getTargetUrl = (targetLangCode) => {
    const targetI18n = i18n[targetLangCode];
    
    // Lista de todos los links en el idioma actual
    const currentAllLinks = [
      ...Object.values(t.links).flat(),
      ...t.footer.links,
      { id: "home", url: t.homeUrl },
      { id: "contact", url: t.contactUrl }
    ];

    const currentItem = currentAllLinks.find(l => l.url === currentPath);
    if (!currentItem) return targetI18n.homeUrl;

    // Lista de todos los links en el idioma destino
    const targetAllLinks = [
      ...Object.values(targetI18n.links).flat(),
      ...targetI18n.footer.links,
      { id: "home", url: targetI18n.homeUrl },
      { id: "contact", url: targetI18n.contactUrl }
    ];

    const match = targetAllLinks.find(l => l.id === currentItem.id);
    return match ? match.url : `${targetI18n.homeUrl}?alert=not-found`;
  };

  // 3. Generación DINÁMICA de opciones de idioma (Escalable a N idiomas)
  const langOptions = Object.keys(i18n).map(code => {
    // Busca la etiqueta dinámica como langEs, langEn, langFr...
    const labelKey = `lang${code.charAt(0).toUpperCase() + code.slice(1)}`;
    return {
      code,
      name: t[labelKey], // Usamos el nombre traducido según el idioma actual
      url: langPath === code ? currentPath : getTargetUrl(code)
    };
  });

  const renderColumn = (catKey) => {
    const links = t.links[catKey] || [];
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
                    ${langOptions.map(opt => `
                        <option value="${opt.url}" ${langPath === opt.code ? 'selected' : ''}>
                            ${opt.name}
                        </option>
                    `).join('')}
                </select>
            </div>
            <button type="button" class="toggle-dark-inline" id="theme-toggle">☀️</button>
        </div>
    </nav>
    <script>
      document.getElementById('lang-switcher').addEventListener('change', function() {
        const dest = this.value;
        if (dest.includes('alert=not-found')) {
          if (confirm("${t.alertMsg}")) {
            window.location.href = dest;
          } else {
            this.value = window.location.pathname;
          }
        } else {
          window.location.href = dest;
        }
      });
    </script>
  `;

  const footerHTML = `
    <div class="footer-links">
        ${t.footer.links.map((l, idx) => `
            <a href="${l.url}">${l.name}</a>${idx < t.footer.links.length - 1 ? ' · ' : ''}
        `).join('')}
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
// inyectar-nav.js
// Edge function de Netlify: inyecta el nav y footer en todas las páginas.
// Lee la estructura de categorías desde translations.js — no hay HTML hardcodeado.

import { i18n } from "./data/translations.js";

export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();

  const currentPath = new URL(request.url).pathname;
  const lang = currentPath.startsWith("/en") ? "en" : "es";
  const t = i18n[lang];

  const langOptions = [
    { code: "es", name: t.langEs, url: "/es/" },
    { code: "en", name: t.langEn, url: "/en/" },
  ];

  // Renderiza cada categoría como columna del dropdown.
  // En desktop se usa como panel de tabs; en móvil como acordeón.
  // data-cat se usa para que el JS asocie el botón tab con su panel.
  const renderColumn = (catKey) => {
    const cat = t.categories[catKey];
    const items = t.links[catKey] || [];
    if (!cat || items.length === 0) return "";

    return `
      <div class="dropdown-column" data-cat="${catKey}">
        <h3>
          <span class="cat-icon">${cat.icon}</span>
          <span class="cat-label">${cat.label}</span>
          <span class="cat-arrow">▼</span>
        </h3>
        <ul>
          ${items.map(link => `
            <li><a href="${link.url}">${link.name}</a></li>
          `).join("")}
        </ul>
      </div>
    `;
  };

  // Genera las tabs de desktop (una por categoría con herramientas)
  const renderTabs = () => {
    return Object.keys(t.categories)
      .filter(key => t.links[key] && t.links[key].length > 0)
      .map((key, idx) => {
        const cat = t.categories[key];
        const isFirst = idx === 0;
        return `<button class="dropdown-tab${isFirst ? " active" : ""}" data-tab="${key}" type="button">
          <span class="tab-icon">${cat.icon}</span>
          <span class="tab-label">${cat.label}</span>
        </button>`;
      }).join("");
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
                        <div class="dropdown-tabs-bar">
                            ${renderTabs()}
                        </div>
                        <div class="dropdown-panels">
                            ${Object.keys(t.categories)
                              .filter(key => t.links[key] && t.links[key].length > 0)
                              .map(key => renderColumn(key))
                              .join("")}
                        </div>
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
              <select id="lang-switcher" data-alert="${t.alertMsg}" aria-label="${t.langSelectLabel}">
               ${langOptions.map(opt => {
                 const isSelected = currentPath.startsWith(`/${opt.code}`);
                 return `<option value="${opt.url}" ${isSelected ? 'selected="selected"' : ""}>${opt.name}</option>`;
               }).join("")}
              </select>
           </div>
            <button type="button" class="toggle-dark-inline" id="theme-toggle">☀️</button>
        </div>
    </nav>
  `;

  const footerHTML = `
    <div class="footer-links">
        ${t.footer.links.map((l, idx) =>
          `<a href="${l.url}">${l.name}</a>${idx < t.footer.links.length - 1 ? " · " : ""}`
        ).join("")}
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
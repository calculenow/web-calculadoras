// inyectar-cards.js
// Edge function de Netlify: inyecta las cards de calculadoras en index y páginas de categoría.
// Lee los datos desde translations.js — no hay cards hardcodeadas en el HTML.
//
// Uso en HTML: añade <div id="cards-container"></div> donde quieras las cards.
// - En el index principal (/es/, /en/): genera todas las cards de todas las categorías.
// - En un índice de categoría (/es/finanzas/, /en/health/): genera solo las de esa categoría.

import { i18n } from "./data/translations.js";

// Días que se muestra el ribbon "NUEVO"
const NUEVO_DAYS = 14;

const isNew = (dateStr) => {
  if (!dateStr) return false;
  const diff = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
  return diff <= NUEVO_DAYS;
};

const renderCard = (link, lang) => {
  const nuevo = isNew(link.date);
  return `
    <a href="${link.url}" class="card-link"${nuevo ? ' data-estado="nuevo"' : ''}>
      <div class="card">
        <h2>${link.name}</h2>
        <p>${link.description}</p>
      </div>
    </a>`;
};

export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();

  // Solo actuar si hay un placeholder en la página
  if (!html.includes('id="cards-container"')) return new Response(html, response);

  const currentPath = new URL(request.url).pathname;
  const lang = currentPath.startsWith("/en") ? "en" : "es";
  const t = i18n[lang];

  // Detectar si es un índice de categoría o el home
  // Busca si la URL coincide con algún indexUrl de categoría
  const catKey = Object.keys(t.categories).find(
    key => t.categories[key].indexUrl === currentPath || t.categories[key].indexUrl === currentPath + "/"
  );

  let cards;
  if (catKey) {
    // Índice de categoría: solo las cards de esa categoría
    cards = (t.links[catKey] || []).map(link => renderCard(link, lang)).join("");
  } else {
    // Home o cualquier otra página: todas las cards de todas las categorías
    cards = Object.values(t.links).flat().map(link => renderCard(link, lang)).join("");
  }

  const nuevoHtml = html.replace(
    /<div id="cards-container"[^>]*>[\s\S]*?<\/div>/,
    `<div id="cards-container" class="grid cards-container">${cards}</div>`
  );

  return new Response(nuevoHtml, response);
};

export const config = { path: "/*" };
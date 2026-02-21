export default async (request, context) => {
  const response = await context.next();
  const html = await response.text();
  const url = new URL(request.url);

  // 1. Diccionario de Idiomas (Aquí es donde escalarás en el futuro)
  const i18n = {
    es: {
      home: "Inicio", tools: "Herramientas ▼", close: "✕ Cerrar", contact: "Contacto", search: "Buscar...",
      homeUrl: "/es/", contactUrl: "/es/contacto",
      categories: { finance: "Finanzas", health: "Salud y Mates", admin: "Administración", utils: "Utilidades" },
      links: {
        iva: ["/es/calculadora-iva", "💶 IVA"],
        desc: ["/es/calculadora-descuentos", "🏷️ Descuentos"],
        prop: ["/es/calculadora-propinas", "☕ Propinas"],
        pres: ["/es/calculadora-prestamos", "🏦 Préstamos"],
        divs: ["/es/calculadora-divisas", "💱 Divisas"],
        inte: ["/es/calculadora-interes-compuesto", "📈 Interés"],
        imc: ["/es/calculadora-imc", "⚖️ IMC"],
        calo: ["/es/calculadora-calorias", "🔥 Calorías"],
        hidra: ["/es/calculadora-hidratacion", "💧 Hidratación"],
        porc: ["/es/calculadora-porcentajes", "📊 Porcentajes"],
        dni: ["/es/validador-dni", "🪪 DNI"],
        conv: ["/es/calculadora-conversion", "📐 Conversor"]
      }
    },
    en: {
      home: "Home", tools: "Tools ▼", close: "✕ Close", contact: "Contact", search: "Search...",
      homeUrl: "/en/", contactUrl: "/en/contact",
      categories: { finance: "Finance", health: "Health & Math", admin: "Admin", utils: "Utilities" },
      links: {
        iva: ["/en/vat-calculator", "💶 VAT"],
        desc: ["/en/discount-calculator", "🏷️ Discounts"],
        prop: ["/en/tip-calculator", "☕ Tips"],
        pres: ["/en/loan-calculator", "🏦 Loans"],
        divs: ["/en/currency-converter", "💱 Currency"],
        inte: ["/en/compound-interest-calculator", "📈 Interest"],
        imc: ["/en/bmi-calculator", "⚖️ BMI"],
        calo: ["/en/calorie-calculator", "🔥 Calories"],
        hidra: ["/en/hydration-calculator", "💧 Hydration"],
        porc: ["/en/percentage-calculator", "📊 Percentages"],
        dni: ["/en/id-validator", "🪪 ID Validator"],
        conv: ["/en/unit-converter", "📐 Converter"]
      }
    }
    // Si mañana añades francés, solo copias 'en' aquí abajo como 'fr' y traduces.
  };

  // 2. Lógica de detección (extrae 'es' o 'en' de la URL)
  const langPath = url.pathname.split('/')[1]; 
  const t = i18n[langPath] || i18n.en; // Si no existe el idioma en el diccionario, por defecto inglés.

  // 3. Estructura HTML Única (Usa las variables de 't')
  const navHTML = `
    <button class="menu-toggle">Menu</button>
    <nav class="main-nav">
        <button class="menu-close-btn">${t.close}</button>
        <div class="nav-center-group">
            <div class="nav-links">
                <a href="${t.homeUrl}">${t.home}</a>
                <div class="dropdown">
                    <button class="dropbtn">${t.tools}</button>
                    <div class="dropdown-content">
                        <div class="dropdown-column">
                            <h3>${t.categories.finance}</h3>
                            <ul>
                                <li><a href="${t.links.iva[0]}">${t.links.iva[1]}</a></li>
                                <li><a href="${t.links.desc[0]}">${t.links.desc[1]}</a></li>
                                <li><a href="${t.links.prop[0]}">${t.links.prop[1]}</a></li>
                                <li><a href="${t.links.pres[0]}">${t.links.pres[1]}</a></li>
                                <li><a href="${t.links.divs[0]}">${t.links.divs[1]}</a></li>
                                <li><a href="${t.links.inte[0]}">${t.links.inte[1]}</a></li>
                            </ul>
                        </div>
                        <div class="dropdown-column">
                            <h3>${t.categories.health}</h3>
                            <ul>
                                <li><a href="${t.links.imc[0]}">${t.links.imc[1]}</a></li>
                                <li><a href="${t.links.calo[0]}">${t.links.calo[1]}</a></li>
                                <li><a href="${t.links.hidra[0]}">${t.links.hidra[1]}</a></li>
                                <li><a href="${t.links.porc[0]}">${t.links.porc[1]}</a></li>
                            </ul>
                        </div>
                        <div class="dropdown-column">
                            <h3>${t.categories.admin}</h3>
                            <ul><li><a href="${t.links.dni[0]}">${t.links.dni[1]}</a></li></ul>
                        </div>
                        <div class="dropdown-column">
                            <h3>${t.categories.utils}</h3>
                            <ul><li><a href="${t.links.conv[0]}">${t.links.conv[1]}</a></li></ul>
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
        <button class="toggle-dark-inline" id="theme-toggle">☀️</button>
    </nav>
  `;

  const nuevoHtml = html.replace(/<header>([\s\S]*?)<\/header>/i, `<header>${navHTML}</header>`);
  return new Response(nuevoHtml, response);
};

export const config = { path: "/*" };
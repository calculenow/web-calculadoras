export default async (request, context) => {
  const response = await context.next();
  const html = await response.text();
  const url = new URL(request.url);

  // 1. Diccionario de Idiomas (Aquí es donde escalarás en el futuro)
  const i18n = {
  es: {
    // UI General
    home: "Inicio",
    tools: "Herramientas ▼",
    close: "✕ Cerrar",
    contact: "Contacto",
    search: "Buscar...",
    homeUrl: "/es/",
    contactUrl: "/es/contacto",
    
    // TEXTOS DEL SELECTOR (DINÁMICOS)
    langEs: "Español", // Cómo se ve España en la web española
    langEn: "Inglés",  // Cómo se ve UK en la web española

    categories: { 
      finance: "Finanzas", 
      health: "Salud y Mates", 
      admin: "Administración", 
      utils: "Utilidades" 
    },
    
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
    // UI General
    home: "Home",
    tools: "Tools ▼",
    close: "✕ Close",
    contact: "Contact",
    search: "Search...",
    homeUrl: "/en/",
    contactUrl: "/en/contact",

    // TEXTOS DEL SELECTOR (DINÁMICOS)
    langEs: "Spain",    // Cómo se ve España en la web inglesa
    langEn: "English",  // Cómo se ve UK en la web inglesa

    categories: { 
      finance: "Finance", 
      health: "Health & Math", 
      admin: "Admin", 
      utils: "Utilities" 
    },
    
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
};

  // 2. Lógica de detección (extrae 'es' o 'en' de la URL)
  const langPath = url.pathname.split('/')[1]; 
  const t = i18n[langPath] || i18n.en; // Si no existe el idioma en el diccionario, por defecto inglés.

  // 3. Estructura HTML Única
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
                <select onchange="window.location.href=this.value">
                    <option value="/es/" ${langPath === 'es' ? 'selected' : ''}>${t.langEs}</option>
                    <option value="/en/" ${langPath === 'en' ? 'selected' : ''}>${t.langEn}</option>
                </select>
            </div>
            <button class="toggle-dark-inline" id="theme-toggle">☀️</button>
        </div>
    </nav>
`;

  const nuevoHtml = html.replace(/<header>([\s\S]*?)<\/header>/i, `<header>${navHTML}</header>`);
  return new Response(nuevoHtml, response);
};

export const config = { path: "/*" };
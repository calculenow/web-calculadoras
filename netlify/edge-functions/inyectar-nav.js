export default async (request, context) => {
  const response = await context.next();
  
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const html = await response.text();
  const url = new URL(request.url);

  const i18n = {
    es: {
      home: "Inicio",
      tools: "Herramientas ▼",
      close: "✕ Cerrar",
      contact: "Contacto",
      search: "Buscar...",
      homeUrl: "/es/",
      contactUrl: "/es/contacto",
      langEs: "🇪🇸 Español",
      langEn: "🇬🇧 English",
      categories: {
        finance: "Finanzas",
        health: "Salud y Mates",
        admin: "Administración",
        utils: "Utilidades"
      },
      links: {
        finance: [
          ["/es/calculadora-iva", "💶 IVA"],
          ["/es/calculadora-descuentos", "🏷️ Descuentos"],
          ["/es/calculadora-propinas", "☕ Propinas"],
          ["/es/calculadora-prestamos", "🏦 Préstamos"],
          ["/es/calculadora-divisas", "💱 Divisas"],
          ["/es/calculadora-interes-compuesto", "📈 Interés"]
        ],
        health: [
          ["/es/calculadora-imc", "⚖️ IMC"],
          ["/es/calculadora-calorias", "🔥 Calorías (TMB)"],
          ["/es/calculadora-hidratacion", "💧 Hidratación"],
          ["/es/calculadora-porcentajes", "📊 Porcentajes"]
        ],
        admin: [
          ["/es/validador-dni", "🪪 DNI"]
        ],
        utils: [
          ["/es/calculadora-conversion", "📐 Conversor"]
        ]
      },
      footer: {
        legal: ["/es/aviso-legal", "Aviso legal"],
        priv: ["/es/privacidad", "Privacidad"],
        cook: ["/es/cookies", "Cookies"],
        set: "Configuración de Cookies",
        cont: ["/es/contacto", "Contacto"],
        copy: "Todos los derechos reservados."
      }
    },
    en: {
      home: "Home",
      tools: "Tools ▼",
      close: "✕ Close",
      contact: "Contact",
      search: "Search...",
      homeUrl: "/en/",
      contactUrl: "/en/contact",
      langEs: "🇪🇸 Spain",
      langEn: "🇬🇧 English",
      categories: {
        finance: "Finance",
        health: "Health & Math",
        admin: "Admin",
        utils: "Utilities"
      },
      links: {
        finance: [
          ["/en/vat-calculator", "💶 VAT"],
          ["/en/discount-calculator", "🏷️ Discounts"],
          ["/en/tip-calculator", "☕ Tips"],
          ["/en/loan-calculator", "🏦 Loans"],
          ["/en/currency-converter", "💱 Currency"],
          ["/en/compound-interest-calculator", "📈 Interest"]
        ],
        health: [
          ["/en/bmi-calculator", "⚖️ BMI"],
          ["/en/calorie-calculator", "🔥 Calories (BMR)"],
          ["/en/hydration-calculator", "💧 Hydration"],
          ["/en/percentage-calculator", "📊 Percentages"]
        ],
        admin: [
          
        ],
        utils: [
          ["/en/unit-converter", "📐 Converter"]
        ]
      },
      footer: {
        legal: ["/en/legal-notice", "Legal notice"],
        priv: ["/en/privacy-policy", "Privacy"],
        cook: ["/en/cookies", "Cookies"],
        set: "Cookie Settings",
        cont: ["/en/contact", "Contact"],
        copy: "All rights reserved."
      }
    }
  };

  const langPath = url.pathname.split('/')[1]; 
  const t = i18n[langPath] || i18n.en;

  // --- LÓGICA: Generar Columnas del Dropdown ---
  const renderColumn = (catKey) => {
    const links = t.links[catKey] || [];
    return `
      <div class="dropdown-column">
        <h3>${t.categories[catKey]}</h3>
        <ul>
          ${links.map(l => `<li><a href="${l[0]}">${l[1]}</a></li>`).join('')}
        </ul>
      </div>
    `;
  };

  const dropdownHTML = `
    ${renderColumn('finance')}
    ${renderColumn('health')}
    ${renderColumn('admin')}
    ${renderColumn('utils')}
  `;

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
                        ${dropdownHTML}
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
            <button type="button" class="toggle-dark-inline" id="theme-toggle">☀️</button>
        </div>
    </nav>
  `;

  const footerHTML = `
    <div class="footer-links">
        <a href="${t.footer.legal[0]}">${t.footer.legal[1]}</a> ·
        <a href="${t.footer.priv[0]}">${t.footer.priv[1]}</a> ·
        <a href="${t.footer.cook[0]}">${t.footer.cook[1]}</a> ·
        <a href="#" id="open-cookie-settings-footer">${t.footer.set}</a> ·
        <a href="${t.footer.cont[0]}">${t.footer.cont[1]}</a>
    </div>
    <p>&copy; ${new Date().getFullYear()} Calculenow. ${t.footer.copy}</p>
  `;

  const nuevoHtml = html
    .replace(/<header>([\s\S]*?)<\/header>/i, `<header>${navHTML}</header>`)
    .replace(/<footer>([\s\S]*?)<\/footer>/i, `<footer>${footerHTML}</footer>`);

  return new Response(nuevoHtml, response);
};

export const config = { path: "/*" };
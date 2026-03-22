// translations.js
// Textos de UI e inventario de enlaces del nav, por idioma.
//
// ─── CÓMO AGREGAR UNA CALCULADORA ────────────────────────────────────────────
// 1. Añade un objeto { id, url, name } al array de la categoría correcta.
// 2. Haz lo mismo en el otro idioma (o usa la misma URL si aún no está traducida).
// 3. Añade también la entrada en public/js/buscador.js (array db.es / db.en).
// 4. Consulta el README.md para los pasos completos.
//
// ─── CÓMO AGREGAR UNA CATEGORÍA ──────────────────────────────────────────────
// 1. Añade la clave en categories: { nuevaCat: "Nombre visible" }
// 2. Añade el array links.nuevaCat: [ ... ]
// 3. Repite en el otro idioma.
// 4. El nav se genera solo a partir de estas claves — no hay que tocar HTML.
// ─────────────────────────────────────────────────────────────────────────────

export const i18n = {
  es: {
    home: "Inicio",
    tools: "Herramientas ▼",
    close: "✕ Cerrar",
    contact: "Contacto",
    search: "Buscar...",
    homeUrl: "/es/",
    contactUrl: "/es/contacto",
    langSelectLabel: "Selector de lenguaje",
    langEs: "🇪🇸 Español",
    langEn: "🇬🇧 Inglés",

    // Nombres visibles de cada categoría en el nav.
    // El orden aquí determina el orden de las tabs/acordeón.
    categories: {
      finance:  { label: "Finanzas",      icon: "💰" },
      health:   { label: "Salud",         icon: "❤️" },
      math:     { label: "Matemáticas",   icon: "📐" },
      utils:    { label: "Utilidades",    icon: "🔧" },
      admin:    { label: "Administración", icon: "🪪" },
    },

    // Enlace del nav por categoría.
    // Campos: id (único), url (ruta absoluta), name (texto visible con emoji).
    links: {
      finance: [
        { id: "iva",       url: "/es/calculadora-iva",               name: "💶 IVA" },
        { id: "desc",      url: "/es/calculadora-descuentos",         name: "🏷️ Descuentos" },
        { id: "tip",       url: "/es/calculadora-propinas",           name: "☕ Propinas" },
        { id: "loan",      url: "/es/calculadora-prestamos",          name: "🏦 Préstamos" },
        { id: "curr",      url: "/es/calculadora-divisas",            name: "💱 Divisas" },
        { id: "int",       url: "/es/calculadora-interes-compuesto",  name: "📈 Interés compuesto" },
        // Próximamente:
        // { id: "rent",   url: "/es/calculadora-alquiler-vs-compra", name: "🏠 Alquiler vs compra" },
        // { id: "roi",    url: "/es/calculadora-roi",                name: "📊 ROI" },
        // { id: "saving", url: "/es/calculadora-ahorro",             name: "🎯 Meta de ahorro" },
      ],
      health: [
        { id: "bmi",       url: "/es/calculadora-imc",                name: "⚖️ IMC" },
        { id: "cal",       url: "/es/calculadora-calorias",           name: "🔥 Calorías (TMB)" },
        { id: "hyd",       url: "/es/calculadora-hidratacion",        name: "💧 Hidratación" },
        // Próximamente:
        // { id: "macro",  url: "/es/calculadora-macros",             name: "🥩 Macros" },
        // { id: "heart",  url: "/es/calculadora-frecuencia-cardiaca",name: "❤️ Frec. cardíaca" },
        // { id: "sleep",  url: "/es/calculadora-sueno",              name: "😴 Sueño" },
      ],
      math: [
        { id: "perc",      url: "/es/calculadora-porcentajes",        name: "📊 Porcentajes" },
        // Próximamente:
        // { id: "avg",    url: "/es/calculadora-media-mediana",      name: "📉 Media y mediana" },
        // { id: "ratio",  url: "/es/calculadora-regla-de-tres",      name: "✖️ Regla de tres" },
        // { id: "grade",  url: "/es/calculadora-notas",              name: "🎓 Notas" },
      ],
      utils: [
        { id: "conv",      url: "/es/calculadora-conversion",         name: "📐 Conversor de unidades" },
        { id: "dates",  url: "/es/dias-entre-fechas",  name: "📅 Días entre fechas" },
        // Próximamente:
        // { id: "age",    url: "/es/calculadora-edad",               name: "🎂 Edad exacta" },
        // { id: "elec",   url: "/es/calculadora-consumo-electrico",  name: "⚡ Consumo eléctrico" },
        // { id: "fuel",   url: "/es/calculadora-coste-viaje",        name: "⛽ Coste de viaje" },
      ],
      admin: [
        { id: "dni",       url: "/es/validador-dni",                  name: "🪪 Validador DNI" },
        { id: "irpf",      url: "/es/calculadora-irpf",               name: "📄 IRPF" },
        // Próximamente:
        // { id: "iban",   url: "/es/validador-iban",                  name: "🏛️ Validador IBAN" },
        // { id: "niw",    url: "/es/validador-niw",                   name: "🏢 NIW empresa" },
      ],
    },

    alertMsg: "Esta herramienta aún no está disponible en el idioma seleccionado. ¿Quieres ir a la página de inicio?",

    footer: {
      links: [
        { id: "legal", url: "/es/aviso-legal", name: "Aviso legal" },
        { id: "priv",  url: "/es/privacidad",  name: "Privacidad" },
        { id: "cook",  url: "/es/cookies",     name: "Cookies" },
        { id: "cont",  url: "/es/contacto",    name: "Contacto" },
      ],
      cookieSet: "Configuración de Cookies",
      copy: "Todos los derechos reservados.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  en: {
    home: "Home",
    tools: "Tools ▼",
    close: "✕ Close",
    contact: "Contact",
    search: "Search...",
    homeUrl: "/en/",
    contactUrl: "/en/contact",
    langSelectLabel: "Language selector",
    langEs: "🇪🇸 Spanish",
    langEn: "🇬🇧 English",

    categories: {
      finance:  { label: "Finance",       icon: "💰" },
      health:   { label: "Health",        icon: "❤️" },
      math:     { label: "Math",          icon: "📐" },
      utils:    { label: "Utilities",     icon: "🔧" },
      // Admin solo aparece en EN cuando tenga herramientas propias.
      // Por ahora se omite para no mostrar una categoría vacía.
    },

    links: {
      finance: [
        { id: "vat",       url: "/en/vat-calculator",                  name: "💶 VAT" },
        { id: "desc",      url: "/en/discount-calculator",              name: "🏷️ Discounts" },
        { id: "tip",       url: "/en/tip-calculator",                   name: "☕ Tips" },
        { id: "loan",      url: "/en/loan-calculator",                  name: "🏦 Loans" },
        { id: "curr",      url: "/en/currency-converter",               name: "💱 Currency" },
        { id: "int",       url: "/en/compound-interest-calculator",     name: "📈 Compound interest" },
        // Próximamente:
        // { id: "salestax", url: "/en/sales-tax-calculator",           name: "🧾 Sales tax" },
        // { id: "rent",     url: "/en/rent-vs-buy-calculator",         name: "🏠 Rent vs buy" },
        // { id: "roi",      url: "/en/roi-calculator",                 name: "📊 ROI" },
      ],
      health: [
        { id: "bmi",       url: "/en/bmi-calculator",                   name: "⚖️ BMI" },
        { id: "cal",       url: "/en/calorie-calculator",               name: "🔥 Calories (BMR)" },
        { id: "hyd",       url: "/en/hydration-calculator",             name: "💧 Hydration" },
        // Próximamente:
        // { id: "macro",  url: "/en/macro-calculator",                 name: "🥩 Macros" },
        // { id: "heart",  url: "/en/heart-rate-calculator",            name: "❤️ Heart rate" },
        // { id: "sleep",  url: "/en/sleep-calculator",                 name: "😴 Sleep" },
      ],
      math: [
        { id: "perc",      url: "/en/percentage-calculator",            name: "📊 Percentages" },
        // Próximamente:
        // { id: "avg",    url: "/en/mean-median-calculator",           name: "📉 Mean & median" },
        // { id: "ratio",  url: "/en/ratio-calculator",                 name: "✖️ Ratio / rule of three" },
        // { id: "grade",  url: "/en/grade-calculator",                 name: "🎓 Grade calculator" },
      ],
      utils: [
        { id: "conv",      url: "/en/unit-converter",                   name: "📐 Unit converter" },
        // Próximamente:
        // { id: "dates",  url: "/en/date-calculator",                  name: "📅 Date difference" },
        // { id: "age",    url: "/en/age-calculator",                   name: "🎂 Age calculator" },
        // { id: "fuel",   url: "/en/fuel-cost-calculator",             name: "⛽ Fuel cost" },
      ],
    },

    alertMsg: "This tool is not yet available in the selected language. Do you want to go to the Home page?",

    footer: {
      links: [
        { id: "legal", url: "/en/legal-notice",   name: "Legal notice" },
        { id: "priv",  url: "/en/privacy-policy", name: "Privacy" },
        { id: "cook",  url: "/en/cookies",         name: "Cookies" },
        { id: "cont",  url: "/en/contact",         name: "Contact" },
      ],
      cookieSet: "Cookie Settings",
      copy: "All rights reserved.",
    },
  },
};
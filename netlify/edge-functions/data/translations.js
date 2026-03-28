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
      finance:   { label: "Finanzas",       icon: "💰" },
      health:    { label: "Salud",          icon: "❤️" },
      math:      { label: "Matemáticas",    icon: "📐" },
      utils:     { label: "Utilidades",     icon: "🔧" },
      admin:     { label: "Administración", icon: "🪪" },
      curiosity: { label: "Curiosidades",   icon: "🔮" },
    },

    // Enlace del nav por categoría.
    // Campos: id (único), url (ruta absoluta), name (texto visible con emoji).
    links: {
      finance: [
        { id: "iva",   url: "/es/finanzas/calculadora-iva",               name: "💶 IVA" },
        { id: "desc",  url: "/es/finanzas/calculadora-descuentos",        name: "🏷️ Descuentos" },
        { id: "tip",   url: "/es/finanzas/calculadora-propinas",          name: "☕ Propinas" },
        { id: "loan",  url: "/es/finanzas/calculadora-prestamos",         name: "🏦 Préstamos" },
        { id: "curr",  url: "/es/finanzas/calculadora-divisas",           name: "💱 Divisas" },
        { id: "int",   url: "/es/finanzas/calculadora-interes-compuesto", name: "📈 Interés compuesto" },
        // Próximamente:
        // { id: "rent",   url: "/es/finanzas/calculadora-alquiler-vs-compra", name: "🏠 Alquiler vs compra" },
        // { id: "roi",    url: "/es/finanzas/calculadora-roi",                name: "📊 ROI" },
        // { id: "saving", url: "/es/finanzas/calculadora-ahorro",             name: "🎯 Meta de ahorro" },
      ],
      health: [
        { id: "bmi",   url: "/es/salud/calculadora-imc",                  name: "⚖️ IMC" },
        { id: "cal",   url: "/es/salud/calculadora-calorias",             name: "🔥 Calorías (TMB)" },
        { id: "hyd",   url: "/es/salud/calculadora-hidratacion",          name: "💧 Hidratación" },
        { id: "macro", url: "/es/salud/calculadora-macros",               name: "🥩 Macros" },
        { id: "heart", url: "/es/salud/calculadora-frecuencia-cardiaca",  name: "❤️ Frec. cardíaca" },
        // Próximamente:
        // { id: "sleep", url: "/es/salud/calculadora-sueno", name: "😴 Sueño" },
      ],
      math: [
        { id: "perc",     url: "/es/matematicas/calculadora-porcentajes", name: "📊 Porcentajes" },
        { id: "ratio",    url: "/es/matematicas/regla-de-tres",           name: "✖️ Regla de tres" },
        { id: "avg",      url: "/es/matematicas/media-mediana-moda",      name: "📉 Media y mediana" },
        { id: "grade",    url: "/es/matematicas/calculadora-notas",       name: "🎓 Notas" },
        { id: "geometry", url: "/es/matematicas/area-y-perimetro",        name: "📐 Área y perímetro" },
      ],
      utils: [
        { id: "conv",  url: "/es/utilidades/calculadora-conversion",      name: "📐 Conversor de unidades" },
        { id: "dates", url: "/es/utilidades/dias-entre-fechas",           name: "📅 Días entre fechas" },
        { id: "age",   url: "/es/utilidades/calculadora-edad",            name: "🎂 Edad exacta" },
        { id: "fuel",  url: "/es/utilidades/calculadora-coste-viaje",     name: "⛽ Coste de viaje" },
        { id: "gold",  url: "/es/utilidades/calculadora-oro",             name: "🥇 Valor del oro" },
        // Próximamente:
        // { id: "elec", url: "/es/utilidades/calculadora-consumo-electrico", name: "⚡ Consumo eléctrico" },
      ],
      admin: [
        { id: "dni",        url: "/es/administracion/validador-dni",           name: "🪪 Validador DNI" },
        { id: "irpf",       url: "/es/administracion/calculadora-irpf",        name: "📄 IRPF" },
        { id: "irpf-foral", url: "/es/administracion/calculadora-irpf-foral",  name: "🏛️ IRPF Foral (Navarra/PV)" },
        { id: "iban",       url: "/es/administracion/validador-iban",          name: "🏛️ Validador IBAN" },
        { id: "nif",        url: "/es/administracion/validador-nif-empresa",   name: "🏢 Validador NIF empresa" },
      ],
      curiosity: [
        { id: "heartbeats", url: "/es/curiosidades/latidos-en-tu-vida",        name: "❤️ Latidos en tu vida" },
        { id: "breaths",    url: "/es/curiosidades/respiraciones-en-tu-vida",  name: "🌬️ Respiraciones" },
        { id: "steps",      url: "/es/curiosidades/pasos-en-tu-vida",          name: "👣 Pasos en tu vida" },
        { id: "sleep",      url: "/es/curiosidades/veces-que-has-dormido",     name: "😴 Veces que has dormido" },
        { id: "dog",        url: "/es/curiosidades/edad-perro",                name: "🐶 Edad de tu perro" },
        { id: "planets",    url: "/es/curiosidades/edad-en-otros-planetas",    name: "🪐 Tu edad en planetas" },
      ],
    },

    alertMsg: "Esta herramienta aún no está disponible en el idioma seleccionado. ¿Quieres ir a la página de inicio?",
    modalCancel:  "Quedarme aquí",
    modalConfirm: "Ir al inicio",

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
      finance: { label: "Finance",   icon: "💰" },
      health:  { label: "Health",    icon: "❤️" },
      math:    { label: "Math",      icon: "📐" },
      utils:   { label: "Utilities", icon: "🔧" },
      // Admin y Curiosity solo aparecen en EN cuando tengan herramientas propias.
    },

    links: {
      finance: [
        { id: "vat",   url: "/en/finance/vat-calculator",               name: "💶 VAT" },
        { id: "desc",  url: "/en/finance/discount-calculator",          name: "🏷️ Discounts" },
        { id: "tip",   url: "/en/finance/tip-calculator",               name: "☕ Tips" },
        { id: "loan",  url: "/en/finance/loan-calculator",              name: "🏦 Loans" },
        { id: "curr",  url: "/en/finance/currency-converter",           name: "💱 Currency" },
        { id: "int",   url: "/en/finance/compound-interest-calculator", name: "📈 Compound interest" },
        // Próximamente:
        // { id: "salestax", url: "/en/finance/sales-tax-calculator", name: "🧾 Sales tax" },
        // { id: "rent",     url: "/en/finance/rent-vs-buy-calculator", name: "🏠 Rent vs buy" },
        // { id: "roi",      url: "/en/finance/roi-calculator",        name: "📊 ROI" },
      ],
      health: [
        { id: "bmi", url: "/en/health/bmi-calculator",       name: "⚖️ BMI" },
        { id: "cal", url: "/en/health/calorie-calculator",   name: "🔥 Calories (BMR)" },
        { id: "hyd", url: "/en/health/hydration-calculator", name: "💧 Hydration" },
        // Próximamente:
        // { id: "macro", url: "/en/health/macro-calculator",      name: "🥩 Macros" },
        // { id: "heart", url: "/en/health/heart-rate-calculator", name: "❤️ Heart rate" },
        // { id: "sleep", url: "/en/health/sleep-calculator",      name: "😴 Sleep" },
      ],
      math: [
        { id: "perc", url: "/en/math/percentage-calculator", name: "📊 Percentages" },
        // Próximamente:
        // { id: "avg",   url: "/en/math/mean-median-calculator", name: "📉 Mean & median" },
        // { id: "ratio", url: "/en/math/ratio-calculator",       name: "✖️ Ratio / rule of three" },
        // { id: "grade", url: "/en/math/grade-calculator",       name: "🎓 Grade calculator" },
      ],
      utils: [
        { id: "conv", url: "/en/utils/unit-converter", name: "📐 Unit converter" },
        // Próximamente:
        // { id: "dates", url: "/en/utils/date-calculator",      name: "📅 Date difference" },
        // { id: "age",   url: "/en/utils/age-calculator",       name: "🎂 Age calculator" },
        // { id: "fuel",  url: "/en/utils/fuel-cost-calculator", name: "⛽ Fuel cost" },
      ],
    },

    alertMsg: "This tool is not yet available in the selected language. Do you want to go to the Home page?",
    modalCancel:  "Stay here",
    modalConfirm: "Go to home",

    footer: {
      links: [
        { id: "legal", url: "/en/legal-notice",   name: "Legal notice" },
        { id: "priv",  url: "/en/privacy-policy", name: "Privacy" },
        { id: "cook",  url: "/en/cookies",        name: "Cookies" },
        { id: "cont",  url: "/en/contact",        name: "Contact" },
      ],
      cookieSet: "Cookie Settings",
      copy: "All rights reserved.",
    },
  },
};
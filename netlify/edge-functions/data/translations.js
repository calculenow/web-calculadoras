// translations.js
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
    categories: {
      finance: "Finanzas",
      health: "Salud y Mates",
      admin: "Administración",
      utils: "Utilidades"
    },
    alertMsg: "Esta herramienta aún no está disponible en el idioma seleccionado. ¿Quieres ir a la página de inicio?",
    links: {
      finance: [
        { id: "iva", url: "/es/calculadora-iva", name: "💶 IVA" },
        { id: "desc", url: "/es/calculadora-descuentos", name: "🏷️ Descuentos" },
        { id: "tip", url: "/es/calculadora-propinas", name: "☕ Propinas" },
        { id: "loan", url: "/es/calculadora-prestamos", name: "🏦 Préstamos" },
        { id: "curr", url: "/es/calculadora-divisas", name: "💱 Divisas" },
        { id: "int", url: "/es/calculadora-interes-compuesto", name: "📈 Interés" }
      ],
      health: [
        { id: "bmi", url: "/es/calculadora-imc", name: "⚖️ IMC" },
        { id: "cal", url: "/es/calculadora-calorias", name: "🔥 Calorías (TMB)" },
        { id: "hyd", url: "/es/calculadora-hidratacion", name: "💧 Hidratación" },
        { id: "perc", url: "/es/calculadora-porcentajes", name: "📊 Porcentajes" }
      ],
      admin: [
        { id: "dni", url: "/es/validador-dni", name: "🪪 DNI" }
      ],
      utils: [
        { id: "conv", url: "/es/calculadora-conversion", name: "📐 Conversor" }
      ]
    },
    footer: {
      links: [
        { id: "legal", url: "/es/aviso-legal", name: "Aviso legal" },
        { id: "priv", url: "/es/privacidad", name: "Privacidad" },
        { id: "cook", url: "/es/cookies", name: "Cookies" },
        { id: "cont", url: "/es/contacto", name: "Contacto" }
      ],
      cookieSet: "Configuración de Cookies",
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
    langSelectLabel: "Language selector",
    langEs: "🇪🇸 Spanish",
    langEn: "🇬🇧 English",
    categories: {
      finance: "Finance",
      health: "Health & Math",
      admin: "Admin",
      utils: "Utilities"
    },
    alertMsg: "This tool is not yet available in the selected language. Do you want to go to the Home page?",
    links: {
      finance: [
        { id: "iva", url: "/en/vat-calculator", name: "💶 VAT" },
        { id: "desc", url: "/en/discount-calculator", name: "🏷️ Discounts" },
        { id: "tip", url: "/en/tip-calculator", name: "☕ Tips" },
        { id: "loan", url: "/en/loan-calculator", name: "🏦 Loans" },
        { id: "curr", url: "/en/currency-converter", name: "💱 Currency" },
        { id: "int", url: "/en/compound-interest-calculator", name: "📈 Interest" }
      ],
      health: [
        { id: "bmi", url: "/en/bmi-calculator", name: "⚖️ BMI" },
        { id: "cal", url: "/en/calorie-calculator", name: "🔥 Calories (BMR)" },
        { id: "hyd", url: "/en/hydration-calculator", name: "💧 Hydration" },
        { id: "perc", url: "/en/percentage-calculator", name: "📊 Percentages" }
      ],
      admin: [], 
      utils: [
        { id: "conv", url: "/en/unit-converter", name: "📐 Converter" }
      ]
    },
    footer: {
      links: [
        { id: "legal", url: "/en/legal-notice", name: "Legal notice" },
        { id: "priv", url: "/en/privacy-policy", name: "Privacy" },
        { id: "cook", url: "/en/cookies", name: "Cookies" },
        { id: "cont", url: "/en/contact", name: "Contact" }
      ],
      cookieSet: "Cookie Settings",
      copy: "All rights reserved."
    }
  }
};
// translations.js
// Textos de UI e inventario de enlaces del nav, por idioma.
//
// ─── CÓMO AGREGAR UNA CALCULADORA ────────────────────────────────────────────
// 1. Añade un objeto { id, url, name, description, date } al array correcto.
//    - date: "YYYY-MM-DD" para mostrar ribbon "NUEVO" durante 14 días. Omitir si no aplica.
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
    viewAll: "ver todas →",

    categories: {
      finance:   { label: "Finanzas",       icon: "💰", indexUrl: "/es/finanzas/" },
      health:    { label: "Salud",          icon: "❤️", indexUrl: "/es/salud/" },
      math:      { label: "Matemáticas",    icon: "📐", indexUrl: "/es/matematicas/" },
      utils:     { label: "Utilidades",     icon: "🔧", indexUrl: "/es/utilidades/" },
      admin:     { label: "Administración", icon: "🪪", indexUrl: "/es/administracion/" },
      curiosity: { label: "Curiosidades",   icon: "🔮", indexUrl: "/es/curiosidades/" },
    },

    links: {
      finance: [
        { id: "iva",   url: "/es/finanzas/calculadora-iva",               name: "💶 IVA",              description: "Añade o desglosa el IVA (21%, 10%, 4%) de cualquier importe al instante." },
        { id: "desc",  url: "/es/finanzas/calculadora-descuentos",        name: "🏷️ Descuentos",       description: "Averigua el precio final y cuánto dinero ahorras en tus compras." },
        { id: "tip",   url: "/es/finanzas/calculadora-propinas",          name: "☕ Propinas",          description: "Divide la cuenta y calcula la propina rápidamente entre amigos." },
        { id: "loan",  url: "/es/finanzas/calculadora-prestamos",         name: "🏦 Préstamos",         description: "Calcula tu cuota mensual, intereses totales y el plazo ideal para tu préstamo personal o hipoteca.",  date: "2026-02-14" },
        { id: "curr",  url: "/es/finanzas/calculadora-divisas",           name: "💱 Divisas",           description: "Convierte entre más de 30 monedas del mundo con tipos de cambio actualizados al instante.",           date: "2026-02-17" },
        { id: "int",   url: "/es/finanzas/calculadora-interes-compuesto", name: "📈 Interés compuesto", description: "Calcula cuánto crecerán tus ahorros e inversiones a lo largo del tiempo.",                           date: "2026-02-18" },
        // Próximamente:
        // { id: "rent",   url: "/es/finanzas/calculadora-alquiler-vs-compra", name: "🏠 Alquiler vs compra", description: "" },
        // { id: "roi",    url: "/es/finanzas/calculadora-roi",                name: "📊 ROI",                description: "" },
        // { id: "saving", url: "/es/finanzas/calculadora-ahorro",             name: "🎯 Meta de ahorro",     description: "" },
      ],
      health: [
        { id: "bmi",   url: "/es/salud/calculadora-imc",                  name: "⚖️ IMC",              description: "Calcula tu Índice de Masa Corporal y descubre tu rango de peso ideal." },
        { id: "cal",   url: "/es/salud/calculadora-calorias",             name: "🔥 Calorías (TMB)",   description: "Descubre cuántas calorías quema tu cuerpo al día.",                                                    date: "2026-02-17" },
        { id: "hyd",   url: "/es/salud/calculadora-hidratacion",          name: "💧 Hidratación",      description: "Descubre cuánta agua necesita tu cuerpo según tu peso y actividad.",                                   date: "2026-02-18" },
        { id: "macro", url: "/es/salud/calculadora-macros",               name: "🥩 Macros",           description: "Calcula tus proteínas, carbohidratos y grasas diarias según tu objetivo: pérdida de grasa, mantenimiento o volumen.", date: "2026-03-26" },
        { id: "heart", url: "/es/salud/calculadora-frecuencia-cardiaca",  name: "❤️ Frec. cardíaca",  description: "Calcula tu FC máxima y tus 5 zonas de entrenamiento según tu edad y condición física.",                date: "2026-03-26" },
        // Próximamente:
        // { id: "sleep", url: "/es/salud/calculadora-sueno", name: "😴 Sueño", description: "" },
      ],
      math: [
        { id: "perc",     url: "/es/matematicas/calculadora-porcentajes", name: "📊 Porcentajes",      description: "Calcula proporciones, incrementos y variaciones de forma rápida." },
        { id: "ratio",    url: "/es/matematicas/regla-de-tres",           name: "✖️ Regla de tres",    description: "Calcula proporciones directas, inversas y compuestas al instante. Ideal para recetas, escalas y problemas matemáticos.", date: "2026-03-24" },
        { id: "avg",      url: "/es/matematicas/media-mediana-moda",      name: "📉 Media y mediana",  description: "Calcula la media, mediana, moda y rango de cualquier lista de números al instante.",                   date: "2026-03-26" },
        { id: "grade",    url: "/es/matematicas/calculadora-notas",       name: "🎓 Notas",            description: "Calcula tu media simple o ponderada por créditos. Descubre si apruebas al instante.",                 date: "2026-03-26" },
        { id: "geometry", url: "/es/matematicas/area-y-perimetro",        name: "📐 Área y perímetro", description: "Calcula el área y perímetro de cuadrados, círculos, triángulos y más figuras geométricas al instante.", date: "2026-03-26" },
      ],
      utils: [
        { id: "conv",  url: "/es/utilidades/calculadora-conversion",      name: "📐 Conversor",         description: "Pasa de kilómetros a millas, libras a kilos y más.",                                                 date: "2026-02-19" },
        { id: "dates", url: "/es/utilidades/dias-entre-fechas",           name: "📅 Días entre fechas", description: "Calcula cuántos días hay entre dos fechas, suma días o descubre cuánto falta para tu próximo evento.", date: "2026-03-22" },
        { id: "age",   url: "/es/utilidades/calculadora-edad",            name: "🎂 Edad exacta",       description: "Calcula tu edad exacta en años, meses y días, y descubre cuántos días llevas vivo.",                 date: "2026-03-24" },
        { id: "fuel",  url: "/es/utilidades/calculadora-coste-viaje",     name: "⛽ Coste de viaje",    description: "Calcula cuánto gastarás en combustible en tu próximo viaje en coche, con peajes y dividido entre ocupantes.", date: "2026-03-24" },
        { id: "gold",  url: "/es/utilidades/calculadora-oro",             name: "🥇 Valor del oro",     description: "Calcula cuánto valen tus gramos de oro en euros y otras divisas según el precio actual del mercado.", date: "2026-03-26" },
        // Próximamente:
        // { id: "elec", url: "/es/utilidades/calculadora-consumo-electrico", name: "⚡ Consumo eléctrico", description: "" },
      ],
      admin: [
        { id: "dni",        url: "/es/administracion/validador-dni",          name: "🪪 Validador DNI",         description: "Verifica documentos oficiales o calcula la letra de cualquier DNI o NIE al instante.",                          date: "2026-02-15" },
        { id: "irpf",       url: "/es/administracion/calculadora-irpf",       name: "📄 IRPF",                 description: "Estima tu cuota de IRPF y si tu declaración saldrá a pagar o a devolver, según tu comunidad autónoma.",       date: "2026-03-22" },
        { id: "irpf-foral", url: "/es/administracion/calculadora-irpf-foral", name: "🏛️ IRPF Foral",          description: "Calcula tu IRPF si resides en Navarra o en el País Vasco. Tramos forales actualizados.",                       date: "2026-03-22" },
        { id: "iban",       url: "/es/administracion/validador-iban",         name: "🏛️ Validador IBAN",       description: "Comprueba si un número IBAN es correcto y obtén el desglose del país y número de cuenta.",                    date: "2026-03-27" },
        { id: "nif",        url: "/es/administracion/validador-nif-empresa",  name: "🏢 Validador NIF empresa", description: "Comprueba si el NIF (antiguo CIF) de una empresa española es correcto y conoce el tipo de sociedad.",         date: "2026-03-27" },
      ],
      curiosity: [
        { id: "heartbeats", url: "/es/curiosidades/latidos-en-tu-vida",       name: "❤️ Latidos en tu vida",    description: "Descubre cuántas veces ha latido tu corazón desde que naciste. ¡El número te sorprenderá!",                  date: "2026-03-28" },
        { id: "breaths",    url: "/es/curiosidades/respiraciones-en-tu-vida", name: "🌬️ Respiraciones",         description: "Descubre cuántas veces han respirado tus pulmones desde que naciste.",                                       date: "2026-03-28" },
        { id: "steps",      url: "/es/curiosidades/pasos-en-tu-vida",         name: "👣 Pasos en tu vida",       description: "Descubre cuántos pasos has dado y a cuántos kilómetros equivalen.",                                         date: "2026-03-28" },
        { id: "sleep",      url: "/es/curiosidades/veces-que-has-dormido",    name: "😴 Veces que has dormido",  description: "Descubre cuántas noches has dormido y cuántos años de tu vida has pasado soñando.",                          date: "2026-03-28" },
        { id: "dog",        url: "/es/curiosidades/edad-perro",               name: "🐶 Edad de tu perro",       description: "Convierte la edad de tu perro a años humanos con la fórmula científica. Más preciso que multiplicar por 7.", date: "2026-03-28" },
        { id: "planets",    url: "/es/curiosidades/edad-en-otros-planetas",   name: "🪐 Tu edad en planetas",    description: "Descubre cuántos años tendrías si vivieras en Mercurio, Marte o Neptuno.",                                   date: "2026-03-28" },
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
    viewAll: "view all →",

    categories: {
      finance: { label: "Finance",   icon: "💰", indexUrl: "/en/finance/" },
      health:  { label: "Health",    icon: "❤️", indexUrl: "/en/health/" },
      math:    { label: "Math",      icon: "📐", indexUrl: "/en/math/" },
      utils:   { label: "Utilities", icon: "🔧", indexUrl: "/en/utils/" },
      // Admin y Curiosity solo aparecen en EN cuando tengan herramientas propias.
    },

    links: {
      finance: [
        { id: "vat",   url: "/en/finance/vat-calculator",               name: "💶 VAT",              description: "Add or exclude VAT/Tax from any amount instantly." },
        { id: "desc",  url: "/en/finance/discount-calculator",          name: "🏷️ Discounts",        description: "Find out the final price and how much money you save on your purchases." },
        { id: "tip",   url: "/en/finance/tip-calculator",               name: "☕ Tips",              description: "Split the bill and calculate the tip quickly among friends." },
        { id: "loan",  url: "/en/finance/loan-calculator",              name: "🏦 Loans",             description: "Calculate your monthly payment, total interest, and the ideal term for your loan.",                   date: "2026-02-14" },
        { id: "curr",  url: "/en/finance/currency-converter",           name: "💱 Currency",          description: "Convert between over 30 global currencies with live exchange rates.",                                  date: "2026-02-17" },
        { id: "int",   url: "/en/finance/compound-interest-calculator", name: "📈 Compound interest", description: "Calculate how much your savings and investments will grow over time.",                                 date: "2026-02-18" },
        // Próximamente:
        // { id: "salestax", url: "/en/finance/sales-tax-calculator",    name: "🧾 Sales tax",         description: "" },
        // { id: "rent",     url: "/en/finance/rent-vs-buy-calculator",  name: "🏠 Rent vs buy",       description: "" },
        // { id: "roi",      url: "/en/finance/roi-calculator",          name: "📊 ROI",               description: "" },
      ],
      health: [
        { id: "bmi", url: "/en/health/bmi-calculator",       name: "⚖️ BMI",           description: "Calculate your Body Mass Index and find your ideal weight range." },
        { id: "cal", url: "/en/health/calorie-calculator",   name: "🔥 Calories (BMR)", description: "Find out how many calories your body burns per day.",                                                             date: "2026-02-17" },
        { id: "hyd", url: "/en/health/hydration-calculator", name: "💧 Hydration",      description: "Discover how much water your body needs based on weight and activity.",                                           date: "2026-02-18" },
        { id: "macro", url: "/en/health/macro-calculator",      name: "🥩 Macros",      description: "Calculate your daily protein, carbs and fat based on your goal: fat loss, maintenance or muscle gain.",           date: "2026-03-28" },
        { id: "heart", url: "/en/health/heart-rate-calculator", name: "❤️ Heart rate",  description: "Calculate your max HR and 5 training zones based on your age. Includes Karvonen formula.",                        date: "2026-03-28" },
        // Próximamente:
        // { id: "sleep", url: "/en/health/sleep-calculator",      name: "😴 Sleep",        description: "" },
      ],
      math: [
        { id: "perc", url: "/en/math/percentage-calculator", name: "📊 Percentages",   description: "Calculate proportions, increases, and variations quickly." },
        // Próximamente:
        // { id: "avg",   url: "/en/math/mean-median-calculator", name: "📉 Mean & median",          description: "" },
        // { id: "ratio", url: "/en/math/ratio-calculator",       name: "✖️ Ratio / rule of three",  description: "" },
        // { id: "grade", url: "/en/math/grade-calculator",       name: "🎓 Grade calculator",        description: "" },
      ],
      utils: [
        { id: "conv", url: "/en/utils/unit-converter", name: "📐 Unit converter", description: "Convert kilometers to miles, pounds to kilograms, and more.", date: "2026-02-19" },
        // Próximamente:
        // { id: "dates", url: "/en/utils/date-calculator",      name: "📅 Date difference", description: "" },
        // { id: "age",   url: "/en/utils/age-calculator",       name: "🎂 Age calculator",   description: "" },
        // { id: "fuel",  url: "/en/utils/fuel-cost-calculator", name: "⛽ Fuel cost",         description: "" },
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
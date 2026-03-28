document.addEventListener('DOMContentLoaded', () => {
    // 1. BASE DE DATOS MULTILINGÜE
    const db = {
        es: [
            // Finanzas
            { nombre: "IVA",                              url: "/es/finanzas/calculadora-iva",                tags: ["impuestos", "factura", "hacienda", "autónomo"] },
            { nombre: "Descuentos",                       url: "/es/finanzas/calculadora-descuentos",         tags: ["rebajas", "ofertas", "ahorro", "compras", "precio final"] },
            { nombre: "Propinas",                         url: "/es/finanzas/calculadora-propinas",           tags: ["restaurante", "camarero", "cuenta", "cenas", "dividir"] },
            { nombre: "Préstamos",                        url: "/es/finanzas/calculadora-prestamos",          tags: ["banco", "hipoteca", "credito", "deuda", "cuota"] },
            { nombre: "Divisas",                          url: "/es/finanzas/calculadora-divisas",            tags: ["moneda", "euro", "dolar", "cambio", "forex"] },
            { nombre: "Interés Compuesto",                url: "/es/finanzas/calculadora-interes-compuesto",  tags: ["bolsa", "inversion", "ahorro", "dinero", "rentabilidad"] },
            // Salud
            { nombre: "IMC",                              url: "/es/salud/calculadora-imc",                   tags: ["peso", "salud", "grasa", "adelgazar"] },
            { nombre: "Calorías (TMB)",                   url: "/es/salud/calculadora-calorias",              tags: ["dieta", "comida", "gym", "metabolismo"] },
            { nombre: "Hidratación",                      url: "/es/salud/calculadora-hidratacion",           tags: ["agua", "beber", "sed", "salud", "deporte"] },
            { nombre: "Calculadora de macros",            url: "/es/salud/calculadora-macros",                tags: ["proteinas", "carbohidratos", "grasas", "macronutrientes", "dieta", "nutricion", "tdee"] },
            { nombre: "Frecuencia cardíaca",              url: "/es/salud/calculadora-frecuencia-cardiaca",   tags: ["pulsaciones", "fc maxima", "zonas entrenamiento", "karvonen", "tanaka", "cardio", "deporte"] },
            // Matemáticas
            { nombre: "Porcentajes",                      url: "/es/matematicas/calculadora-porcentajes",     tags: ["matematicas", "proporcion", "calculo"] },
            { nombre: "Regla de tres",                    url: "/es/matematicas/regla-de-tres",               tags: ["proporciones", "directa", "inversa", "compuesta", "matematicas", "regla de 3"] },
            { nombre: "Media, mediana y moda",            url: "/es/matematicas/media-mediana-moda",          tags: ["estadistica", "promedio", "media aritmetica", "mediana", "moda", "rango"] },
            { nombre: "Calculadora de notas",             url: "/es/matematicas/calculadora-notas",           tags: ["notas", "media", "ponderada", "creditos", "universidad", "aprobado", "suspenso"] },
            { nombre: "Área y perímetro",                 url: "/es/matematicas/area-y-perimetro",            tags: ["geometria", "area", "perimetro", "figuras", "circulo", "rectangulo", "triangulo", "metros cuadrados"] },
            // Utilidades
            { nombre: "Conversión de Unidades",           url: "/es/utilidades/calculadora-conversion",       tags: ["medidas", "metros", "pulgadas", "kilos", "temperatura", "convertir"] },
            { nombre: "Días entre fechas",                url: "/es/utilidades/dias-entre-fechas",            tags: ["fecha", "dias", "calendario", "cuenta atras", "cuanto falta", "diferencia fechas"] },
            { nombre: "Edad exacta",                      url: "/es/utilidades/calculadora-edad",             tags: ["edad", "años", "cumpleaños", "dias vividos", "cuantos años tengo"] },
            { nombre: "Coste de viaje",                   url: "/es/utilidades/calculadora-coste-viaje",      tags: ["gasolina", "diesel", "viaje", "coche", "combustible", "carretera", "litros"] },
            { nombre: "Valor del oro",                    url: "/es/utilidades/calculadora-oro",              tags: ["oro", "gramo", "precio oro", "joyeria", "quilates", "18k", "24k", "vender oro"] },
            // Administración
            { nombre: "DNI",                              url: "/es/administracion/validador-dni",            tags: ["nif", "letra", "documento", "identidad"] },
            { nombre: "IRPF",                             url: "/es/administracion/calculadora-irpf",         tags: ["impuestos", "renta", "hacienda", "declaracion", "retencion", "comunidad autonoma"] },
            { nombre: "IRPF Foral Navarra y País Vasco",  url: "/es/administracion/calculadora-irpf-foral",   tags: ["navarra", "pais vasco", "foral", "irpf", "renta", "euskadi", "hacienda foral"] },
            { nombre: "Validador IBAN",                   url: "/es/administracion/validador-iban",           tags: ["iban", "cuenta bancaria", "transferencia", "validar iban", "banco"] },
            { nombre: "Validador NIF empresa",            url: "/es/administracion/validador-nif-empresa",    tags: ["nif", "cif", "empresa", "sociedad", "validar cif", "validar nif", "autonomo"] },
            // Curiosidades
            { nombre: "Latidos en tu vida",               url: "/es/curiosidades/latidos-en-tu-vida",         tags: ["latidos", "corazon", "pulsaciones", "cuantos latidos", "curiosidad"] },
            { nombre: "Respiraciones en tu vida",         url: "/es/curiosidades/respiraciones-en-tu-vida",   tags: ["respiraciones", "pulmones", "cuantas veces has respirado", "curiosidad"] },
            { nombre: "Pasos en tu vida",                 url: "/es/curiosidades/pasos-en-tu-vida",           tags: ["pasos", "caminar", "cuantos pasos", "kilometros", "curiosidad"] },
            { nombre: "Veces que has dormido",            url: "/es/curiosidades/veces-que-has-dormido",      tags: ["dormir", "noches", "horas dormidas", "cuanto has dormido", "curiosidad"] },
            { nombre: "Edad de tu perro en años humanos", url: "/es/curiosidades/edad-perro",                 tags: ["perro", "años humanos", "edad perro", "multiplicar por 7", "mascota"] },
            { nombre: "Tu edad en otros planetas",        url: "/es/curiosidades/edad-en-otros-planetas",     tags: ["planetas", "mercurio", "marte", "neptuno", "edad planetas", "sistema solar", "curiosidad"] },
        ],
        en: [
            // Finance
            { nombre: "VAT",               url: "/en/finance/vat-calculator",               tags: ["tax", "invoice", "hmrc", "freelance", "business"] },
            { nombre: "Discounts",         url: "/en/finance/discount-calculator",           tags: ["sales", "offers", "savings", "shopping", "final price"] },
            { nombre: "Tips",              url: "/en/finance/tip-calculator",                tags: ["restaurant", "waiter", "bill", "dinner", "split"] },
            { nombre: "Loans",             url: "/en/finance/loan-calculator",               tags: ["bank", "mortgage", "credit", "debt", "payment"] },
            { nombre: "Currency Converter",url: "/en/finance/currency-converter",            tags: ["money", "euro", "dollar", "exchange", "forex"] },
            { nombre: "Compound Interest", url: "/en/finance/compound-interest-calculator",  tags: ["stocks", "investment", "savings", "money", "profit"] },
            // Health
            { nombre: "BMI",               url: "/en/health/bmi-calculator",                tags: ["weight", "health", "fat", "lose weight"] },
            { nombre: "Calories (BMR)",    url: "/en/health/calorie-calculator",             tags: ["diet", "food", "gym", "metabolism"] },
            { nombre: "Hydration",         url: "/en/health/hydration-calculator",           tags: ["water", "drink", "thirst", "health", "sport"] },
            // Math
            { nombre: "Percentages",       url: "/en/math/percentage-calculator",            tags: ["math", "proportion", "ratio", "calculation"] },
            // Utils
            { nombre: "Unit Converter",    url: "/en/utils/unit-converter",                  tags: ["measurements", "meters", "inches", "kilograms", "temperature", "convert"] },
        ]
    };

    // 2. DETECCIÓN DE IDIOMA Y TEXTOS DE INTERFAZ
    const lang = window.location.pathname.split('/')[1] || 'en';
    const calculadoras = db[lang] || db.en;
    
    const uiTexts = {
        es: { recent: "Búsquedas recientes" },
        en: { recent: "Recent searches" }
    }[lang] || { recent: "Recent searches" };

    const input = document.getElementById('calc-search');
    const results = document.getElementById('search-results');
    let selectedIndex = -1;

    if (!input) return;

    // --- FUNCIÓN: Mostrar resultados ---
    const displayResults = (list, isRecent = false) => {
        results.innerHTML = isRecent ? `<li class="search-title">${uiTexts.recent}</li>` : '';
        
        list.forEach((c) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${c.url}" class="search-item">
                    <span class="search-item-name">${c.nombre}</span>
                </a>`;
            
            li.querySelector('a').addEventListener('click', () => saveToRecent(c));
            results.appendChild(li);
        });

        results.classList.toggle('is-visible', list.length > 0);
    };

    // --- LÓGICA LOCALSTORAGE (Diferenciada por idioma para no mezclar) ---
    const storageKey = `recent_calcs_${lang}`;
    
    const saveToRecent = (calc) => {
        let recent = JSON.parse(localStorage.getItem(storageKey)) || [];
        recent = [calc, ...recent.filter(item => item.url !== calc.url)].slice(0, 5);
        localStorage.setItem(storageKey, JSON.stringify(recent));
    };

    const getRecent = () => JSON.parse(localStorage.getItem(storageKey)) || [];

    // --- EVENTOS ---
    input.addEventListener('focus', () => {
        if (input.value.trim() === "") {
            const recent = getRecent();
            if (recent.length > 0) displayResults(recent, true);
        }
    });

    input.addEventListener('input', () => {
        const value = input.value.toLowerCase().trim();
        selectedIndex = -1;

        if (value.length < 1) {
            const recent = getRecent();
            recent.length > 0 ? displayResults(recent, true) : results.classList.remove('is-visible');
            return;
        }

        const filtered = calculadoras.filter(c => 
            c.nombre.toLowerCase().includes(value) || 
            c.tags.some(tag => tag.includes(value))
        );

        displayResults(filtered);
    });

    // Control teclado
    input.addEventListener('keydown', (e) => {
        const items = results.querySelectorAll('li:not(.search-title)');
        if (e.key === 'ArrowDown') {
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection(items);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelection(items);
            e.preventDefault();
        } else if (e.key === 'Enter' && selectedIndex > -1) {
            items[selectedIndex].querySelector('a').click();
        }
    });

    const updateSelection = (items) => {
        items.forEach((li, i) => li.classList.toggle('is-selected', i === selectedIndex));
    };

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            results.classList.remove('is-visible');
        }
    });
});
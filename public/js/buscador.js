document.addEventListener('DOMContentLoaded', () => {
    // 1. BASE DE DATOS MULTILINGÜE
    const db = {
        es: [
            { nombre: "IVA", url: "/es/calculadora-iva", tags: ["impuestos", "factura", "hacienda", "autónomo"] },
            { nombre: "IMC", url: "/es/calculadora-imc", tags: ["peso", "salud", "grasa", "adelgazar"] },
            { nombre: "Calorías (TMB)", url: "/es/calculadora-calorias", tags: ["dieta", "comida", "gym", "metabolismo"] },
            { nombre: "Hidratación", url: "/es/calculadora-hidratacion", tags: ["agua", "beber", "sed", "salud", "deporte"] },
            { nombre: "Interés Compuesto", url: "/es/calculadora-interes-compuesto", tags: ["bolsa", "inversion", "ahorro", "dinero", "rentabilidad"] },
            { nombre: "Divisas", url: "/es/calculadora-divisas", tags: ["moneda", "euro", "dolar", "cambio", "forex"] },
            { nombre: "Préstamos", url: "/es/calculadora-prestamos", tags: ["banco", "hipoteca", "credito", "deuda", "cuota"] },
            { nombre: "DNI", url: "/es/validador-dni", tags: ["nif", "letra", "documento", "identidad"] },
            { nombre: "IRPF", url: "/es/calculadora-irpf", tags: ["impuestos", "renta", "hacienda", "declaracion", "retencion", "comunidad autonoma"] },
            { nombre: "IRPF Foral Navarra y País Vasco", url: "/es/calculadora-irpf-foral", tags: ["navarra", "pais vasco", "foral", "irpf", "renta", "euskadi", "hacienda foral"] },
            { nombre: "Propinas", url: "/es/calculadora-propinas", tags: ["restaurante", "camarero", "cuenta", "cenas", "dividir"] },
            { nombre: "Porcentajes", url: "/es/calculadora-porcentajes", tags: ["matematicas", "proporcion", "regla de tres", "calculo"] },
            { nombre: "Descuentos", url: "/es/calculadora-descuentos", tags: ["rebajas", "ofertas", "ahorro", "compras", "precio final"] },
            { nombre: "Conversión de Unidades", url: "/es/calculadora-conversion", tags: ["medidas", "metros", "pulgadas", "kilos", "temperatura", "convertir"] },
            { nombre: "Días entre fechas", url: "/es/dias-entre-fechas", tags: ["fecha", "dias", "calendario", "cuenta atras", "cuanto falta", "diferencia fechas"] },
            { nombre: "Edad exacta", url: "/es/calculadora-edad", tags: ["edad", "años", "cumpleaños", "dias vividos", "cuantos años tengo"] },
        ],
        en: [
            { nombre: "VAT", url: "/en/vat-calculator", tags: ["tax", "invoice", "hmrc", "freelance", "business"] },
            { nombre: "BMI", url: "/en/bmi-calculator", tags: ["weight", "health", "fat", "lose weight"] },
            { nombre: "Calories (BMR)", url: "/en/calorie-calculator", tags: ["diet", "food", "gym", "metabolism"] },
            { nombre: "Hydration", url: "/en/hydration-calculator", tags: ["water", "drink", "thirst", "health", "sport"] },
            { nombre: "Compound Interest", url: "/en/compound-interest-calculator", tags: ["stocks", "investment", "savings", "money", "profit"] },
            { nombre: "Currency Converter", url: "/en/currency-converter", tags: ["money", "euro", "dollar", "exchange", "forex"] },
            { nombre: "Loans", url: "/en/loan-calculator", tags: ["bank", "mortgage", "credit", "debt", "payment"] },
            { nombre: "Tips", url: "/en/tip-calculator", tags: ["restaurant", "waiter", "bill", "dinner", "split"] },
            { nombre: "Percentages", url: "/en/percentage-calculator", tags: ["math", "proportion", "ratio", "calculation"] },
            { nombre: "Discounts", url: "/en/discount-calculator", tags: ["sales", "offers", "savings", "shopping", "final price"] },
            { nombre: "Unit Converter", url: "/en/unit-converter", tags: ["measurements", "meters", "inches", "kilograms", "temperature", "convert"] },
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

    // --- EVENTOS (Se mantienen igual, ya usan la variable 'calculadoras' filtrada) ---
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

    // Control teclado (Se mantiene igual)
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
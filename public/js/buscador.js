document.addEventListener('DOMContentLoaded', () => {
   const calculadoras = [
    { nombre: "IVA", url: "/calculadora-iva", tags: ["impuestos", "factura", "hacienda", "autónomo"] },
    { nombre: "IMC", url: "/calculadora-imc", tags: ["peso", "salud", "grasa", "adelgazar"] },
    { nombre: "Calorías (TMB)", url: "/calculadora-calorias", tags: ["dieta", "comida", "gym", "metabolismo"] },
    { nombre: "Hidratación", url: "/calculadora-hidratacion", tags: ["agua", "beber", "sed", "salud", "deporte"] },
    { nombre: "Interés Compuesto", url: "/calculadora-interes-compuesto", tags: ["bolsa", "inversion", "ahorro", "dinero", "rentabilidad"] },
    { nombre: "Divisas", url: "/calculadora-divisas", tags: ["moneda", "euro", "dolar", "cambio", "forex"] },
    { nombre: "Préstamos", url: "/calculadora-prestamos", tags: ["banco", "hipoteca", "credito", "deuda", "cuota"] },
    { nombre: "DNI", url: "/validador-dni", tags: ["nif", "letra", "documento", "identidad"] },
    { nombre: "Propinas", url: "/calculadora-propinas", tags: ["restaurante", "camarero", "cuenta", "cenas", "dividir"] },
    { nombre: "Porcentajes", url: "/calculadora-porcentajes", tags: ["matematicas", "proporcion", "regla de tres", "calculo"] },
    { nombre: "Descuentos", url: "/calculadora-descuentos", tags: ["rebajas", "ofertas", "ahorro", "compras", "precio final"] },
    { nombre: "Conversión de Unidades", url: "/calculadora-conversion", tags: ["medidas", "metros", "pulgadas", "kilos", "temperatura", "convertir"] },
];

    const input = document.getElementById('calc-search');
    const results = document.getElementById('search-results');
    let selectedIndex = -1;

    if (!input) return;

    // --- FUNCIÓN: Mostrar resultados (Recientes o Filtrados) ---
    const displayResults = (list, isRecent = false) => {
    results.innerHTML = isRecent ? '<li class="search-title">Búsquedas recientes</li>' : '';
    
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

    // --- LÓGICA LOCALSTORAGE ---
    const saveToRecent = (calc) => {
        let recent = JSON.parse(localStorage.getItem('recent_calcs')) || [];
        // Evitar duplicados: quitamos si ya existe y lo ponemos el primero
        recent = [calc, ...recent.filter(item => item.url !== calc.url)].slice(0, 5);
        localStorage.setItem('recent_calcs', JSON.stringify(recent));
    };

    const getRecent = () => JSON.parse(localStorage.getItem('recent_calcs')) || [];

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
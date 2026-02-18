document.addEventListener('DOMContentLoaded', () => {
    // El set de datos (puedes ampliarlo mañana con Interés Compuesto)
    const calculadoras = [
        { nombre: "IVA", url: "/calculadora-iva" },
        { nombre: "IMC", url: "/calculadora-imc" },
        { nombre: "Calorías (TMB)", url: "/calculadora-calorias" },
        { nombre: "Hidratación", url: "/calculadora-hidratacion" },
        { nombre: "Divisas", url: "/calculadora-divisas" },
        { nombre: "Porcentajes", url: "/calculadora-porcentajes" },
        { nombre: "Préstamos", url: "/calculadora-prestamos" },
        { nombre: "Intereses", url: "/calculadora-intereses-compuestos" },
        { nombre: "DNI", url: "/validador-dni" }
    ];

    const input = document.getElementById('calc-search');
    const results = document.getElementById('search-results');

    if (!input) return;

    input.addEventListener('input', () => {
        const value = input.value.toLowerCase().trim();
        results.innerHTML = '';

        if (value.length < 2) {
            results.classList.remove('is-visible');
            return;
        }

        const filtered = calculadoras.filter(c => 
            c.nombre.toLowerCase().includes(value)
        );

        if (filtered.length > 0) {
            filtered.forEach(c => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${c.url}">${c.nombre}</a>`;
                results.appendChild(li);
            });
            results.classList.add('is-visible');
        } else {
            results.classList.remove('is-visible');
        }
    });

    // Cerrar si pinchamos fuera
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            results.classList.remove('is-visible');
        }
    });
});
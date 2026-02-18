/**
 * CALCULADORA DE INTERÉS COMPUESTO
 * Lógica de cálculo, interactividad y gráficos SVG
 */

let datosMercado = {
    indices: { sp500: 10.0, nasdaq: 12.0 },
    macro: { ahorro: 3.5 },
    last_update: "Febrero 2026"
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Intentamos cargar datos frescos, si falla, usamos el objeto de arriba
        const response = await fetch('/data/mercado.json');
        if (response.ok) {
            datosMercado = await response.json();
        }
    } catch (e) {
        console.warn("Usando valores locales de respaldo.");
    }
    
    actualizarTextosBotones();
    initListeners();
    calcularInteres(); // Cálculo inicial al cargar
});

function initListeners() {
    // Escuchar cambios en los inputs para calcular en tiempo real
    const inputs = document.querySelectorAll('.field');
    inputs.forEach(input => {
        input.addEventListener('input', calcularInteres);
    });

    // Eventos para los botones de perfiles (S&P 500, etc.)
    const containerPerfiles = document.getElementById('container-perfiles');
    if (containerPerfiles) {
        containerPerfiles.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            
            const perfil = btn.dataset.perfil;
            const inputInteres = document.getElementById('interes');
            
            if (perfil === 'ahorro') inputInteres.value = datosMercado.macro.ahorro;
            if (perfil === 'moderado') inputInteres.value = datosMercado.indices.sp500;
            if (perfil === 'tecnologico') inputInteres.value = datosMercado.indices.nasdaq;
            
            // Pequeño feedback visual al cambiar el valor
            inputInteres.style.backgroundColor = '#e0f2fe';
            setTimeout(() => inputInteres.style.backgroundColor = '', 300);

            calcularInteres();
        });
    }

    document.getElementById('btn-calcular')?.addEventListener('click', calcularInteres);
}

function calcularInteres() {
    const capital = parseFloat(document.getElementById('capital').value) || 0;
    const aportacion = parseFloat(document.getElementById('aportacion').value) || 0;
    const tasaAnual = parseFloat(document.getElementById('interes').value) || 0;
    const anyos = parseFloat(document.getElementById('anyos').value) || 0;

    // Si los años son 0, no hay nada que calcular
    if (anyos <= 0) {
        renderizarResultados(capital, capital, 0, capital, 0);
        dibujarGraficoSimple(capital, 0, 0);
        return;
    }

    const tasaMensual = (tasaAnual / 100) / 12;
    const mesesTotales = anyos * 12;

    // 1. Crecimiento del capital inicial
    const capitalFinal = capital * Math.pow(1 + tasaMensual, mesesTotales);

    // 2. Crecimiento de las aportaciones mensuales (Anualidad vencida)
    // Si la tasa es 0, es simplemente suma aritmética
    const aportacionesFinales = tasaMensual > 0 
        ? aportacion * ((Math.pow(1 + tasaMensual, mesesTotales) - 1) / tasaMensual)
        : aportacion * mesesTotales;

    const totalFinal = capitalFinal + aportacionesFinales;
    const totalAportadoEnTiempo = aportacion * mesesTotales;
    const totalInvertido = capital + totalAportadoEnTiempo;
    const beneficios = totalFinal - totalInvertido;

    // Actualizamos UI y Gráfico
    renderizarResultados(totalFinal, totalInvertido, beneficios, capital, totalAportadoEnTiempo);
    dibujarGraficoSimple(capital, totalAportadoEnTiempo, beneficios);
}

function dibujarGraficoSimple(inicial, aportado, intereses) {
    const svg = document.getElementById('visual-chart'); // Usamos tu ID original del HTML
    if (!svg) return;

    const total = inicial + aportado + intereses;
    if (total <= 0) return;

    // Calculamos anchos sobre un base de 100% para el SVG
    const wInicial = (inicial / total) * 100;
    const wAportado = (aportado / total) * 100;
    const wIntereses = (intereses / total) * 100;

    // Generamos el SVG interno (Barra apilada)
    // El viewBox 0 0 100 20 nos permite trabajar con porcentajes directamente
    svg.innerHTML = `
        <svg viewBox="0 0 100 20" class="svg-render">
            <rect x="0" y="0" width="${wInicial}" height="20" fill="#3b82f6" />
            <rect x="${wInicial}" y="0" width="${wAportado}" height="20" fill="#10b981" />
            <rect x="${wInicial + wAportado}" y="0" width="${wIntereses}" height="20" fill="#f59e0b" />
        </svg>
        <div class="chart-legend-simple">
            <span><small>●</small> Inicial</span>
            <span><small>●</small> Aportado</span>
            <span><small>●</small> Interés</span>
        </div>
    `;
}

function renderizarResultados(total, invertido, beneficios, inicial, aportaciones) {
    const resDiv = document.querySelector('.result-interes');
    if (!resDiv) return;

    resDiv.innerHTML = `
        <div class="resumen-calculo">
            <ul>
                <li><span>Inversión inicial:</span> <strong>${formatEuro(inicial)}</strong></li>
                <li><span>Total aportaciones:</span> <strong>${formatEuro(aportaciones)}</strong></li>
                <li><span>Intereses generados:</span> <strong style="color: #10b981">${formatEuro(beneficios)}</strong></li>
                <li class="total-destacado">
                    <span>Capital Final Estimado:</span> 
                    <strong>${formatEuro(total)}</strong>
                </li>
            </ul>
        </div>
    `;
}

function formatEuro(val) {
    // Usamos 2 decimales solo si el valor es pequeño para mayor precisión SEO/Financiera
    const decimales = val < 1000 ? 2 : 0;
    return val.toLocaleString('es-ES', { 
        style: 'currency', 
        currency: 'EUR', 
        maximumFractionDigits: decimales 
    });
}

function actualizarTextosBotones() {
    const bAhorro = document.getElementById('btn-ahorro');
    const bMod = document.getElementById('btn-moderado');
    const bTech = document.getElementById('btn-tech');

    if (bAhorro) bAhorro.innerHTML = `🏦 Ahorro <span>${datosMercado.macro.ahorro}%</span>`;
    if (bMod) bMod.innerHTML = `📈 S&P 500 <span>${datosMercado.indices.sp500}%</span>`;
    if (bTech) bTech.innerHTML = `🚀 NASDAQ <span>${datosMercado.indices.nasdaq}%</span>`;
}
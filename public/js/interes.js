/**
 * CALCULADORA DE INTERÉS COMPUESTO
 * Lógica pura de cálculo e interactividad
 */

let datosMercado = {
    indices: { sp500: 10.0, nasdaq: 12.0 },
    macro: { ahorro: 3.5 },
    last_update: "Febrero 2026"
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/data/mercado.json');
        if (response.ok) {
            datosMercado = await response.json();
        }
    } catch (e) {
        console.warn("Usando valores locales de respaldo.");
    }
    
    actualizarTextosBotones();
    initListeners();
    calcularInteres();
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

    const tasaMensual = (tasaAnual / 100) / 12;
    const mesesTotales = anyos * 12;

    // Fórmula de interés compuesto con aportaciones mensuales
    const capitalFinal = capital * Math.pow(1 + tasaMensual, mesesTotales);
    const aportacionesFinales = tasaMensual > 0 
        ? aportacion * ((Math.pow(1 + tasaMensual, mesesTotales) - 1) / tasaMensual)
        : aportacion * mesesTotales;

    const totalFinal = capitalFinal + aportacionesFinales;
    const totalInvertido = capital + (aportacion * mesesTotales);
    const beneficios = totalFinal - totalInvertido;

    renderizarResultados(totalFinal, totalInvertido, beneficios, capital, aportacion * mesesTotales);
}

function renderizarResultados(total, invertido, beneficios, inicial, aportaciones) {
    const resDiv = document.querySelector('.result-interes');
    if (!resDiv) return;

    resDiv.innerHTML = `
        <div class="resumen-calculo">
            <ul>
                <li><span>Inversión inicial:</span> <strong>${formatEuro(inicial)}</strong></li>
                <li><span>Total aportado:</span> <strong>${formatEuro(aportaciones)}</strong></li>
                <li><span>Intereses generados:</span> <strong class="u-text-success">${formatEuro(beneficios)}</strong></li>
                <li class="total-destacado">
                    <span>Total acumulado:</span> 
                    <span>${formatEuro(total)}</span>
                </li>
            </ul>
        </div>
    `;
}

function formatEuro(val) {
    return val.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

function actualizarTextosBotones() {
    const bAhorro = document.getElementById('btn-ahorro');
    const bMod = document.getElementById('btn-moderado');
    const bTech = document.getElementById('btn-tech');

    if (bAhorro) bAhorro.innerText = `🏦 Cuenta Ahorro (${datosMercado.macro.ahorro}%)`;
    if (bMod) bMod.innerText = `📈 S&P 500 (${datosMercado.indices.sp500}%)`;
    if (bTech) bTech.innerText = `🚀 NASDAQ (${datosMercado.indices.nasdaq}%)`;
}
// Variable global para almacenar los datos del mercado (con fallback por si falla la red)
let datosMercado = {
    indices: { sp500: 8.0, nasdaq: 12.0 },
    macro: { euribor: 3.0 },
    last_update: "Cargando..."
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Intentar cargar el JSON que genera el robot
    try {
        const response = await fetch('/data/mercado.json');
        if (response.ok) {
            datosMercado = await response.json();
            actualizarTextosBotones();
        }
    } catch (e) {
        console.warn("No se pudo cargar el JSON de mercado, usando valores locales.");
    }

    // 2. Listener del botón calcular
    const btnCalcular = document.getElementById('btn-calcular');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', calcularInteres);
    }
});

// Función para actualizar los nombres de los botones y la fecha
function actualizarTextosBotones() {
    const fechaEl = document.getElementById('fecha-actualizacion');
    if (fechaEl) fechaEl.innerText = `Datos actualizados: ${datosMercado.last_update}`;

    // Actualizamos el texto de los botones con el dato real del JSON
    const btnAhorro = document.getElementById('btn-ahorro');
    const btnMod = document.getElementById('btn-moderado');
    const btnTech = document.getElementById('btn-tech');

    if (btnAhorro) btnAhorro.innerText = `🏦 Ahorro (${datosMercado.macro.euribor}%)`;
    if (btnMod) btnMod.innerText = `📈 S&P 500 (${datosMercado.indices.sp500}%)`;
    if (btnTech) btnTech.innerText = `🚀 NASDAQ (${datosMercado.indices.nasdaq}%)`;
}

// Función que llaman los botones del HTML (onclick="cargarPerfil('...')")
function cargarPerfil(perfil) {
    const inputInteres = document.getElementById('interes');
    if (!inputInteres) return;

    if (perfil === 'ahorro') inputInteres.value = datosMercado.macro.euribor;
    if (perfil === 'moderado') inputInteres.value = datosMercado.indices.sp500;
    if (perfil === 'tecnologico') inputInteres.value = datosMercado.indices.nasdaq;

    // Opcional: Calcular automáticamente al pulsar el perfil
    calcularInteres();
}

function calcularInteres() {
    const capital = parseFloat(document.getElementById('capital').value) || 0;
    const aportacion = parseFloat(document.getElementById('aportacion').value) || 0;
    const tasaAnual = parseFloat(document.getElementById('interes').value) || 0;
    const anyos = parseFloat(document.getElementById('anyos').value) || 0;

    const tasaMensual = (tasaAnual / 100) / 12;
    const numeroMeses = anyos * 12;

    const capitalFinal = capital * Math.pow(1 + tasaMensual, numeroMeses);
    
    let aportacionesFinales = 0;
    if (tasaMensual > 0) {
        aportacionesFinales = aportacion * ((Math.pow(1 + tasaMensual, numeroMeses) - 1) / tasaMensual);
    } else {
        aportacionesFinales = aportacion * numeroMeses;
    }

    const total = capitalFinal + aportacionesFinales;
    const totalAhorrado = capital + (aportacion * numeroMeses);
    const beneficios = total - totalAhorrado;

    const resultadoDiv = document.querySelector('.result-interes');
    if (!resultadoDiv) return;

    resultadoDiv.innerHTML = `
        <div class="resumen-calculo">
            <ul>
                <li>
                    <span>Inversión inicial:</span>
                    <span>${capital.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'})}</span>
                </li>
                <li>
                    <span>Total aportaciones:</span>
                    <span>${(aportacion * numeroMeses).toLocaleString('es-ES', {style: 'currency', currency: 'EUR'})}</span>
                </li>
                <li>
                    <span>Intereses generados:</span>
                    <span class="u-text-success">${beneficios.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'})}</span>
                </li>
                <li class="total-destacado">
                    <span>Total acumulado:</span>
                    <span>${total.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'})}</span>
                </li>
            </ul>
        </div>
    `;
}
/**
 * CALCULADORA DE HIDRATACIÓN (VERSIÓN LIMPIA)
 */

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.field');
    
    // Calcular al cambiar cualquier input
    inputs.forEach(input => {
        input.addEventListener('input', calcularAgua);
    });

    // Calcular al pulsar el botón
    const btn = document.getElementById('btn-calcular-agua');
    if (btn) {
        btn.addEventListener('click', calcularAgua);
    }

    calcularAgua();
});

function calcularAgua() {
    const peso = parseFloat(document.getElementById('peso').value) || 0;
    const actividadMinutos = parseFloat(document.getElementById('actividad').value) || 0;

    if (peso < 20) {
        const resDiv = document.querySelector('.result-hidratacion');
        if (resDiv) resDiv.innerHTML = "";
        return;
    }

    // Lógica: 35ml por kg + extra por ejercicio
    const totalMl = (peso * 35) + ((actividadMinutos / 60) * 700);
    const totalLitros = (totalMl / 1000).toFixed(2);
    const vasos = Math.round(totalMl / 250);

    const resDiv = document.querySelector('.result-hidratacion');
    if (resDiv) {
        resDiv.innerHTML = `
            <div class="resumen-calculo">
                <ul>
                    <li><span>Objetivo diario:</span> <strong>${totalLitros} Litros</strong></li>
                    <li><span>Equivalente a:</span> <strong>~${vasos} vasos de agua</strong></li>
                </ul>
            </div>
        `;
    }
}
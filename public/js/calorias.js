document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.btn-tmb');
    const resultDiv = document.querySelector('.result-tmb');

    if (btn) {
        btn.addEventListener('click', () => {
            const genero = document.querySelector('.genero').value;
            const peso = parseFloat(document.querySelector('.peso').value);
            const altura = parseFloat(document.querySelector('.altura').value);
            const edad = parseInt(document.querySelector('.edad').value);
            const factorActividad = parseFloat(document.querySelector('.actividad').value);

            // 1. Validaciones básicas
            if (!peso || !altura || !edad || peso <= 0 || altura <= 0 || edad <= 0) {
                resultDiv.innerHTML = '<p style="color: #ef4444; font-weight: bold;">Por favor, introduce valores válidos y positivos.</p>';
                return;
            }

            // 2. Cálculo de Tasa Metabólica Basal (Mifflin-St Jeor)
            let tmb;
            if (genero === 'hombre') {
                tmb = (10 * peso) + (6.25 * altura) - (5 * edad) + 5;
            } else {
                tmb = (10 * peso) + (6.25 * altura) - (5 * edad) - 161;
            }

            // 3. Cálculo de Gasto Total (Mantenimiento)
            const mantenimiento = tmb * factorActividad;

            // 4. Renderizado de resultados
            resultDiv.innerHTML = `
                <div class="resumen-calculo">
                    <p style="font-weight: bold; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 12px;">
                        Tu Resumen Energético
                    </p>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Metabolismo Basal:</span>
                            <strong>${Math.round(tmb)} kcal</strong>
                        </li>
                        <li class="total-destacado" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 12px; margin-top: 5px;">
                            <span>Mantenimiento Diario:</span>
                            <span style="font-size: 1.5rem; color: #f59e0b; font-weight: 800;">${Math.round(mantenimiento)} kcal</span>
                        </li>
                    </ul>
                    
                    <div style="margin-top: 20px; padding: 12px; background: rgba(0,0,0,0.03); border-radius: 8px; font-size: 0.9rem;">
                        <p style="margin-bottom: 8px; font-weight: bold; opacity: 0.9;">Estimación según objetivos:</p>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span>📉 Perder peso (-15%):</span>
                            <strong>${Math.round(mantenimiento * 0.85)} kcal</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>📈 Ganar peso (+10%):</span>
                            <strong>${Math.round(mantenimiento * 1.10)} kcal</strong>
                        </div>
                    </div>
                    
                    <p style="font-size: 0.75rem; margin-top: 15px; font-style: italic; opacity: 0.7; line-height: 1.3;">
                        * Valores aproximados. El mantenimiento es la cantidad de calorías para ni ganar ni perder peso.
                    </p>
                </div>
            `;
        });
    }
});
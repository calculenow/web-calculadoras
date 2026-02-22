document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.btn-tmb');
    const resultDiv = document.querySelector('.result-tmb');

    if (btn && resultDiv) {
        const labels = resultDiv.dataset;

        btn.addEventListener('click', () => {
            const genero = document.querySelector('.genero').value;
            const peso = parseFloat(document.querySelector('.peso').value);
            const altura = parseFloat(document.querySelector('.altura').value);
            const edad = parseInt(document.querySelector('.edad').value);
            const factorActividad = parseFloat(document.querySelector('.actividad').value);

            // 1. Validación de rangos
            const esValido = (
                peso >= 20 && peso <= 400 &&
                altura >= 50 && altura <= 260 &&
                edad >= 15 && edad <= 110
            );

            if (!esValido) {
                resultDiv.innerHTML = `<p style="color: #ef4444; font-weight: bold; padding: 10px; border: 1px solid #ef4444; border-radius: 8px;">${labels.msError}</p>`;
                return;
            }

            // 2. Cálculo (Mifflin-St Jeor)
            let tmb = (genero === 'hombre') 
                ? (10 * peso) + (6.25 * altura) - (5 * edad) + 5
                : (10 * peso) + (6.25 * altura) - (5 * edad) - 161;

            const mantenimiento = tmb * factorActividad;
            const perder = mantenimiento * 0.85;
            const ganar = mantenimiento * 1.10;
            const unidad = labels.unit || 'kcal';

            // 3. Renderizado del resultado
            resultDiv.innerHTML = `
                <div class="resumen-calculo">
                    <p style="font-weight: bold; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 12px;">
                        ${labels.header}
                    </p>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>${labels.labelBmr}:</span>
                            <strong>${Math.round(tmb)} ${unidad}</strong>
                        </li>
                        <li class="total-destacado" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 12px; margin-top: 5px;">
                            <span>${labels.labelTdee}:</span>
                            <span style="font-size: 1.5rem; color: #f59e0b; font-weight: 800;">${Math.round(mantenimiento)} ${unidad}</span>
                        </li>
                    </ul>
                    
                    <div style="margin-top: 20px; padding: 12px; background: rgba(0,0,0,0.03); border-radius: 8px; font-size: 0.9rem;">
                        <p style="margin-bottom: 8px; font-weight: bold; opacity: 0.9;">${labels.labelObjective}</p>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span>${labels.labelLose}:</span>
                            <strong>${Math.round(perder)} ${unidad}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>${labels.labelGain}:</span>
                            <strong>${Math.round(ganar)} ${unidad}</strong>
                        </div>
                    </div>

                    <button class="btn-copy" style="margin-top: 15px; width: 100%; padding: 10px; cursor: pointer; border: 1px solid var(--border); border-radius: 6px; background: var(--card-bg); color: var(--text-main); font-weight: bold;">
                        ${labels.btnCopy || 'Copiar'}
                    </button>
                    
                    <p style="font-size: 0.75rem; margin-top: 15px; font-style: italic; opacity: 0.7; line-height: 1.3;">
                        ${labels.labelFooter}
                    </p>
                </div>
            `;

            // 4. Lógica de copiar (Solo datos útiles)
            const copyBtn = resultDiv.querySelector('.btn-copy');
            copyBtn.addEventListener('click', function() {
                const textToCopy = `${labels.labelBmr}: ${Math.round(tmb)} ${unidad}
${labels.labelTdee}: ${Math.round(mantenimiento)} ${unidad}
${labels.labelLose}: ${Math.round(perder)} ${unidad}
${labels.labelGain}: ${Math.round(ganar)} ${unidad}`;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = this.innerText; // Guardamos el texto actual para no depender del data
                    this.innerText = "✅";
                    setTimeout(() => {
                        this.innerText = originalText;
                    }, 2000);
                });
            });
        });
    }
});

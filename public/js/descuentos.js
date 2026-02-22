document.addEventListener("DOMContentLoaded", () => {
    const precioInput = document.querySelector('.precio-original');
    const pctInput = document.querySelector('.descuento-pct');
    const resultDiv = document.querySelector('.result-discount');
    const btn = document.querySelector('.btn-discount');

    if (btn && resultDiv) {
        const labels = resultDiv.dataset;

        btn.addEventListener('click', () => {
            if (!validarNumeros([precioInput, pctInput])) {
                resultDiv.textContent = labels.error;
                return;
            }

            const precio = parseFloat(precioInput.value);
            const descuento = parseFloat(pctInput.value);
            const ahorro = (precio * descuento) / 100;
            const precioFinal = precio - ahorro;

            const resFinalStr = precioFinal.toFixed(2) + labels.unit;
            const ahorroStr = ahorro.toFixed(2) + labels.unit;

            resultDiv.innerHTML = `
                <div class="resumen-calculo">
                    <p>${labels.labelFinal} <strong style="color: var(--primary); font-size: 1.4rem;">${resFinalStr}</strong></p>
                    <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 15px;">${labels.labelSave} ${ahorroStr}</p>
                    
                    <button class="btn-copy" 
                            data-btn-copy="${labels.btnCopy || 'Copiar'}" 
                            style="width: 100%; padding: 10px; cursor: pointer; border: 1px solid var(--border); border-radius: 6px; background: var(--card-bg); color: var(--text-main); font-weight: bold;">
                        ${labels.btnCopy || 'Copiar'}
                    </button>
                </div>
            `;

            // Lógica de copiar
            resultDiv.querySelector('.btn-copy').addEventListener('click', function() {
                const textToCopy = `${labels.labelFinal} ${resFinalStr}\n${labels.labelSave} ${ahorroStr}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = this.innerText;
                    this.innerText = "✅";
                    setTimeout(() => { this.innerText = originalText; }, 2000);
                });
            });
        });

        [precioInput, pctInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') btn.click();
            });
        });
    }
});
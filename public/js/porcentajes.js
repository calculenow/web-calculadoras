// ==================== CALCULADORA DE PORCENTAJES ====================
const percentBtn = document.querySelector('.btn-percent');

if (percentBtn) {
    const totalInput = document.getElementById('total');
    const percentInput = document.getElementById('percent');
    const percentResult = document.querySelector('.result-percent');

    percentBtn.addEventListener('click', () => {
        const isEn = window.location.pathname.includes('/en/');

        // Validación usando tu función de core.js
        if (typeof validarNumeros === 'function' && !validarNumeros([totalInput, percentInput])) {
            percentResult.textContent = isEn ? 'Enter valid values' : 'Introduce valores válidos';
            return;
        }

        const total = parseFloat(totalInput.value);
        const pct = parseFloat(percentInput.value);
        const result = (total * pct) / 100;

        // Formateo de números según idioma
        const f = (n) => n.toLocaleString(isEn ? 'en-US' : 'es-ES', { maximumFractionDigits: 2 });
        
        // Extraemos etiquetas del HTML (igual que en interés compuesto)
        const labels = percentResult.dataset;
        const bCopy = labels.btnCopy || (isEn ? "Copy Result" : "Copiar Resultado");

        // RENDERIZADO IDÉNTICO A LAS DEMÁS CALCULADORAS
        percentResult.innerHTML = `
            <div class="resumen-calculo">
                <ul>
                    <li>
                        <span>${isEn ? 'Amount' : 'Cantidad'}:</span> 
                        <strong>${f(total)}</strong>
                    </li>
                    <li>
                        <span>${isEn ? 'Percentage' : 'Porcentaje'}:</span> 
                        <strong>${f(pct)}%</strong>
                    </li>
                    <li class="total-destacado">
                        <span>${isEn ? 'Result' : 'Resultado'}:</span> 
                        <strong>${f(result)}</strong>
                    </li>
                </ul>
                <button class="btn-copy" style="width: 100%; padding: 10px; margin-top:15px; cursor: pointer; border: 1px solid var(--border); border-radius: 6px; background: var(--card-bg); color: var(--text-main); font-weight: bold;">
                    ${bCopy}
                </button>
            </div>
        `;

        // Lógica de copiado
        percentResult.querySelector('.btn-copy').addEventListener('click', function() {
            const rawText = isEn 
                ? `${pct}% of ${total} = ${f(result)}` 
                : `${pct}% de ${total} = ${f(result)}`;
            
            navigator.clipboard.writeText(rawText).then(() => {
                const oldText = this.innerText;
                this.innerText = '✅';
                setTimeout(() => this.innerText = oldText, 2000);
            });
        });
    });

    // Soporte para tecla Enter
    [totalInput, percentInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') percentBtn.click();
        });
    });
}
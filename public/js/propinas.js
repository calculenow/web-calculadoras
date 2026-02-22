/**
 * CALCULADORA DE PROPINAS Y REPARTO DE CUENTA
 */
document.addEventListener("DOMContentLoaded", () => {
    const totalInput = document.querySelector('.cuenta-total');
    const pctInput = document.querySelector('.propina-pct');
    const personasInput = document.querySelector('.personas');
    const resultDiv = document.querySelector('.result-tip');
    const btn = document.querySelector('.btn-tip');

    if (btn) {
        const calcular = () => {
            const isEn = window.location.pathname.includes('/en/');
            const total = parseFloat(totalInput.value) || 0;
            const pct = parseFloat(pctInput.value) || 0;
            const numPersonas = parseInt(personasInput.value) || 1;

            // Validaciones
            if (total <= 0) {
                resultDiv.innerHTML = `<p style="color:#e11d48; font-weight:bold;">${isEn ? 'Please enter the total bill.' : 'Introduce el total de la cuenta.'}</p>`;
                return;
            }
            if (numPersonas <= 0) {
                resultDiv.innerHTML = `<p style="color:#e11d48; font-weight:bold;">${isEn ? 'Minimum 1 person.' : 'Mínimo 1 persona.'}</p>`;
                return;
            }

            const propinaTotal = total * (pct / 100);
            const granTotal = total + propinaTotal;
            const porPersona = granTotal / numPersonas;

            // Formateo de moneda
            const format = (num) => num.toLocaleString(isEn ? 'en-US' : 'es-ES', { 
                style: 'currency', 
                currency: isEn ? 'USD' : 'EUR' 
            });

            // Textos
            const tTitle = isEn ? "Payment Breakdown:" : "Desglose del pago:";
            const tOriginal = isEn ? "Original Bill" : "Cuenta original";
            const tTip = isEn ? `Tip (${pct}%)` : `Propina (${pct}%)`;
            const tTotal = isEn ? "Total with Tip" : "Total con propina";
            const tEach = isEn ? "Each person pays" : "Cada persona paga";
            const bCopy = isEn ? "Copy Result" : "Copiar Resultado";

            resultDiv.innerHTML = `
                <div class="resumen-calculo">
                    <p style="font-weight: bold; border-bottom: 1px solid var(--border); padding-bottom: 5px;">${tTitle}</p>
                    <ul>
                        <li><span>${tOriginal}:</span> <span>${format(total)}</span></li>
                        <li><span>${tTip}:</span> <span>${format(propinaTotal)}</span></li>
                        <li><span>${tTotal}:</span> <span>${format(granTotal)}</span></li>
                        <li class="total-destacado">
                            <span>${tEach}:</span> 
                            <strong>${format(porPersona)}</strong>
                        </li>
                    </ul>
                    <button class="btn-copy" style="width: 100%; padding: 10px; margin-top:15px; cursor: pointer; border: 1px solid var(--border); border-radius: 6px; background: var(--card-bg); color: var(--text-main); font-weight: bold;">
                        ${bCopy}
                    </button>
                </div>
            `;

            // Lógica de copiado
            resultDiv.querySelector('.btn-copy').addEventListener('click', function() {
                const text = `${tTitle}\n---------------------------\n${tOriginal}: ${format(total)}\n${tTip}: ${format(propinaTotal)}\n${tTotal}: ${format(granTotal)}\n${tEach}: ${format(porPersona)}`;
                navigator.clipboard.writeText(text).then(() => {
                    const old = this.innerText;
                    this.innerText = "✅";
                    setTimeout(() => this.innerText = old, 2000);
                });
            });
        };

        btn.addEventListener('click', calcular);

        // Soporte para Enter
        [totalInput, pctInput, personasInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') calcular();
            });
        });
    }
});
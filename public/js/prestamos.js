/**
 * CALCULADORA DE PRÉSTAMOS E HIPOTECAS
 */

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.btn-mortgage');
    const resultDiv = document.querySelector('.result-mortgage');

    if (btn) {
        const capInput = document.querySelector('.capital');
        const intInput = document.querySelector('.interes');
        const plaInput = document.querySelector('.plazo');

        const calcular = () => {
            const isEn = window.location.pathname.includes('/en/');
            const P = parseFloat(capInput.value);
            const anualInterest = parseFloat(intInput.value);
            const years = parseInt(plaInput.value);

            // Validaciones
            if (isNaN(P) || isNaN(anualInterest) || isNaN(years) || P <= 0 || anualInterest <= 0 || years <= 0) {
                resultDiv.innerHTML = `<p style="color:#e11d48; font-weight:bold;">${isEn ? 'Please fill all fields with positive values.' : 'Por favor, rellena todos los campos con valores positivos.'}</p>`;
                return;
            }

            // Cálculos (Sistema Francés)
            const r = (anualInterest / 100) / 12; // Interés mensual
            const n = years * 12; // Meses totales
            const cuota = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPagado = cuota * n;
            const totalIntereses = totalPagado - P;

            // Formateo de moneda
            const format = (num) => num.toLocaleString(isEn ? 'en-US' : 'es-ES', { 
                style: 'currency', 
                currency: isEn ? 'USD' : 'EUR',
                maximumFractionDigits: 2 
            });

            // Etiquetas desde HTML o default
            const labels = resultDiv.dataset;
            const tRes = isEn ? "Feasibility Summary" : "Resumen de Viabilidad";
            const tCuo = isEn ? "Monthly Payment" : "Cuota Mensual";
            const tPre = isEn ? "Loan Amount" : "Préstamo solicitado";
            const tInt = isEn ? "Total Interest" : "Intereses totales";
            const tDev = isEn ? "Total Repayment" : "Total a devolver";
            const bCopy = labels.btnCopy || (isEn ? "Copy Summary" : "Copiar Resumen");

            resultDiv.innerHTML = `
                <div class="resumen-calculo">
                    <p style="font-weight: bold; border-bottom: 1px solid var(--border); padding-bottom: 5px;">${tRes}</p>
                    <ul>
                        <li class="total-destacado"><span>${tCuo}:</span> <strong>${format(cuota)}</strong></li>
                        <li><span>${tPre}:</span> <span>${format(P)}</span></li>
                        <li><span>${tInt}:</span> <span style="color: #e11d48;">${format(totalIntereses)}</span></li>
                        <li><span>${tDev}:</span> <strong>${format(totalPagado)}</strong></li>
                    </ul>
                    <p style="font-size: 0.8rem; margin-top: 1rem; font-style: italic; opacity: 0.7;">
                        ${isEn ? '* Calculation based on the French amortization system.' : '* Basado en el sistema de amortización francés.'}
                    </p>
                    <button class="btn-copy" style="width: 100%; padding: 10px; margin-top:15px; cursor: pointer; border: 1px solid var(--border); border-radius: 6px; background: var(--card-bg); color: var(--text-main); font-weight: bold;">
                        ${bCopy}
                    </button>
                </div>
            `;

            // Lógica de copiado
            resultDiv.querySelector('.btn-copy').addEventListener('click', function() {
                const text = `${tRes}\n---------------------------\n${tCuo}: ${format(cuota)}\n${tPre}: ${format(P)}\n${tInt}: ${format(totalIntereses)}\n${tDev}: ${format(totalPagado)}`;
                navigator.clipboard.writeText(text).then(() => {
                    const old = this.innerText;
                    this.innerText = "✅";
                    setTimeout(() => this.innerText = old, 2000);
                });
            });
        };

        btn.addEventListener('click', calcular);

        // Soporte para Enter
        [capInput, intInput, plaInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') calcular();
            });
        });
    }
});
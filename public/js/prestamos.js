document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.btn-mortgage');
    const resultDiv = document.querySelector('.result-mortgage');

    if (btn) {
        btn.addEventListener('click', () => {
            const P = parseFloat(document.querySelector('.capital').value);
            const anualInterest = parseFloat(document.querySelector('.interes').value);
            const years = parseInt(document.querySelector('.plazo').value);

            // Validaciones básicas
            if (!P || !anualInterest || !years || P <= 0 || anualInterest <= 0 || years <= 0) {
                resultDiv.innerHTML = '<p style="color:red;">Por favor, rellena todos los campos con valores positivos.</p>';
                return;
            }

            // Cálculos
            const r = (anualInterest / 100) / 12; // Interés mensual
            const n = years * 12; // Número total de meses (pagos)

            // Fórmula: M = P * [r * (1 + r)^n] / [(1 + r)^n – 1]
            const cuotaMensual = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            
            const totalPagado = cuotaMensual * n;
            const totalIntereses = totalPagado - P;

            

           resultDiv.innerHTML = `
    <div class="resumen-calculo">
        <p style="font-weight: bold; border-bottom: 1px solid var(--border); padding-bottom: 5px;">
            Resumen de Viabilidad
        </p>
        <ul>
            <li><span>Cuota Mensual:</span> <strong>${cuotaMensual.toFixed(2)}€</strong></li>
            <li><span>Préstamo solicitado:</span> <span>${P.toFixed(2)}€</span></li>
            <li><span>Intereses totales:</span> <span style="color: #e11d48;">${totalIntereses.toFixed(2)}€</span></li>
            <li class="total-destacado">
                <span>Total a devolver:</span> 
                <span>${totalPagado.toFixed(2)}€</span>
            </li>
        </ul>
        <p style="font-size: 0.85rem; margin-top: 1rem; font-style: italic; opacity: 0.8;">
            * Cálculo basado en el sistema de amortización francés con intereses constantes.
        </p>
    </div>
`;
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const totalInput = document.querySelector('.cuenta-total');
    const pctInput = document.querySelector('.propina-pct');
    const personasInput = document.querySelector('.personas');
    const resultDiv = document.querySelector('.result-tip');
    const btn = document.querySelector('.btn-tip');

    if (btn) {
        btn.addEventListener('click', () => {
            // Validamos campos (Asegúrate de que validarNumeros acepte el 0 para la propina)
            const total = parseFloat(totalInput.value) || 0;
            const pct = parseFloat(pctInput.value) || 0; // Si está vacío, es 0
            const numPersonas = parseInt(personasInput.value) || 1;

            if (total <= 0) {
                resultDiv.innerHTML = '<p style="color:red;">Introduce el total de la cuenta.</p>';
                return;
            }

            if (numPersonas <= 0) {
                resultDiv.innerHTML = '<p style="color:red;">Mínimo 1 persona.</p>';
                return;
            }

            const propinaTotal = total * (pct / 100);
            const granTotal = total + propinaTotal;
            const porPersona = granTotal / numPersonas;

            // Usamos el diseño de "resumen" que integra con tu CSS unificado
            resultDiv.innerHTML = `
                <div class="resumen-calculo">
                    <p>Desglose del pago:</p>
                    <ul>
                        <li><span>Cuenta original:</span> <span>${total.toFixed(2)}€</span></li>
                        <li><span>Propina (${pct}%):</span> <span>${propinaTotal.toFixed(2)}€</span></li>
                        <li><span>Total con propina:</span> <span>${granTotal.toFixed(2)}€</span></li>
                        <li class="total-destacado">
                            <span>Cada persona paga:</span> 
                            <span>${porPersona.toFixed(2)}€</span>
                        </li>
                    </ul>
                </div>
            `;
        });
    }
});
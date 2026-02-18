
// ==================== CALCULADORA DE PORCENTAJES ====================
const percentBtn = document.querySelector('.btn-percent');

if (percentBtn) {
    const totalInput = document.querySelector('.total');
    const percentInput = document.querySelector('.percent');
    const percentResult = document.querySelector('.result');

    percentBtn.addEventListener('click', () => {
        // Validamos elementos
        if (!validarNumeros([totalInput, percentInput])) {
            percentResult.textContent = 'Introduce valores válidos';
            return;
        }

        const total = parseFloat(totalInput.value);
        const pct = parseFloat(percentInput.value);
        const result = (total * pct) / 100;

        // Resultado limpio y resaltado
        percentResult.innerHTML = `El ${pct}% de ${total} es <strong>${result.toFixed(2)}</strong>`;
    });

    // Soporte para tecla Enter
    [totalInput, percentInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') percentBtn.click();
        });
    });
}
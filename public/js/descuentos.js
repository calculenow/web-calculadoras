document.addEventListener("DOMContentLoaded", () => {
    const precioInput = document.querySelector('.precio-original');
    const pctInput = document.querySelector('.descuento-pct');
    const resultDiv = document.querySelector('.result-discount');
    const btn = document.querySelector('.btn-discount');

    if (btn) {
        btn.addEventListener('click', () => {
            // Validamos usando la función del core.js
            if (!validarNumeros([precioInput, pctInput])) {
                resultDiv.textContent = 'Por favor, introduce valores correctos.';
                return;
            }

            const precio = parseFloat(precioInput.value);
            const descuento = parseFloat(pctInput.value);

            const ahorro = (precio * descuento) / 100;
            const precioFinal = precio - ahorro;

            resultDiv.innerHTML = `
                <p>Precio final: <strong style="color: var(--primary); font-size: 1.4rem;">${precioFinal.toFixed(2)}€</strong></p>
                <p style="font-size: 0.9rem; opacity: 0.8;">Te ahorras: ${ahorro.toFixed(2)}€</p>
            `;
        });

        // Soporte para Enter
        [precioInput, pctInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') btn.click();
            });
        });
    }
});
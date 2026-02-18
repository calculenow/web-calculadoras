document.addEventListener("DOMContentLoaded", () => {
    const importeInput = document.querySelector('.importe');
    const tipoIvaSelect = document.querySelector('.tipo-iva');
    const resultDiv = document.querySelector('.result-iva');
    const btnAdd = document.querySelector('.btn-add-iva');
    const btnRemove = document.querySelector('.btn-remove-iva');

    if (!btnAdd || !btnRemove) return;

    const calcularIVA = (tipo) => {
        // Validación simple si no tienes la función global validarNumeros
        if (!importeInput.value || isNaN(importeInput.value)) {
            resultDiv.innerHTML = "⚠️ Por favor, introduce un importe válido.";
            return;
        }

        const importe = parseFloat(importeInput.value);
        const porcentaje = parseFloat(tipoIvaSelect.value);
        let ivaCalculado, base, total;

        if (tipo === 'add') {
            base = importe;
            ivaCalculado = base * (porcentaje / 100);
            total = base + ivaCalculado;
            
            renderResult("Base Imponible", base, "IVA (+)", ivaCalculado, "Total (PVP)", total, "add", porcentaje);
        } else {
            total = importe;
            base = total / (1 + (porcentaje / 100));
            ivaCalculado = total - base;
            
            renderResult("Precio Total", total, "IVA incluido (-)", ivaCalculado, "Base Imponible", base, "remove", porcentaje);
        }
    };

    // Función auxiliar para no repetir HTML
    const renderResult = (labelPrincipal, valPrincipal, labelIva, valIva, labelFinal, valFinal, clase, porc) => {
    const valorParaCopiar = valFinal.toFixed(2);
    
    resultDiv.innerHTML = `
        <div class="resumen-calculo ${clase}">
            <div class="resumen-header">Resultados del cálculo</div>
            <div class="resumen-item">
                <span>${labelPrincipal}:</span>
                <strong>${valPrincipal.toFixed(2)}€</strong>
            </div>
            <div class="resumen-item">
                <span>${labelIva} ${porc}%:</span>
                <span class="iva-color">${valIva.toFixed(2)}€</span>
            </div>
            <div class="resumen-total">
                <div class="total-info">
                    <span>${labelFinal}:</span>
                    <strong id="valor-total">${valorParaCopiar}€</strong>
                </div>
                <button class="btn-copy" onclick="copiarAlPortapapeles('${valorParaCopiar}')" title="Copiar resultado">
                    <span class="copy-icon">📋</span>
                    <span class="copy-text">Copiar</span>
                </button>
            </div>
        </div>
    `;
};

// Función global para copiar (fuera del DOMContentLoaded o dentro, pero accesible)
window.copiarAlPortapapeles = (valor) => {
    navigator.clipboard.writeText(valor).then(() => {
        const btn = document.querySelector('.btn-copy');
        const originalText = btn.innerHTML;
        
        // Feedback visual de que se ha copiado
        btn.innerHTML = '✅ ¡Copiado!';
        btn.classList.add('copied');
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('copied');
        }, 2000);
    });
};

    // Eventos de clic
    btnAdd.addEventListener('click', () => calcularIVA('add'));
    btnRemove.addEventListener('click', () => calcularIVA('remove'));

    // Evento de tecla Enter
    importeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            // Por defecto, Enter suma el IVA si no se especifica
            calcularIVA('add');
        }
    });
});
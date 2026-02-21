document.addEventListener("DOMContentLoaded", () => {
    const importeInput = document.querySelector('.importe');
    const tipoIvaSelect = document.querySelector('.tipo-iva');
    const resultDiv = document.querySelector('.result-iva');
    const btnAdd = document.querySelector('.btn-add-iva');
    const btnRemove = document.querySelector('.btn-remove-iva');

    if (!btnAdd || !btnRemove) return;

    // Leemos las traducciones una sola vez al cargar
    const txt = resultDiv.dataset;

    const calcularIVA = (tipo) => {
        // Validación usando el mensaje del HTML
        if (!importeInput.value || isNaN(importeInput.value)) {
            resultDiv.innerHTML = `<div class="error-msg">${txt.msError || "⚠️ Error"}</div>`;
            return;
        }

        const importe = parseFloat(importeInput.value);
        const porcentaje = parseFloat(tipoIvaSelect.value);
        const moneda = txt.symbol || "€";
        let ivaCalculado, base, total;

        if (tipo === 'add') {
            base = importe;
            ivaCalculado = base * (porcentaje / 100);
            total = base + ivaCalculado;
            
            // Enviamos los labels definidos en el HTML para "Añadir"
            renderResult(
                txt.labelBase, 
                base, 
                `${txt.labelIva} (+)`, 
                ivaCalculado, 
                txt.labelTotalAdd, 
                total, 
                "add", 
                porcentaje,
                moneda
            );
        } else {
            total = importe;
            base = total / (1 + (porcentaje / 100));
            ivaCalculado = total - base;
            
            // Enviamos los labels definidos en el HTML para "Desglosar"
            renderResult(
                txt.labelTotalRemove, 
                total, 
                `${txt.labelIva} (-)`, 
                ivaCalculado, 
                txt.labelBase, 
                base, 
                "remove", 
                porcentaje,
                moneda
            );
        }
    };

    const renderResult = (labelPrincipal, valPrincipal, labelIva, valIva, labelFinal, valFinal, clase, porc, moneda) => {
        const valorParaCopiar = valFinal.toFixed(2);
        
        resultDiv.innerHTML = `
            <div class="resumen-calculo ${clase}">
                <div class="resumen-header">${txt.header}</div>
                <div class="resumen-item">
                    <span>${labelPrincipal}:</span>
                    <strong>${valPrincipal.toFixed(2)}${moneda}</strong>
                </div>
                <div class="resumen-item">
                    <span>${labelIva} ${porc}%:</span>
                    <span class="iva-color">${valIva.toFixed(2)}${moneda}</span>
                </div>
                <div class="resumen-total">
                    <div class="total-info">
                        <span>${labelFinal}:</span>
                        <strong id="valor-total">${valorParaCopiar}${moneda}</strong>
                    </div>
                    <button class="btn-copy" 
                            onclick="window.copiarAlPortapapeles('${valorParaCopiar}', this)" 
                            title="${txt.btnCopy}">
                        <span class="copy-icon">📋</span>
                        <span class="copy-text">${txt.btnCopy}</span>
                    </button>
                </div>
            </div>
        `;
    };

    // Función de copiar mejorada para ser independiente del idioma
    window.copiarAlPortapapeles = (valor, btn) => {
        navigator.clipboard.writeText(valor).then(() => {
            const copyText = btn.querySelector('.copy-text');
            const originalText = txt.btnCopy;
            
            copyText.innerText = txt.btnCopied;
            btn.classList.add('copied');
            
            setTimeout(() => {
                copyText.innerText = originalText;
                btn.classList.remove('copied');
            }, 2000);
        });
    };

    // Eventos
    btnAdd.addEventListener('click', () => calcularIVA('add'));
    btnRemove.addEventListener('click', () => calcularIVA('remove'));

    importeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calcularIVA('add');
        }
    });
});
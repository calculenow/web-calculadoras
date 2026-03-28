document.addEventListener("DOMContentLoaded", () => {
  const importeInput = document.querySelector('.importe');
  const tipoIvaSelect = document.querySelector('.tipo-iva');
  const resultDiv = document.querySelector('.result-iva');
  const btnAdd = document.querySelector('.btn-add-iva');
  const btnRemove = document.querySelector('.btn-remove-iva');

  if (!btnAdd || !btnRemove || !resultDiv) return;

  const txt = resultDiv.dataset;

  const calcularIVA = (tipo) => {
    if (!importeInput.value.trim() || isNaN(parseFloat(importeInput.value))) {
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
      renderResult(txt.labelBase, base, `${txt.labelIva} (+)`, ivaCalculado, txt.labelTotalAdd, total, "add", porcentaje, moneda);
    } else {
      total = importe;
      base = total / (1 + (porcentaje / 100));
      ivaCalculado = total - base;
      renderResult(txt.labelTotalRemove, total, `${txt.labelIva} (-)`, ivaCalculado, txt.labelBase, base, "remove", porcentaje, moneda);
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
            <strong>${valorParaCopiar}${moneda}</strong>
          </div>
          <button class="btn-copy" data-copy-value="${valorParaCopiar}" title="${txt.btnCopy}">
            <span class="copy-icon">📋</span>
            <span class="copy-text">${txt.btnCopy}</span>
          </button>
        </div>
      </div>
    `;

    resultDiv.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyValue).then(() => {
        const copyText = this.querySelector('.copy-text');
        copyText.innerText = txt.btnCopied;
        this.classList.add('copied');
        setTimeout(() => {
          copyText.innerText = txt.btnCopy;
          this.classList.remove('copied');
        }, 2000);
      });
    });
  };

  btnAdd.addEventListener('click', () => calcularIVA('add'));
  btnRemove.addEventListener('click', () => calcularIVA('remove'));

  importeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calcularIVA('add');
  });
});
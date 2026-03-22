document.addEventListener("DOMContentLoaded", () => {
  const precioInput = document.querySelector('.precio-original');
  const pctInput = document.querySelector('.descuento-pct');
  const resultDiv = document.querySelector('.result-discount');
  const btn = document.querySelector('.btn-discount');

  if (!btn || !resultDiv) return;

  const labels = resultDiv.dataset;

  btn.addEventListener('click', () => {
    if (!validarNumeros([precioInput, pctInput])) {
      resultDiv.textContent = labels.error;
      return;
    }

    const precio = parseFloat(precioInput.value);
    const descuento = parseFloat(pctInput.value);
    const ahorro = (precio * descuento) / 100;
    const precioFinal = precio - ahorro;

    const resFinalStr = precioFinal.toFixed(2) + labels.unit;
    const ahorroStr = ahorro.toFixed(2) + labels.unit;
    const textoCopia = `${labels.labelFinal} ${resFinalStr}\n${labels.labelSave} ${ahorroStr}`;

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p>${labels.labelFinal} <strong class="descuento-precio-final">${resFinalStr}</strong></p>
        <p class="descuento-ahorro">${labels.labelSave} ${ahorroStr}</p>
        <button class="btn-copy" data-copy-text="${textoCopia}">
          ${labels.btnCopy || 'Copiar'}
        </button>
      </div>
    `;

    resultDiv.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = "✅";
        setTimeout(() => this.innerText = original, 2000);
      });
    });
  });

  [precioInput, pctInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btn.click();
    });
  });
});
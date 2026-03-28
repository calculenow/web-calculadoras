/**
 * oro.js
 * Calculadora del valor del oro.
 * Todos los textos visibles se leen desde data-* del div#oro-result (i18n via HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

  const btn       = document.getElementById('btn-calcular');
  const resultDiv = document.getElementById('oro-result');

  if (!btn || !resultDiv) return;

  const d = resultDiv.dataset;

  // ── HELPERS ────────────────────────────────────────────────────────────────
  const fmtCurrency = n => n.toLocaleString(d.locale, {
    style: 'currency',
    currency: d.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    const peso      = parseFloat(document.getElementById('peso-oro').value);
    const pureza    = parseFloat(document.getElementById('pureza').value);
    const precioEur = parseFloat(document.getElementById('precio-oro').value);

    if (isNaN(peso) || peso <= 0) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorPeso}</p>`;
      return;
    }
    if (isNaN(precioEur) || precioEur <= 0) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorPrecio}</p>`;
      return;
    }

    const purLabel = document.getElementById('pureza').selectedOptions[0].text;
    const valor    = peso * precioEur * pureza;

    const textoCopiar = [
      `${d.labelPeso}: ${peso} ${d.labelGrams}`,
      `${d.labelPureza}: ${purLabel}`,
      `${d.labelPrice24k}: ${fmtCurrency(precioEur)}/${d.labelGrams}`,
      `${d.labelValue}: ${fmtCurrency(valor)}`,
    ].join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <ul>
          <li><span>${d.labelPeso}</span><span>${peso} ${d.labelGrams}</span></li>
          <li><span>${d.labelPureza}</span><span>${purLabel}</span></li>
          <li><span>${d.labelPrice24k}</span><span>${fmtCurrency(precioEur)}/${d.labelGrams}</span></li>
          <li class="total-destacado"><span>${d.labelValue}</span><span>${fmtCurrency(valor)}</span></li>
        </ul>
        <button class="btn-copy" data-copy-text="${textoCopiar}">📋 ${d.btnCopy}</button>
      </div>
    `;

    resultDiv.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = '✅';
        this.classList.add('copied');
        setTimeout(() => { this.innerText = original; this.classList.remove('copied'); }, 2000);
      });
    });
  });

  document.querySelectorAll('.oro-card input').forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
  });

});
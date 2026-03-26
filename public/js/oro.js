/**
 * oro.js
 * Calculadora del valor del oro en euros.
 * El usuario introduce el precio actual del oro (€/gramo)
 * y la calculadora devuelve el valor según peso y pureza.
 */

document.addEventListener('DOMContentLoaded', () => {

  const btn       = document.getElementById('btn-calcular');
  const resultDiv = document.getElementById('oro-result');

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function fmtEur(n) {
    return n.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  btn?.addEventListener('click', () => {
    const peso      = parseFloat(document.getElementById('peso-oro').value);
    const pureza    = parseFloat(document.getElementById('pureza').value);
    const precioEur = parseFloat(document.getElementById('precio-oro').value);

    if (isNaN(peso) || peso <= 0) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce un peso válido en gramos.</p>';
      return;
    }
    if (isNaN(precioEur) || precioEur <= 0) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce el precio actual del oro.</p>';
      return;
    }

    const purLabel = document.getElementById('pureza').selectedOptions[0].text;
    const valor    = peso * precioEur * pureza;

    const textoCopiar = [
      `Peso: ${peso} g`,
      `Pureza: ${purLabel}`,
      `Precio oro 24K: ${fmtEur(precioEur)}/g`,
      `Valor: ${fmtEur(valor)}`,
    ].join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <ul>
          <li><span>Peso</span><span>${peso} gramos</span></li>
          <li><span>Pureza</span><span>${purLabel}</span></li>
          <li><span>Precio 24K</span><span>${fmtEur(precioEur)}/g</span></li>
          <li class="total-destacado"><span>Valor en euros</span><span>${fmtEur(valor)}</span></li>
        </ul>
        <button class="btn-copy" data-copy-text="${textoCopiar}">📋 Copiar resultado</button>
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

  // Soporte Enter
  document.querySelectorAll('.oro-card input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') btn?.click();
    });
  });

});
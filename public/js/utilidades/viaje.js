/**
 * viaje.js
 * Calculadora de coste de viaje en coche.
 * Todos los textos visibles se leen desde data-* del div#viaje-result (i18n via HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

  const btn       = document.getElementById('btn-calcular');
  const resultDiv = document.getElementById('viaje-result');

  if (!btn || !resultDiv) return;

  const d = resultDiv.dataset;

  // ── PERFILES RÁPIDOS ───────────────────────────────────────────────────────
  document.querySelectorAll('.btn-mini[data-consumo]').forEach(b => {
    b.addEventListener('click', () => {
      document.getElementById('consumo').value = b.dataset.consumo;
    });
  });

  // ── HELPERS ────────────────────────────────────────────────────────────────
  const fmt = n => n.toLocaleString(d.locale, {
    style: 'currency',
    currency: d.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const fmtL = n => n.toLocaleString(d.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ` ${d.labelLitres}`;

  // ── CÁLCULO ────────────────────────────────────────────────────────────────
  const calcular = () => {
    const distanciaBase = parseFloat(document.getElementById('distancia').value);
    const multiplicador = parseFloat(document.getElementById('ida-vuelta').value);
    const consumo       = parseFloat(document.getElementById('consumo').value);
    const precioComb    = parseFloat(document.getElementById('precio-combustible').value);
    const peajes        = parseFloat(document.getElementById('peajes').value) || 0;
    const ocupantes     = parseInt(document.getElementById('ocupantes').value) || 1;

    if (isNaN(distanciaBase) || distanciaBase <= 0) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorDist}</p>`;
      return;
    }
    if (isNaN(consumo) || consumo <= 0) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorConsumo}</p>`;
      return;
    }
    if (isNaN(precioComb) || precioComb <= 0) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorPrecio}</p>`;
      return;
    }

    const distanciaTotal   = distanciaBase * multiplicador;
    const litros           = (distanciaTotal * consumo) / 100;
    const costeCombustible = litros * precioComb;
    const costeTotal       = costeCombustible + peajes;
    const costePorPersona  = costeTotal / ocupantes;
    const tipoTrayecto     = multiplicador === 2 ? d.labelRoundTrip : d.labelOneWay;

    const textoCopiar = [
      `${d.labelTrip}: ${distanciaTotal.toLocaleString(d.locale)} km (${tipoTrayecto})`,
      `${d.labelLitresNeeded}: ${fmtL(litros)}`,
      `${d.labelFuelCost}: ${fmt(costeCombustible)}`,
      peajes > 0 ? `${d.labelTolls}: ${fmt(peajes)}` : null,
      `${d.labelTotal}: ${fmt(costeTotal)}`,
      ocupantes > 1 ? `${d.labelPerPerson} (${ocupantes}): ${fmt(costePorPersona)}` : null,
    ].filter(Boolean).join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${d.labelTitle}</p>
        <ul>
          <li><span>${d.labelTotalDist}</span><span>${distanciaTotal.toLocaleString(d.locale)} km</span></li>
          <li><span>${d.labelLitresNeeded}</span><span>${fmtL(litros)}</span></li>
          <li><span>${d.labelFuelCost}</span><span>${fmt(costeCombustible)}</span></li>
          ${peajes > 0 ? `<li><span>${d.labelTolls}</span><span>${fmt(peajes)}</span></li>` : ''}
          <li class="total-destacado"><span>${d.labelTotal}</span><span>${fmt(costeTotal)}</span></li>
          ${ocupantes > 1 ? `<li><span>${d.labelPerPerson} (${ocupantes})</span><span>${fmt(costePorPersona)}</span></li>` : ''}
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
  };

  btn.addEventListener('click', calcular);

  document.querySelectorAll('.viaje-card input').forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') calcular(); });
  });

});
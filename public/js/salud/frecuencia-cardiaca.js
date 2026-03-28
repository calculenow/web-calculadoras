/**
 * frecuencia-cardiaca.js
 * Calculadora de frecuencia cardíaca máxima y zonas de entrenamiento.
 * Fórmulas: Tanaka (FCM), Karvonen (zonas con FC reposo)
 * Todos los textos visibles se leen desde data-* del div#cardiaca-result (i18n via HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

  const btn       = document.getElementById('btn-calcular');
  const resultDiv = document.getElementById('cardiaca-result');

  if (!btn || !resultDiv) return;

  const d = resultDiv.dataset;

  // ── ZONAS — textos desde data-* ────────────────────────────────────────────
  // El HTML provee: data-zone-N-name, data-zone-N-desc para N = 1..5
  const zonas = [1, 2, 3, 4, 5].map(n => ({
    num:    n,
    nombre: d[`zone${n}Name`],
    desc:   d[`zone${n}Desc`],
    min:    [0.50, 0.60, 0.70, 0.80, 0.90][n - 1],
    max:    [0.60, 0.70, 0.80, 0.90, 1.00][n - 1],
    color:  ['#6ee7b7', '#34d399', '#fbbf24', '#f97316', '#ef4444'][n - 1],
  }));

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function calcZona(fcm, fcr, zona, usarKarvonen) {
    if (usarKarvonen && fcr > 0) {
      const reserva = fcm - fcr;
      return {
        min: Math.round(fcr + zona.min * reserva),
        max: Math.round(fcr + zona.max * reserva),
      };
    }
    return {
      min: Math.round(zona.min * fcm),
      max: Math.round(zona.max * fcm),
    };
  }

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    const edad   = parseFloat(document.getElementById('edad').value);
    const formula = document.getElementById('formula').value;
    const fcrVal  = parseFloat(document.getElementById('fc-reposo').value);

    if (isNaN(edad) || edad <= 0) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msError}</p>`;
      return;
    }

    const fcm = formula === 'tanaka'
      ? Math.round(208 - 0.7 * edad)
      : Math.round(220 - edad);

    const usarKarvonen = !isNaN(fcrVal) && fcrVal > 0 && fcrVal < fcm;
    const fcr          = usarKarvonen ? fcrVal : 0;
    const formulaLabel = formula === 'tanaka' ? d.labelTanaka : d.labelClassic;
    const metodoZonas  = usarKarvonen ? d.labelKarvonen : d.labelPctFcm;

    const zonasHTML = zonas.map(z => {
      const { min, max } = calcZona(fcm, fcr, z, usarKarvonen);
      return `
        <li class="cardiaca-zona">
          <div class="cardiaca-zona-dot" style="background:${z.color}"></div>
          <div class="cardiaca-zona-info">
            <span class="cardiaca-zona-nombre">${d.labelZone} ${z.num} — ${z.nombre}</span>
            <span class="cardiaca-zona-desc">${z.desc}</span>
          </div>
          <span class="cardiaca-zona-rango">${min}–${max} ${d.labelBpm}</span>
        </li>
      `;
    }).join('');

    const textoCopiar = [
      `${d.labelFcmax} (${formulaLabel}): ${fcm} ${d.labelBpm}`,
      usarKarvonen ? `${d.labelFcrest}: ${fcr} ${d.labelBpm}` : '',
      `${d.labelZoneMethod}: ${metodoZonas}`,
      '',
      ...zonas.map(z => {
        const { min, max } = calcZona(fcm, fcr, z, usarKarvonen);
        return `${d.labelZone} ${z.num} (${z.nombre}): ${min}–${max} ${d.labelBpm}`;
      }),
    ].filter(Boolean).join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${d.labelFcmax}: ${fcm} ${d.labelBpm}</p>
        <ul class="cardiaca-meta">
          <li><span>${d.labelFormulaFcm}</span><span>${formulaLabel}</span></li>
          ${usarKarvonen ? `<li><span>${d.labelFcrest}</span><span>${fcr} ${d.labelBpm}</span></li>` : ''}
          <li><span>${d.labelZoneMethod}</span><span>${metodoZonas}</span></li>
        </ul>
        <ul class="cardiaca-zonas-lista">
          ${zonasHTML}
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

  document.querySelectorAll('.cardiaca-card input').forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
  });

});
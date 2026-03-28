/**
 * frecuencia-cardiaca.js
 * Calculadora de frecuencia cardíaca máxima y zonas de entrenamiento.
 * Fórmulas: Tanaka (FCM), Karvonen (zonas con FC reposo)
 */

document.addEventListener('DOMContentLoaded', () => {

  const btn       = document.getElementById('btn-calcular');
  const resultDiv = document.getElementById('cardiaca-result');

  // ── ZONAS ──────────────────────────────────────────────────────────────────
  const zonas = [
    { num: 1, nombre: 'Recuperación activa', min: 0.50, max: 0.60, color: '#6ee7b7', desc: 'Calentamiento, enfriamiento, días de descanso activo.' },
    { num: 2, nombre: 'Quema de grasas',     min: 0.60, max: 0.70, color: '#34d399', desc: 'Resistencia base, quema de grasa, ideal para rodajes largos.' },
    { num: 3, nombre: 'Aeróbica',            min: 0.70, max: 0.80, color: '#fbbf24', desc: 'Mejora cardiovascular, aumenta el VO₂ máx.' },
    { num: 4, nombre: 'Anaeróbica',          min: 0.80, max: 0.90, color: '#f97316', desc: 'Umbral de lactato, mejora velocidad y rendimiento.' },
    { num: 5, nombre: 'Esfuerzo máximo',     min: 0.90, max: 1.00, color: '#ef4444', desc: 'Potencia máxima, intervalos cortos, solo deportistas entrenados.' },
  ];

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
  btn?.addEventListener('click', () => {
    const edad    = parseFloat(document.getElementById('edad').value);
    const formula = document.getElementById('formula').value;
    const fcrVal  = parseFloat(document.getElementById('fc-reposo').value);

    if (isNaN(edad) || edad <= 0) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce tu edad.</p>';
      return;
    }

    const fcm = formula === 'tanaka'
      ? Math.round(208 - 0.7 * edad)
      : Math.round(220 - edad);

    const usarKarvonen = !isNaN(fcrVal) && fcrVal > 0 && fcrVal < fcm;
    const fcr          = usarKarvonen ? fcrVal : 0;
    const formulaLabel = formula === 'tanaka' ? 'Tanaka' : 'Clásica (220 − edad)';
    const metodoZonas  = usarKarvonen ? 'Karvonen (con FC reposo)' : '% FCM';

    const zonasHTML = zonas.map(z => {
      const { min, max } = calcZona(fcm, fcr, z, usarKarvonen);
      return `
        <li class="cardiaca-zona">
          <div class="cardiaca-zona-dot" style="background:${z.color}"></div>
          <div class="cardiaca-zona-info">
            <span class="cardiaca-zona-nombre">Zona ${z.num} — ${z.nombre}</span>
            <span class="cardiaca-zona-desc">${z.desc}</span>
          </div>
          <span class="cardiaca-zona-rango">${min}–${max} ppm</span>
        </li>
      `;
    }).join('');

    const textoCopiar = [
      `FC Máxima (${formulaLabel}): ${fcm} ppm`,
      usarKarvonen ? `FC Reposo: ${fcr} ppm` : '',
      `Método zonas: ${metodoZonas}`,
      '',
      ...zonas.map(z => {
        const { min, max } = calcZona(fcm, fcr, z, usarKarvonen);
        return `Zona ${z.num} (${z.nombre}): ${min}–${max} ppm`;
      }),
    ].filter(Boolean).join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">FC Máxima estimada: ${fcm} ppm</p>
        <ul class="cardiaca-meta">
          <li><span>Fórmula FCM</span><span>${formulaLabel}</span></li>
          ${usarKarvonen ? `<li><span>FC en reposo</span><span>${fcr} ppm</span></li>` : ''}
          <li><span>Método zonas</span><span>${metodoZonas}</span></li>
        </ul>
        <ul class="cardiaca-zonas-lista">
          ${zonasHTML}
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
  document.querySelectorAll('.cardiaca-card input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') btn?.click();
    });
  });

});
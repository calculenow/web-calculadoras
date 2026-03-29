/**
 * edad-perro.js
 * Convierte la edad de un perro a años humanos.
 * Fórmula logarítmica UC San Diego (2019): humanos = 16 × ln(edad) + 31
 * Textos via data-* de div#perro-i18n (i18n via HTML).
 */

import { renderShareButtons } from '/js/curiosidades/share.js';

document.addEventListener('DOMContentLoaded', () => {

  const i18n = document.getElementById('perro-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

  const btn       = document.getElementById('btn-calcular');
  const inputEdad = document.getElementById('edad-perro');
  const resultado = document.getElementById('resultado');

  const params = new URLSearchParams(window.location.search);
  if (params.get('edad')) {
    inputEdad.value = params.get('edad');
    setTimeout(() => btn.click(), 100);
  }

  btn?.addEventListener('click', () => {
    const edadPerro = parseFloat(inputEdad.value);
    if (isNaN(edadPerro) || edadPerro <= 0) {
      resultado.innerHTML = `<p class="error-msg">⚠️ ${d.msError}</p>`;
      return;
    }

    const edadHumana = Math.round(16 * Math.log(edadPerro) + 31);
    const regla7     = Math.round(edadPerro * 7);

    // Etapa vital — leída del HTML
    let etapaKey;
    if (edadPerro <= 1)       etapaKey = 'stagePuppy';
    else if (edadPerro <= 3)  etapaKey = 'stageYoung';
    else if (edadPerro <= 7)  etapaKey = 'stageAdult';
    else if (edadPerro <= 11) etapaKey = 'stageMature';
    else                      etapaKey = 'stageSenior';

    const etapa = d[etapaKey];

    const shareText = d.shareText
      .replace('{edad}', edadPerro)
      .replace('{humana}', edadHumana);

    const shareContainer = document.createElement('div');

    resultado.innerHTML = `
      <div class="resumen-calculo curiosidad-resumen">
        <p class="curiosidad-numero">${edadHumana} ${d.labelYears}</p>
        <p class="curiosidad-subtitulo">${d.labelSubtitle}</p>
        <ul>
          <li><span>${d.labelDogAge}</span><span>${edadPerro} ${d.labelYears}</span></li>
          <li><span>${d.labelStage}</span><span>${etapa}</span></li>
          <li><span>${d.labelScientific}</span><span>${edadHumana} ${d.labelYears}</span></li>
          <li><span>${d.labelRule7}</span><span>${regla7} ${d.labelYears}</span></li>
        </ul>
      </div>
    `;
    resultado.appendChild(shareContainer);
    renderShareButtons(shareContainer, shareText, d.shareUrl);
  });

  inputEdad?.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
});
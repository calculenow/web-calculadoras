/**
 * dormido.js — duermes ~8h/día de media = 1 vez por día
 * Textos via data-* de div#dormido-i18n (i18n via HTML).
 */

import { renderShareButtons } from '/js/curiosidades/share.js';

document.addEventListener('DOMContentLoaded', () => {

  const i18n = document.getElementById('dormido-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

  const btn       = document.getElementById('btn-calcular');
  const inputEdad = document.getElementById('edad');
  const resultado = document.getElementById('resultado');

  const params = new URLSearchParams(window.location.search);
  if (params.get('edad')) {
    inputEdad.value = params.get('edad');
    setTimeout(() => btn.click(), 100);
  }

  function fmt(n) { return Math.round(n).toLocaleString(d.locale); }

  btn?.addEventListener('click', () => {
    const edad = parseFloat(inputEdad.value);
    if (isNaN(edad) || edad <= 0) {
      resultado.innerHTML = `<p class="error-msg">⚠️ ${d.msError}</p>`;
      return;
    }

    const noches       = Math.round(edad * 365.25);
    const horasDormido = Math.round(noches * 8);
    const aniosDormido = (horasDormido / 8760).toFixed(1).replace('.', d.decimalSep);
    const diasDormido  = Math.round(horasDormido / 24);

    const shareText = d.shareText
      .replace('{n}', fmt(noches))
      .replace('{edad}', edad)
      .replace('{anios}', aniosDormido);

    const shareContainer = document.createElement('div');

    resultado.innerHTML = `
      <div class="resumen-calculo curiosidad-resumen">
        <p class="curiosidad-numero">${fmt(noches)}</p>
        <p class="curiosidad-subtitulo">${d.labelSubtitle}</p>
        <ul>
          <li><span>${d.labelAge}</span><span>${edad} ${d.labelYears}</span></li>
          <li><span>${d.labelHours}</span><span>${fmt(horasDormido)} h</span></li>
          <li><span>${d.labelDays}</span><span>${fmt(diasDormido)} ${d.labelDaysUnit}</span></li>
          <li><span>${d.labelYearsSleeping}</span><span>${aniosDormido} ${d.labelYears}</span></li>
        </ul>
      </div>
    `;
    resultado.appendChild(shareContainer);
    renderShareButtons(shareContainer, shareText, d.shareUrl);
  });

  inputEdad?.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
});
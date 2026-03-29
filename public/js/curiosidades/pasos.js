/**
 * pasos.js — ~7.500 pasos/día de media mundial
 * Textos via data-* de div#pasos-i18n (i18n via HTML).
 */

import { renderShareButtons } from '/js/curiosidades/share.js';

document.addEventListener('DOMContentLoaded', () => {

  const i18n = document.getElementById('pasos-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

  const PASOS_DIA = 7500;
  const btn       = document.getElementById('btn-calcular');
  const inputEdad = document.getElementById('edad');
  const resultado = document.getElementById('resultado');

  const params = new URLSearchParams(window.location.search);
  if (params.get('edad')) {
    inputEdad.value = params.get('edad');
    setTimeout(() => btn.click(), 100);
  }

  function enMiles(n) {
    n = Math.round(n);
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2).replace('.', d.decimalSep)} ${d.labelBillion}`;
    if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)} ${d.labelMillion}`;
    return n.toLocaleString(d.locale);
  }

  function fmt(n) { return Math.round(n).toLocaleString(d.locale); }

  btn?.addEventListener('click', () => {
    const edad = parseFloat(inputEdad.value);
    if (isNaN(edad) || edad <= 0) {
      resultado.innerHTML = `<p class="error-msg">⚠️ ${d.msError}</p>`;
      return;
    }

    const dias  = edad * 365.25;
    const total = dias * PASOS_DIA;
    const km    = Math.round(total * 0.0007).toLocaleString(d.locale);

    const shareText = d.shareText
      .replace('{n}', enMiles(total))
      .replace('{edad}', edad)
      .replace('{km}', km);

    const shareContainer = document.createElement('div');

    resultado.innerHTML = `
      <div class="resumen-calculo curiosidad-resumen">
        <p class="curiosidad-numero">${enMiles(total)}</p>
        <p class="curiosidad-subtitulo">${d.labelSubtitle}</p>
        <ul>
          <li><span>${d.labelAge}</span><span>${edad} ${d.labelYears}</span></li>
          <li><span>${d.labelPerDay}</span><span>${fmt(PASOS_DIA)}</span></li>
          <li><span>${d.labelTotal}</span><span>${fmt(total)}</span></li>
          <li><span>${d.labelDistance}</span><span>${km} ${d.labelKm}</span></li>
        </ul>
      </div>
    `;
    resultado.appendChild(shareContainer);
    renderShareButtons(shareContainer, shareText, d.shareUrl);
  });

  inputEdad?.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
});
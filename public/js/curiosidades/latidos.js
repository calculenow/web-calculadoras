/**
 * latidos.js
 * Calcula los latidos acumulados en la vida del usuario.
 * FC media: 70 ppm.
 * Textos via data-* de div#latidos-i18n (i18n via HTML).
 */

import { renderShareButtons } from '/js/curiosidades/share.js';

document.addEventListener('DOMContentLoaded', () => {

  const i18n = document.getElementById('latidos-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

  const FC_MEDIA  = 70;
  const btnCalc   = document.getElementById('btn-calcular');
  const inputEdad = document.getElementById('edad');
  const resultado = document.getElementById('resultado');

  const params = new URLSearchParams(window.location.search);
  if (params.get('edad')) {
    inputEdad.value = params.get('edad');
    setTimeout(() => btnCalc.click(), 100);
  }

  function enMiles(n) {
    n = Math.round(n);
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2).replace('.', d.decimalSep)} ${d.labelBillion}`;
    if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)} ${d.labelMillion}`;
    return n.toLocaleString(d.locale);
  }

  function fmt(n) { return Math.round(n).toLocaleString(d.locale); }

  btnCalc?.addEventListener('click', () => {
    const edad = parseFloat(inputEdad.value);
    if (isNaN(edad) || edad <= 0) {
      resultado.innerHTML = `<p class="error-msg">⚠️ ${d.msError}</p>`;
      return;
    }

    const minutos     = edad * 365.25 * 24 * 60;
    const latidos     = minutos * FC_MEDIA;
    const latidosHoy  = FC_MEDIA * 60 * 24;
    const latidosAnio = FC_MEDIA * 60 * 24 * 365.25;

    const shareText = d.shareText.replace('{n}', enMiles(latidos)).replace('{edad}', edad);
    const shareContainer = document.createElement('div');

    resultado.innerHTML = `
      <div class="resumen-calculo curiosidad-resumen">
        <p class="curiosidad-numero">${enMiles(latidos)}</p>
        <p class="curiosidad-subtitulo">${d.labelSubtitle}</p>
        <ul>
          <li><span>${d.labelAge}</span><span>${edad} ${d.labelYears}</span></li>
          <li><span>${d.labelPerDay}</span><span>${fmt(latidosHoy)}</span></li>
          <li><span>${d.labelPerYear}</span><span>${fmt(latidosAnio)}</span></li>
          <li><span>${d.labelTotal}</span><span>${fmt(latidos)}</span></li>
        </ul>
      </div>
    `;
    resultado.appendChild(shareContainer);
    renderShareButtons(shareContainer, shareText, d.shareUrl);
  });

  inputEdad?.addEventListener('keydown', e => { if (e.key === 'Enter') btnCalc.click(); });
});
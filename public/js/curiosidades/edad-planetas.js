/**
 * edad-planetas.js
 * Calcula la edad del usuario en cada planeta del sistema solar.
 * Textos via data-* de div#planetas-i18n (i18n via HTML).
 */

import { renderShareButtons } from '/js/curiosidades/share.js';

document.addEventListener('DOMContentLoaded', () => {

  const i18n = document.getElementById('planetas-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

  // Períodos orbitales en días terrestres — constantes matemáticas, no textos
  const PLANETAS = [
    { key: 'mercury', emoji: '⬛', periodo: 87.97 },
    { key: 'venus',   emoji: '🟡', periodo: 224.7 },
    { key: 'mars',    emoji: '🔴', periodo: 686.97 },
    { key: 'jupiter', emoji: '🟠', periodo: 4332.59 },
    { key: 'saturn',  emoji: '🪐', periodo: 10759.22 },
    { key: 'uranus',  emoji: '🔵', periodo: 30688.5 },
    { key: 'neptune', emoji: '💙', periodo: 60182.0 },
  ];

  const btn       = document.getElementById('btn-calcular');
  const inputEdad = document.getElementById('edad');
  const resultado = document.getElementById('resultado');

  const params = new URLSearchParams(window.location.search);
  if (params.get('edad')) {
    inputEdad.value = params.get('edad');
    setTimeout(() => btn.click(), 100);
  }

  btn?.addEventListener('click', () => {
    const edad = parseFloat(inputEdad.value);
    if (isNaN(edad) || edad <= 0) {
      resultado.innerHTML = `<p class="error-msg">⚠️ ${d.msError}</p>`;
      return;
    }

    const diasVividos = edad * 365.25;

    const filas = PLANETAS.map(p => {
      const edadPlaneta = (diasVividos / p.periodo).toFixed(1).replace('.', d.decimalSep);
      const nombre = d[`planet${p.key.charAt(0).toUpperCase() + p.key.slice(1)}`];
      const dato   = d[`fact${p.key.charAt(0).toUpperCase() + p.key.slice(1)}`];
      return `<li><span>${p.emoji} ${nombre} <small>(${dato})</small></span><span>${edadPlaneta} ${d.labelYears}</span></li>`;
    }).join('');

    const edadMercurio = (diasVividos / 87.97).toFixed(1).replace('.', d.decimalSep);
    const edadNeptuno  = (diasVividos / 60182).toFixed(2).replace('.', d.decimalSep);

    const shareText = d.shareText
      .replace('{edad}', edad)
      .replace('{mercury}', edadMercurio)
      .replace('{neptune}', edadNeptuno);

    const shareContainer = document.createElement('div');

    resultado.innerHTML = `
      <div class="resumen-calculo curiosidad-resumen">
        <p class="curiosidad-numero">${d.labelTitle}</p>
        <p class="curiosidad-subtitulo">${d.labelSubtitle.replace('{edad}', edad)}</p>
        <ul>${filas}</ul>
      </div>
    `;
    resultado.appendChild(shareContainer);
    renderShareButtons(shareContainer, shareText, d.shareUrl);
  });

  inputEdad?.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
});
/**
 * respiraciones.js — ~16 respiraciones/minuto de media
 */
document.addEventListener('DOMContentLoaded', () => {
  const RESP_MIN  = 16;
  const btn       = document.getElementById('btn-calcular');
  const inputEdad = document.getElementById('edad');
  const resultado = document.getElementById('resultado');

  const params = new URLSearchParams(window.location.search);
  if (params.get('edad')) { inputEdad.value = params.get('edad'); setTimeout(() => btn.click(), 100); }

  function enMiles(n) {
    n = Math.round(n);
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2).replace('.', ',')} mil millones`;
    if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)} millones`;
    return n.toLocaleString('es-ES');
  }
  function fmt(n) { return Math.round(n).toLocaleString('es-ES'); }

  btn?.addEventListener('click', () => {
    const edad = parseFloat(inputEdad.value);
    if (isNaN(edad) || edad <= 0) { resultado.innerHTML = '<p class="error-msg">⚠️ Introduce tu edad.</p>'; return; }

    const minutos = edad * 365.25 * 24 * 60;
    const total   = minutos * RESP_MIN;
    const porDia  = RESP_MIN * 60 * 24;
    const porAnio = porDia * 365.25;

    const shareUrl  = `${window.location.origin}/es/respiraciones-en-tu-vida?edad=${edad}`;
    const shareText = `¡He respirado ${enMiles(total)} veces en mis ${edad} años de vida! 🌬️ ¿Y tú?`;

    resultado.innerHTML = `
      <div class="resumen-calculo curiosidad-resumen">
        <p class="curiosidad-numero">${enMiles(total)}</p>
        <p class="curiosidad-subtitulo">respiraciones desde que naciste 🌬️</p>
        <ul>
          <li><span>Tu edad</span><span>${edad} años</span></li>
          <li><span>Respiraciones por día</span><span>${fmt(porDia)}</span></li>
          <li><span>Respiraciones por año</span><span>${fmt(porAnio)}</span></li>
          <li><span>Total acumulado</span><span>${fmt(total)}</span></li>
        </ul>
        <div class="curiosidad-acciones">
          <button class="btn-copy" data-copy-text="${shareText} ${shareUrl}">📋 Copiar</button>
          <button class="btn-share" id="btn-share">🔗 Compartir</button>
        </div>
      </div>`;

    resultado.querySelector('.btn-copy')?.addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const orig = this.innerText; this.innerText = '✅'; this.classList.add('copied');
        setTimeout(() => { this.innerText = orig; this.classList.remove('copied'); }, 2000);
      });
    });
    resultado.querySelector('#btn-share')?.addEventListener('click', async () => {
      if (navigator.share) { try { await navigator.share({ title: '¿Cuántas veces has respirado?', text: shareText, url: shareUrl }); } catch {} }
      else { navigator.clipboard.writeText(shareUrl).then(() => { const b = resultado.querySelector('#btn-share'); const o = b.innerText; b.innerText = '✅ URL copiada'; setTimeout(() => b.innerText = o, 2000); }); }
    });
  });
  inputEdad?.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
});
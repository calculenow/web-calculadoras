/**
 * dormido.js — duermes ~8h/día de media = 1 vez por día
 */
document.addEventListener('DOMContentLoaded', () => {
  const btn       = document.getElementById('btn-calcular');
  const inputEdad = document.getElementById('edad');
  const resultado = document.getElementById('resultado');

  const params = new URLSearchParams(window.location.search);
  if (params.get('edad')) { inputEdad.value = params.get('edad'); setTimeout(() => btn.click(), 100); }

  function fmt(n) { return Math.round(n).toLocaleString('es-ES'); }

  btn?.addEventListener('click', () => {
    const edad = parseFloat(inputEdad.value);
    if (isNaN(edad) || edad <= 0) { resultado.innerHTML = '<p class="error-msg">⚠️ Introduce tu edad.</p>'; return; }

    const noches      = Math.round(edad * 365.25);
    const horasDormido = Math.round(noches * 8);
    const aniosDormido = (horasDormido / 8760).toFixed(1).replace('.', ',');
    const diasDormido  = Math.round(horasDormido / 24);

    const shareUrl  = `${window.location.origin}/es/veces-que-has-dormido?edad=${edad}`;
    const shareText = `¡He dormido ${fmt(noches)} veces en mis ${edad} años de vida (${aniosDormido} años durmiendo)! 😴 ¿Y tú?`;

    resultado.innerHTML = `
      <div class="resumen-calculo curiosidad-resumen">
        <p class="curiosidad-numero">${fmt(noches)}</p>
        <p class="curiosidad-subtitulo">veces que has dormido 😴</p>
        <ul>
          <li><span>Tu edad</span><span>${edad} años</span></li>
          <li><span>Horas dormidas</span><span>${fmt(horasDormido)} h</span></li>
          <li><span>Días durmiendo</span><span>${fmt(diasDormido)} días</span></li>
          <li><span>Años durmiendo</span><span>${aniosDormido} años</span></li>
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
      if (navigator.share) { try { await navigator.share({ title: '¿Cuántas veces has dormido?', text: shareText, url: shareUrl }); } catch {} }
      else { navigator.clipboard.writeText(shareUrl).then(() => { const b = resultado.querySelector('#btn-share'); const o = b.innerText; b.innerText = '✅ URL copiada'; setTimeout(() => b.innerText = o, 2000); }); }
    });
  });
  inputEdad?.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
});
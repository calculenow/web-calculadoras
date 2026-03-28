/**
 * edad-perro.js
 * Convierte la edad de un perro a años humanos.
 * Usa la fórmula logarítmica del estudio de la UC San Diego (2019),
 * más precisa que la regla simple de "×7".
 * humanos = 16 × ln(edadPerro) + 31
 */
document.addEventListener('DOMContentLoaded', () => {
  const btn        = document.getElementById('btn-calcular');
  const inputEdad  = document.getElementById('edad-perro');
  const resultado  = document.getElementById('resultado');

  const params = new URLSearchParams(window.location.search);
  if (params.get('edad')) { inputEdad.value = params.get('edad'); setTimeout(() => btn.click(), 100); }

  btn?.addEventListener('click', () => {
    const edadPerro = parseFloat(inputEdad.value);
    if (isNaN(edadPerro) || edadPerro <= 0) { resultado.innerHTML = '<p class="error-msg">⚠️ Introduce la edad de tu perro.</p>'; return; }

    const edadHumana = Math.round(16 * Math.log(edadPerro) + 31);
    const regla7     = Math.round(edadPerro * 7);

    // Etapa vital
    let etapa;
    if (edadPerro <= 1)       etapa = '🐾 Cachorro';
    else if (edadPerro <= 3)  etapa = '🐕 Joven';
    else if (edadPerro <= 7)  etapa = '🦮 Adulto';
    else if (edadPerro <= 11) etapa = '🐕‍🦺 Maduro';
    else                      etapa = '👴 Senior';

    const shareUrl  = `${window.location.origin}/es/edad-perro-en-anos-humanos?edad=${edadPerro}`;
    const shareText = `¡Mi perro tiene ${edadPerro} años pero en años humanos tiene ${edadHumana}! 🐶 ¿Y el tuyo?`;

    resultado.innerHTML = `
      <div class="resumen-calculo curiosidad-resumen">
        <p class="curiosidad-numero">${edadHumana} años</p>
        <p class="curiosidad-subtitulo">en años humanos 🐶</p>
        <ul>
          <li><span>Edad del perro</span><span>${edadPerro} años</span></li>
          <li><span>Etapa vital</span><span>${etapa}</span></li>
          <li><span>Años humanos (fórmula científica)</span><span>${edadHumana} años</span></li>
          <li><span>Regla popular (×7)</span><span>${regla7} años</span></li>
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
      if (navigator.share) { try { await navigator.share({ title: '¿Cuántos años tiene tu perro en años humanos?', text: shareText, url: shareUrl }); } catch {} }
      else { navigator.clipboard.writeText(shareUrl).then(() => { const b = resultado.querySelector('#btn-share'); const o = b.innerText; b.innerText = '✅ URL copiada'; setTimeout(() => b.innerText = o, 2000); }); }
    });
  });
  inputEdad?.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
});
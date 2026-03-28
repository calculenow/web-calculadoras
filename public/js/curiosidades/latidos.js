/**
 * latidos.js
 * Calcula los latidos acumulados en la vida del usuario.
 * FC media: 70 ppm. Solo se pide la edad.
 */

document.addEventListener('DOMContentLoaded', () => {

  const FC_MEDIA  = 70; // pulsaciones por minuto (media mundial)
  const btnCalc   = document.getElementById('btn-calcular');
  const inputEdad = document.getElementById('edad');
  const resultado = document.getElementById('resultado');

  // ── LEER PARÁMETROS DE URL (resultado compartido) ──────────────────────────
  const params = new URLSearchParams(window.location.search);
  if (params.get('edad')) {
    inputEdad.value = params.get('edad');
    setTimeout(() => btnCalc.click(), 100);
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function enMiles(n) {
    n = Math.round(n);
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2).replace('.', ',')} mil millones`;
    if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)} millones`;
    return n.toLocaleString('es-ES');
  }

  function fmt(n) {
    return Math.round(n).toLocaleString('es-ES');
  }

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  btnCalc?.addEventListener('click', () => {
    const edad = parseFloat(inputEdad.value);

    if (isNaN(edad) || edad <= 0) {
      resultado.innerHTML = '<p class="error-msg">⚠️ Introduce tu edad.</p>';
      return;
    }

    const minutos      = edad * 365.25 * 24 * 60;
    const latidos      = minutos * FC_MEDIA;
    const latidosHoy   = FC_MEDIA * 60 * 24;
    const latidosAnio  = FC_MEDIA * 60 * 24 * 365.25;

    const shareUrl  = `${window.location.origin}/es/latidos-en-tu-vida?edad=${edad}`;
    const shareText = `¡Mi corazón ha dado ${enMiles(latidos)} latidos en mis ${edad} años de vida! ❤️ ¿Cuántos has dado tú?`;

    resultado.innerHTML = `
      <div class="resumen-calculo curiosidad-resumen">
        <p class="curiosidad-numero">${enMiles(latidos)}</p>
        <p class="curiosidad-subtitulo">latidos desde que naciste ❤️</p>
        <ul>
          <li><span>Tu edad</span><span>${edad} años</span></li>
          <li><span>Latidos por día</span><span>${fmt(latidosHoy)}</span></li>
          <li><span>Latidos por año</span><span>${fmt(latidosAnio)}</span></li>
          <li><span>Total acumulado</span><span>${fmt(latidos)}</span></li>
        </ul>
        <div class="curiosidad-acciones">
          <button class="btn-copy" data-copy-text="${shareText} ${shareUrl}">📋 Copiar</button>
          <button class="btn-share" id="btn-share">🔗 Compartir</button>
        </div>
      </div>
    `;

    resultado.querySelector('.btn-copy')?.addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const orig = this.innerText;
        this.innerText = '✅';
        this.classList.add('copied');
        setTimeout(() => { this.innerText = orig; this.classList.remove('copied'); }, 2000);
      });
    });

    resultado.querySelector('#btn-share')?.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({ title: '¿Cuántos latidos ha dado tu corazón?', text: shareText, url: shareUrl });
        } catch {}
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          const btn = resultado.querySelector('#btn-share');
          const orig = btn.innerText;
          btn.innerText = '✅ URL copiada';
          setTimeout(() => { btn.innerText = orig; }, 2000);
        });
      }
    });
  });

  inputEdad?.addEventListener('keydown', e => {
    if (e.key === 'Enter') btnCalc.click();
  });

});
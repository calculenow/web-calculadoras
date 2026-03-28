/**
 * edad-planetas.js
 * Calcula la edad del usuario en cada planeta del sistema solar.
 * Basado en el período orbital de cada planeta en días terrestres.
 */
document.addEventListener('DOMContentLoaded', () => {
  const PLANETAS = [
    { nombre: 'Mercurio', emoji: '⬛', periodo: 87.97,   dato: 'el más cercano al Sol' },
    { nombre: 'Venus',    emoji: '🟡', periodo: 224.7,   dato: 'el más caliente del sistema solar' },
    { nombre: 'Marte',    emoji: '🔴', periodo: 686.97,  dato: 'el planeta rojo' },
    { nombre: 'Júpiter',  emoji: '🟠', periodo: 4332.59, dato: 'el planeta más grande' },
    { nombre: 'Saturno',  emoji: '🪐', periodo: 10759.22,dato: 'el de los anillos' },
    { nombre: 'Urano',    emoji: '🔵', periodo: 30688.5, dato: 'gira de lado' },
    { nombre: 'Neptuno',  emoji: '💙', periodo: 60182.0, dato: 'el más lejano' },
  ];

  const btn       = document.getElementById('btn-calcular');
  const inputEdad = document.getElementById('edad');
  const resultado = document.getElementById('resultado');

  const params = new URLSearchParams(window.location.search);
  if (params.get('edad')) { inputEdad.value = params.get('edad'); setTimeout(() => btn.click(), 100); }

  btn?.addEventListener('click', () => {
    const edad = parseFloat(inputEdad.value);
    if (isNaN(edad) || edad <= 0) { resultado.innerHTML = '<p class="error-msg">⚠️ Introduce tu edad.</p>'; return; }

    const diasVividos = edad * 365.25;

    const filas = PLANETAS.map(p => {
      const edadPlaneta = (diasVividos / p.periodo).toFixed(1).replace('.', ',');
      return `<li><span>${p.emoji} ${p.nombre} <small>(${p.dato})</small></span><span>${edadPlaneta} años</span></li>`;
    }).join('');

    const edadMercurio = (diasVividos / 87.97).toFixed(1).replace('.', ',');
    const edadNeptuno  = (diasVividos / 60182).toFixed(2).replace('.', ',');

    const shareUrl  = `${window.location.origin}/es/tu-edad-en-otros-planetas?edad=${edad}`;
    const shareText = `Con ${edad} años, en Mercurio tendría ${edadMercurio} años y en Neptuno solo ${edadNeptuno}! 🪐 ¿Y tú?`;

    resultado.innerHTML = `
      <div class="resumen-calculo curiosidad-resumen">
        <p class="curiosidad-numero">🪐 Tu edad en el universo</p>
        <p class="curiosidad-subtitulo">Tienes ${edad} años en la Tierra</p>
        <ul>${filas}</ul>
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
      if (navigator.share) { try { await navigator.share({ title: '¿Cuántos años tienes en otros planetas?', text: shareText, url: shareUrl }); } catch {} }
      else { navigator.clipboard.writeText(shareUrl).then(() => { const b = resultado.querySelector('#btn-share'); const o = b.innerText; b.innerText = '✅ URL copiada'; setTimeout(() => b.innerText = o, 2000); }); }
    });
  });
  inputEdad?.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
});
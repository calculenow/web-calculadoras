/**
 * viaje.js
 * Calculadora de coste de viaje en coche.
 * Calcula: litros necesarios, coste combustible, peajes y coste por persona.
 */

document.addEventListener('DOMContentLoaded', () => {
  const btn       = document.getElementById('btn-calcular');
  const resultDiv = document.getElementById('viaje-result');

  // ── PERFILES RÁPIDOS ───────────────────────────────────────────────────────
  document.querySelectorAll('.btn-mini[data-consumo]').forEach(b => {
    b.addEventListener('click', () => {
      document.getElementById('consumo').value = b.dataset.consumo;
    });
  });

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function fmt(n) {
    return n.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function fmtL(n) {
    return n.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' L';
  }

  // ── CÁLCULO ────────────────────────────────────────────────────────────────
  const calcular = () => {
    const distanciaBase   = parseFloat(document.getElementById('distancia').value);
    const multiplicador   = parseFloat(document.getElementById('ida-vuelta').value);
    const consumo         = parseFloat(document.getElementById('consumo').value);
    const precioComb      = parseFloat(document.getElementById('precio-combustible').value);
    const peajes          = parseFloat(document.getElementById('peajes').value) || 0;
    const ocupantes       = parseInt(document.getElementById('ocupantes').value) || 1;

    if (isNaN(distanciaBase) || distanciaBase <= 0) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce una distancia válida.</p>';
      return;
    }
    if (isNaN(consumo) || consumo <= 0) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce el consumo de tu coche.</p>';
      return;
    }
    if (isNaN(precioComb) || precioComb <= 0) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce el precio del combustible.</p>';
      return;
    }

    const distanciaTotal  = distanciaBase * multiplicador;
    const litros          = (distanciaTotal * consumo) / 100;
    const costeCombustible = litros * precioComb;
    const costeTotal      = costeCombustible + peajes;
    const costePorPersona = costeTotal / ocupantes;
    const tipoTrayecto    = multiplicador === 2 ? 'ida y vuelta' : 'solo ida';

    const textoCopiar = [
      `Trayecto: ${distanciaTotal.toLocaleString('es-ES')} km (${tipoTrayecto})`,
      `Litros necesarios: ${fmtL(litros)}`,
      `Coste combustible: ${fmt(costeCombustible)}`,
      peajes > 0 ? `Peajes: ${fmt(peajes)}` : null,
      `Coste total: ${fmt(costeTotal)}`,
      ocupantes > 1 ? `Por persona (${ocupantes}): ${fmt(costePorPersona)}` : null,
    ].filter(Boolean).join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">Coste del viaje</p>
        <ul>
          <li><span>Distancia total</span><span>${distanciaTotal.toLocaleString('es-ES')} km</span></li>
          <li><span>Litros necesarios</span><span>${fmtL(litros)}</span></li>
          <li><span>Coste combustible</span><span>${fmt(costeCombustible)}</span></li>
          ${peajes > 0 ? `<li><span>Peajes</span><span>${fmt(peajes)}</span></li>` : ''}
          <li class="total-destacado"><span>Coste total</span><span>${fmt(costeTotal)}</span></li>
          ${ocupantes > 1 ? `<li><span>Por persona (${ocupantes})</span><span>${fmt(costePorPersona)}</span></li>` : ''}
        </ul>
        <button class="btn-copy" data-copy-text="${textoCopiar}">📋 Copiar resultado</button>
      </div>
    `;

    resultDiv.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = '✅';
        this.classList.add('copied');
        setTimeout(() => {
          this.innerText = original;
          this.classList.remove('copied');
        }, 2000);
      });
    });
  };

  btn?.addEventListener('click', calcular);

  // Soporte Enter
  document.querySelectorAll('.viaje-card input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') calcular();
    });
  });
});
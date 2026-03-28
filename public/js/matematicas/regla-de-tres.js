/**
 * regla-de-tres.js
 * Calculadora de regla de tres:
 *   - Simple directa:  X = (C × B) / A
 *   - Simple inversa:  X = (A × B) / C
 *   - Compuesta:       X = R × producto de factores directos/inversos
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── TABS ───────────────────────────────────────────────────────────────────
  const tabs   = document.querySelectorAll('.calc-tab');
  const panels = document.querySelectorAll('.calc-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach(p => p.style.display = 'none');
      document.getElementById(`panel-${tab.dataset.mode}`).style.display = 'block';
      document.querySelectorAll('.regla-result').forEach(r => r.innerHTML = '');
    });
  });

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function fmt(n) {
    return Number.isInteger(n)
      ? n.toLocaleString('es-ES')
      : parseFloat(n.toPrecision(6)).toLocaleString('es-ES');
  }

  function mostrarResultado(contenedor, filas, textoCopiar) {
    contenedor.innerHTML = `
      <div class="resumen-calculo">
        <ul>
          ${filas.map(([label, valor]) => `
            <li><span>${label}</span><span>${valor}</span></li>
          `).join('')}
        </ul>
        <button class="btn-copy" data-copy-text="${textoCopiar}">📋 Copiar resultado</button>
      </div>
    `;
    contenedor.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = '✅';
        this.classList.add('copied');
        setTimeout(() => { this.innerText = original; this.classList.remove('copied'); }, 2000);
      });
    });
  }

  function getVal(id) {
    return parseFloat(document.getElementById(id).value);
  }

  function esValido(...vals) {
    return vals.every(v => !isNaN(v) && isFinite(v));
  }

  // ── DIRECTA ────────────────────────────────────────────────────────────────
  document.getElementById('btn-directa')?.addEventListener('click', () => {
    const res = document.getElementById('result-directa');
    const a = getVal('d-a'), b = getVal('d-b'), c = getVal('d-c');

    if (!esValido(a, b, c)) { res.innerHTML = '<p class="error-msg">⚠️ Introduce los tres valores.</p>'; return; }
    if (a === 0) { res.innerHTML = '<p class="error-msg">⚠️ El valor A no puede ser 0.</p>'; return; }

    const x = (c * b) / a;
    mostrarResultado(res, [
      ['Fórmula', `X = (${fmt(c)} × ${fmt(b)}) / ${fmt(a)}`],
      ['Resultado X', `<strong>${fmt(x)}</strong>`],
    ], `Regla de tres directa\n${fmt(a)} → ${fmt(b)}\n${fmt(c)} → X = ${fmt(x)}`);
  });

  // ── INVERSA ────────────────────────────────────────────────────────────────
  document.getElementById('btn-inversa')?.addEventListener('click', () => {
    const res = document.getElementById('result-inversa');
    const a = getVal('i-a'), b = getVal('i-b'), c = getVal('i-c');

    if (!esValido(a, b, c)) { res.innerHTML = '<p class="error-msg">⚠️ Introduce los tres valores.</p>'; return; }
    if (c === 0) { res.innerHTML = '<p class="error-msg">⚠️ El valor C no puede ser 0.</p>'; return; }

    const x = (a * b) / c;
    mostrarResultado(res, [
      ['Fórmula', `X = (${fmt(a)} × ${fmt(b)}) / ${fmt(c)}`],
      ['Resultado X', `<strong>${fmt(x)}</strong>`],
    ], `Regla de tres inversa\n${fmt(a)} × ${fmt(b)} = ${fmt(c)} × X\nX = ${fmt(x)}`);
  });

  // ── COMPUESTA ──────────────────────────────────────────────────────────────
  document.getElementById('btn-compuesta')?.addEventListener('click', () => {
    const res = document.getElementById('result-compuesta');
    const a1 = getVal('c-a1'), a2 = getVal('c-a2');
    const b1 = getVal('c-b1'), b2 = getVal('c-b2');
    const resultado = getVal('c-resultado');
    const tipo1 = document.getElementById('c-tipo1').value;
    const tipo2 = document.getElementById('c-tipo2').value;

    if (!esValido(a1, a2, b1, b2, resultado)) {
      res.innerHTML = '<p class="error-msg">⚠️ Introduce todos los valores.</p>';
      return;
    }
    if (a1 === 0 || b1 === 0) {
      res.innerHTML = '<p class="error-msg">⚠️ Los valores conocidos no pueden ser 0.</p>';
      return;
    }

    const factorA = tipo1 === 'directa' ? a2 / a1 : a1 / a2;
    const factorB = tipo2 === 'directa' ? b2 / b1 : b1 / b2;
    const x = resultado * factorA * factorB;

    mostrarResultado(res, [
      ['Factor magnitud 1', `${fmt(tipo1 === 'directa' ? a2 : a1)} / ${fmt(tipo1 === 'directa' ? a1 : a2)} = ${fmt(factorA)} (${tipo1})`],
      ['Factor magnitud 2', `${fmt(tipo2 === 'directa' ? b2 : b1)} / ${fmt(tipo2 === 'directa' ? b1 : b2)} = ${fmt(factorB)} (${tipo2})`],
      ['Resultado X', `<strong>${fmt(x)}</strong>`],
    ], `Regla de tres compuesta\nX = ${fmt(resultado)} × ${fmt(factorA)} × ${fmt(factorB)} = ${fmt(x)}`);
  });

  // ── SOPORTE ENTER ──────────────────────────────────────────────────────────
  document.querySelectorAll('.regla-card input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const panel = input.closest('.calc-panel');
      panel?.querySelector('.btn-regla')?.click();
    });
  });

});
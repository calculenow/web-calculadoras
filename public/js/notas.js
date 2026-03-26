/**
 * notas.js
 * Calculadora de notas — media simple y ponderada.
 * Las filas de asignaturas se generan dinámicamente.
 */

document.addEventListener('DOMContentLoaded', () => {

  const lista      = document.getElementById('asignaturas-lista');
  const tipoSelect = document.getElementById('tipo-media');
  const btnAñadir  = document.getElementById('btn-añadir');
  const btnCalc    = document.getElementById('btn-calcular');
  const btnLimpiar = document.getElementById('btn-limpiar');
  const resultDiv  = document.getElementById('notas-result');

  let contador = 0;

  // ── CREAR FILA ─────────────────────────────────────────────────────────────
  function crearFila() {
    contador++;
    const id   = contador;
    const fila = document.createElement('div');
    fila.className = 'notas-fila';
    fila.dataset.id = id;

    fila.innerHTML = `
      <div class="form-group notas-nombre">
        <label for="nombre-${id}">Asignatura ${id}</label>
        <input id="nombre-${id}" class="field notas-input-nombre"
          type="text" placeholder="Ej: Matemáticas" maxlength="40" />
      </div>
      <div class="form-group notas-nota">
        <label for="nota-${id}">Nota (0–10)</label>
        <input id="nota-${id}" class="field notas-input-nota"
          type="number" placeholder="Ej: 7.5" min="0" max="10" step="0.1" />
      </div>
      <div class="form-group notas-peso ${tipoSelect.value === 'simple' ? 'notas-peso-oculto' : ''}">
        <label for="peso-${id}">Créditos / %</label>
        <input id="peso-${id}" class="field notas-input-peso"
          type="number" placeholder="Ej: 6" min="0" step="0.5" />
      </div>
      <button class="notas-btn-eliminar" data-id="${id}" type="button" title="Eliminar">✕</button>
    `;

    fila.querySelector('.notas-btn-eliminar').addEventListener('click', () => {
      fila.remove();
      actualizarLabels();
    });

    lista.appendChild(fila);
    actualizarPesos();
  }

  // ── ACTUALIZAR LABELS TRAS ELIMINAR ───────────────────────────────────────
  function actualizarLabels() {
    lista.querySelectorAll('.notas-fila').forEach((fila, i) => {
      const label = fila.querySelector('.notas-nombre label');
      const input = fila.querySelector('.notas-input-nombre');
      if (label && !input.value) label.textContent = `Asignatura ${i + 1}`;
    });
  }

  // ── MOSTRAR / OCULTAR PESOS SEGÚN TIPO ────────────────────────────────────
  function actualizarPesos() {
    const ponderada = tipoSelect.value === 'ponderada';
    lista.querySelectorAll('.notas-peso').forEach(el => {
      el.classList.toggle('notas-peso-oculto', !ponderada);
    });
  }

  tipoSelect.addEventListener('change', actualizarPesos);

  // ── AÑADIR / LIMPIAR ───────────────────────────────────────────────────────
  btnAñadir.addEventListener('click', crearFila);

  btnLimpiar.addEventListener('click', () => {
    lista.innerHTML = '';
    contador = 0;
    resultDiv.innerHTML = '';
    // Añadir 3 filas vacías de nuevo
    crearFila(); crearFila(); crearFila();
  });

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  btnCalc.addEventListener('click', () => {
    const filas = lista.querySelectorAll('.notas-fila');
    const ponderada = tipoSelect.value === 'ponderada';

    const asignaturas = [];
    let hayError = false;

    filas.forEach(fila => {
      const notaVal  = parseFloat(fila.querySelector('.notas-input-nota').value);
      const pesoVal  = parseFloat(fila.querySelector('.notas-input-peso').value);
      const nombre   = fila.querySelector('.notas-input-nombre').value.trim() ||
                       `Asignatura ${asignaturas.length + 1}`;

      if (isNaN(notaVal)) return; // fila vacía, se ignora

      if (notaVal < 0 || notaVal > 10) {
        hayError = true;
        return;
      }

      const peso = ponderada ? (isNaN(pesoVal) || pesoVal <= 0 ? 1 : pesoVal) : 1;
      asignaturas.push({ nombre, nota: notaVal, peso });
    });

    if (hayError) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Las notas deben estar entre 0 y 10.</p>';
      return;
    }

    if (asignaturas.length === 0) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce al menos una nota.</p>';
      return;
    }

    const sumaPesos  = asignaturas.reduce((acc, a) => acc + a.peso, 0);
    const sumaPond   = asignaturas.reduce((acc, a) => acc + a.nota * a.peso, 0);
    const media      = sumaPond / sumaPesos;
    const aprueba    = media >= 5;
    const califText  = media >= 9 ? 'Sobresaliente' :
                       media >= 7 ? 'Notable' :
                       media >= 5 ? 'Aprobado' : 'Suspenso';

    const fmt = n => parseFloat(n.toFixed(2)).toLocaleString('es-ES');

    const filasHTML = asignaturas.map(a => `
      <li>
        <span>${a.nombre}${ponderada ? ` (${fmt(a.peso)} cr.)` : ''}</span>
        <span class="${a.nota >= 5 ? 'notas-aprobada' : 'notas-suspensa'}">${fmt(a.nota)}</span>
      </li>
    `).join('');

    const textoCopiar = [
      `Media: ${fmt(media)} — ${califText}`,
      '',
      ...asignaturas.map(a => `${a.nombre}: ${fmt(a.nota)}${ponderada ? ` (${fmt(a.peso)} cr.)` : ''}`),
    ].join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">Resultado</p>
        <ul>
          <li class="total-destacado">
            <span>Media ${ponderada ? 'ponderada' : 'simple'}</span>
            <span>${fmt(media)} — ${aprueba ? '✅' : '❌'} ${califText}</span>
          </li>
          <li><span>Asignaturas</span><span>${asignaturas.length}</span></li>
          ${ponderada ? `<li><span>Total créditos</span><span>${fmt(sumaPesos)}</span></li>` : ''}
        </ul>
        <ul class="notas-desglose">
          ${filasHTML}
        </ul>
        <button class="btn-copy" data-copy-text="${textoCopiar}">📋 Copiar resultado</button>
      </div>
    `;

    resultDiv.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = '✅';
        this.classList.add('copied');
        setTimeout(() => { this.innerText = original; this.classList.remove('copied'); }, 2000);
      });
    });
  });

  // ── INICIO: 3 filas por defecto ────────────────────────────────────────────
  crearFila(); crearFila(); crearFila();
});
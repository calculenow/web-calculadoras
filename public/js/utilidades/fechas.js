/**
 * fechas.js
 * Calculadora de días entre fechas — tres modos:
 *   1. Entre dos fechas  → diferencia en días + desglose
 *   2. Sumar / restar    → fecha resultante
 *   3. Días hasta evento → cuenta atrás con nombre opcional + fechas guardadas
 * Todos los textos visibles se leen desde data-* de div#fechas-i18n (i18n via HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

  const i18n = document.getElementById('fechas-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

  const STORAGE_KEY = 'fechas_guardadas';

  // ── TABS DE MODO ────────────────────────────────────────────────────────────
  const tabs    = document.querySelectorAll('.calc-tab');
  const panels  = document.querySelectorAll('.calc-panel');
  const accesos = document.getElementById('accesos-rapidos');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const mode = tab.dataset.mode;
      panels.forEach(p => p.style.display = 'none');
      document.getElementById(`panel-${mode}`).style.display = 'block';

      if (accesos) accesos.style.display = mode === 'hasta' ? 'flex' : 'none';
      document.querySelectorAll('.fechas-result').forEach(r => r.innerHTML = '');
    });
  });

  if (accesos) accesos.style.display = 'none';

  // ── HELPERS ─────────────────────────────────────────────────────────────────
  function hoy() {
    const dt = new Date();
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  }

  function diffDias(desde, hasta) {
    return Math.round((hasta - desde) / 86400000);
  }

  function plural(n, singularKey, pluralKey) {
    return `${n} ${n === 1 ? d[singularKey] : d[pluralKey]}`;
  }

  function desglose(desde, hasta) {
    let d1 = new Date(desde), d2 = new Date(hasta);
    if (d1 > d2) [d1, d2] = [d2, d1];

    let anios = d2.getFullYear() - d1.getFullYear();
    let meses = d2.getMonth() - d1.getMonth();
    let dias  = d2.getDate()  - d1.getDate();

    if (dias < 0) {
      meses--;
      dias += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
    }
    if (meses < 0) { anios--; meses += 12; }

    const partes = [];
    if (anios > 0) partes.push(plural(anios, 'singularYear',  'pluralYear'));
    if (meses > 0) partes.push(plural(meses, 'singularMonth', 'pluralMonth'));
    if (dias  > 0) partes.push(plural(dias,  'singularDay',   'pluralDay'));
    if (partes.length === 0) return d.labelSameDay;

    return partes.length === 1
      ? partes[0]
      : partes.slice(0, -1).join(', ') + ` ${d.labelAnd} ` + partes.at(-1);
  }

  function formatFecha(date) {
    return date.toLocaleDateString(d.locale, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function formatFechaCorta(date) {
    return date.toLocaleDateString(d.locale, {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function mostrarResultado(contenedor, html, textoCopiar) {
    contenedor.innerHTML = `
      <div class="resumen-calculo">
        ${html}
        ${textoCopiar ? `<button class="btn-copy" data-copy-text="${textoCopiar}">📋 ${d.btnCopy}</button>` : ''}
      </div>
    `;

    contenedor.querySelector('.btn-copy')?.addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = '✅';
        this.classList.add('copied');
        setTimeout(() => { this.innerText = original; this.classList.remove('copied'); }, 2000);
      });
    });
  }

  // ── LOCALSTORAGE ────────────────────────────────────────────────────────────
  function getFechasGuardadas() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function guardarFecha(nombre, fechaStr) {
    const fechas = getFechasGuardadas();
    if (fechas.some(f => f.fecha === fechaStr && f.nombre === nombre)) return;
    fechas.push({ nombre, fecha: fechaStr, id: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fechas));
  }

  function eliminarFecha(id) {
    const fechas = getFechasGuardadas().filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fechas));
  }

  // ── BOTÓN MIS FECHAS ────────────────────────────────────────────────────────
  function crearBotonMisFechas() {
    if (document.getElementById('btn-mis-fechas')) return;
    const btn = document.createElement('button');
    btn.id = 'btn-mis-fechas';
    btn.className = 'btn-mini';
    btn.type = 'button';
    btn.textContent = `📅 ${d.labelMyDates}`;
    btn.addEventListener('click', abrirModalFechas);
    accesos?.appendChild(btn);
  }

  function actualizarBotonMisFechas() {
    const fechas = getFechasGuardadas();
    const btn = document.getElementById('btn-mis-fechas');
    if (fechas.length > 0) {
      crearBotonMisFechas();
    } else if (btn) {
      btn.remove();
    }
  }

  // ── MODAL FECHAS GUARDADAS ───────────────────────────────────────────────────
  function abrirModalFechas() {
    document.getElementById('modal-fechas')?.remove();

    const fechas  = getFechasGuardadas();
    const ahora   = hoy();

    const filas = fechas.length === 0
      ? `<p style="text-align:center; opacity:0.6; padding:1rem 0;">${d.labelNoSaved}</p>`
      : fechas.map(f => {
          const evento = new Date(f.fecha + 'T00:00:00');
          const dias   = diffDias(ahora, evento);
          const abs    = Math.abs(dias);

          let badge, badgeColor;
          if (dias === 0) {
            badge = `🎉 ${d.labelTodayIs.replace('¡', '')}`;
            badgeColor = '#22c55e';
          } else if (dias > 0) {
            badge = `⏳ ${abs} ${d.pluralDay}`;
            badgeColor = 'var(--primary)';
          } else {
            badge = `📆 ${d.labelAgo2} ${abs} ${d.pluralDay}`;
            badgeColor = 'var(--text)';
          }

          return `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 0; border-bottom:1px solid var(--border);">
              <div style="min-width:0;">
                <div style="font-weight:600; font-size:0.95rem; margin-bottom:2px;">${f.nombre}</div>
                <div style="font-size:0.8rem; opacity:0.6;">${formatFechaCorta(evento)}</div>
              </div>
              <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
                <span style="font-size:0.82rem; font-weight:600; color:${badgeColor};">${badge}</span>
                <button
                  class="btn-eliminar-fecha"
                  data-id="${f.id}"
                  type="button"
                  title="${d.labelDelete}"
                  style="background:none; border:1px solid var(--border); border-radius:6px; color:var(--danger); cursor:pointer; padding:2px 8px; font-size:0.8rem; flex-shrink:0;">
                  ✕
                </button>
              </div>
            </div>
          `;
        }).join('');

    const modal = document.createElement('div');
    modal.id = 'modal-fechas';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:99999; display:flex; align-items:center; justify-content:center; padding:1rem;';
    modal.innerHTML = `
      <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:1.5rem; width:100%; max-width:480px; max-height:80vh; display:flex; flex-direction:column; box-shadow:0 20px 40px rgba(0,0,0,0.2);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
          <h3 style="margin:0; font-size:1.1rem;">📅 ${d.labelMyDates}</h3>
          <button id="btn-cerrar-modal-fechas" type="button" style="background:none; border:none; font-size:1.2rem; cursor:pointer; color:var(--text); opacity:0.6; padding:4px 8px;">✕</button>
        </div>
        <div style="overflow-y:auto; flex:1;">
          ${filas}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btn-cerrar-modal-fechas').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    modal.querySelectorAll('.btn-eliminar-fecha').forEach(btn => {
      btn.addEventListener('click', () => {
        eliminarFecha(Number(btn.dataset.id));
        actualizarBotonMisFechas();
        abrirModalFechas();
      });
    });
  }

  // ── MODO 1: ENTRE DOS FECHAS ────────────────────────────────────────────────
  document.getElementById('btn-entre')?.addEventListener('click', () => {
    const res    = document.getElementById('result-entre');
    const inicio = document.getElementById('fecha-inicio').value;
    const fin    = document.getElementById('fecha-fin').value;

    if (!inicio || !fin) {
      res.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorBothDates}</p>`;
      return;
    }

    const d1   = new Date(inicio + 'T00:00:00');
    const d2   = new Date(fin    + 'T00:00:00');
    const dias = diffDias(d1, d2);
    const abs  = Math.abs(dias);
    const desc = desglose(d1, d2);
    const dir  = dias < 0 ? d.labelBefore : dias > 0 ? d.labelAfter : '';
    const semanas = Math.floor(abs / 7);
    const textoCopiar = `${abs} ${d.pluralDay} ${d.labelBetween} ${formatFecha(d1)} ${d.labelAnd} ${formatFecha(d2)}`;

    mostrarResultado(res, `
      <ul>
        <li class="total-destacado"><span>${d.labelTotal}</span><span>${abs} ${d.pluralDay}</span></li>
        <li><span>${d.labelBreakdown}</span><span>${desc}</span></li>
        <li><span>${d.labelFullWeeks}</span><span>${semanas}</span></li>
        ${dias !== 0 ? `<li style="flex-direction:column; gap:2px;"><span style="opacity:0.6; font-size:0.85rem;">${d.labelDirection}</span><span>${formatFecha(d2)} ${d.labelIs} ${abs} ${d.pluralDay} ${dir} ${d.labelOf} ${formatFecha(d1)}</span></li>` : ''}
      </ul>
    `, textoCopiar);
  });

  // ── MODO 2: SUMAR / RESTAR DÍAS ─────────────────────────────────────────────
  document.getElementById('btn-sumar')?.addEventListener('click', () => {
    const res      = document.getElementById('result-sumar');
    const base     = document.getElementById('fecha-base').value;
    const numDias  = parseInt(document.getElementById('num-dias').value, 10);
    const operacion = document.getElementById('operacion').value;

    if (!base || isNaN(numDias) || numDias < 0) {
      res.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorDaysDate}</p>`;
      return;
    }

    const dt = new Date(base + 'T00:00:00');
    const resultado = new Date(dt);
    resultado.setDate(resultado.getDate() + (operacion === 'sumar' ? numDias : -numDias));

    const accion  = operacion === 'sumar' ? d.labelAdding : d.labelSubtracting;
    const labelOp = operacion === 'sumar' ? d.labelDaysAdded : d.labelDaysSubtracted;
    const textoCopiar = `${accion} ${numDias} ${d.pluralDay} ${d.labelTo} ${formatFecha(dt)} → ${formatFecha(resultado)}`;

    mostrarResultado(res, `
      <ul>
        <li><span>${d.labelStartDate}</span><span>${formatFecha(dt)}</span></li>
        <li><span>${labelOp}</span><span>${numDias} ${d.pluralDay}</span></li>
        <li class="total-destacado"><span>${d.labelResultDate}</span><span>${formatFecha(resultado)}</span></li>
      </ul>
    `, textoCopiar);
  });

  // ── MODO 3: DÍAS HASTA UN EVENTO ────────────────────────────────────────────
  function calcularHasta(fechaStr, nombre) {
    const res = document.getElementById('result-hasta');

    if (!fechaStr) {
      res.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorEventDate}</p>`;
      return;
    }

    const evento   = new Date(fechaStr + 'T00:00:00');
    const ahora    = hoy();
    const dias     = diffDias(ahora, evento);
    const etiqueta = nombre || d.labelEvent;

    let mensaje, icono;
    if (dias === 0) {
      mensaje = `${d.labelTodayIs} ${etiqueta}!`;
      icono = '🎉';
    } else if (dias > 0) {
      mensaje = `${d.labelRemaining} <strong>${dias} ${d.pluralDay}</strong> ${d.labelUntil} ${etiqueta}`;
      icono = '⏳';
    } else {
      mensaje = `${etiqueta} ${d.labelWas} <strong>${Math.abs(dias)} ${d.pluralDay}</strong> ${d.labelAgo}`;
      icono = '📆';
    }

    const semanas = Math.floor(Math.abs(dias) / 7);
    const desc    = dias !== 0 ? desglose(ahora, evento) : '';
    const textoCopiar = `${Math.abs(dias)} ${d.pluralDay} ${dias >= 0 ? d.labelUntil : d.labelSince} ${etiqueta} (${formatFecha(evento)})`;

    mostrarResultado(res, `
      <ul>
        <li class="total-destacado"><span>${icono} ${mensaje}</span></li>
        ${desc ? `<li><span>${d.labelBreakdown}</span><span>${desc}</span></li>` : ''}
        ${dias !== 0 ? `<li><span>${d.labelWeeks}</span><span>${semanas}</span></li>` : ''}
        <li><span>${d.labelDate}</span><span>${formatFecha(evento)}</span></li>
      </ul>
      <div class="calc-actions">
        <button class="btn-copy" data-copy-text="${textoCopiar}">📋 ${d.btnCopy}</button>
        <button class="btn-guardar" id="btn-guardar-fecha" type="button">💾 ${d.labelSave}</button>
      </div>
    `, null);

    res.querySelector('.btn-copy')?.addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = '✅';
        this.classList.add('copied');
        setTimeout(() => { this.innerText = original; this.classList.remove('copied'); }, 2000);
      });
    });

    document.getElementById('btn-guardar-fecha')?.addEventListener('click', () => {
      guardarFecha(etiqueta, fechaStr);
      actualizarBotonMisFechas();
      const btnGuardar = document.getElementById('btn-guardar-fecha');
      if (btnGuardar) {
        btnGuardar.textContent = `✅ ${d.labelSaved}`;
        btnGuardar.disabled = true;
      }
    });
  }

  document.getElementById('btn-hasta')?.addEventListener('click', () => {
    const fechaStr = document.getElementById('fecha-evento').value;
    const nombre   = document.getElementById('nombre-evento').value.trim();
    calcularHasta(fechaStr, nombre || d.labelEvent);
  });

  // ── ACCESOS RÁPIDOS ─────────────────────────────────────────────────────────
  const eventosRapidos = {
    christmas: () => { const dt = new Date(); return `${dt.getMonth() >= 11 ? dt.getFullYear() + 1 : dt.getFullYear()}-12-25`; },
    newyear:   () => { const dt = new Date(); return `${dt.getFullYear() + 1}-01-01`; },
    summer:    () => { const dt = new Date(); const y = dt.getFullYear(); return `${dt.getMonth() >= 5 ? y + 1 : y}-06-21`; },
    halloween: () => { const dt = new Date(); const y = dt.getFullYear(); return `${dt.getMonth() >= 9 ? y + 1 : y}-10-31`; },
  };

  document.querySelectorAll('.btn-mini[data-evento]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabHasta = document.querySelector('.calc-tab[data-mode="hasta"]');
      if (!tabHasta.classList.contains('active')) tabHasta.click();

      const key      = btn.dataset.evento;
      const nombre   = btn.dataset.label || key;
      const fechaStr = eventosRapidos[key]?.();
      if (!fechaStr) return;

      document.getElementById('fecha-evento').value  = fechaStr;
      document.getElementById('nombre-evento').value = nombre;
      calcularHasta(fechaStr, nombre);
    });
  });

  // Mostrar botón "Mis fechas" si hay fechas guardadas al cargar
  actualizarBotonMisFechas();

  // ── SOPORTE ENTER ───────────────────────────────────────────────────────────
  document.querySelectorAll('.fechas-card input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const panel = input.closest('.calc-panel');
      panel?.querySelector('.btn-fechas')?.click();
    });
  });

});
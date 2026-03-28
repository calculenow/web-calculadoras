/**
 * fechas.js
 * Calculadora de días entre fechas — tres modos:
 *   1. Entre dos fechas  → diferencia en días + desglose
 *   2. Sumar / restar    → fecha resultante
 *   3. Días hasta evento → cuenta atrás con nombre opcional
 * Todos los textos visibles se leen desde data-* de div#fechas-i18n (i18n via HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

  // El div de i18n es independiente de los result divs para no interferir con el HTML
  const i18n = document.getElementById('fechas-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

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
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
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
    const textoCopiar = `${abs} ${d.pluralDay} (${desc}) ${d.labelBetween} ${formatFecha(d1)} ${d.labelAnd} ${formatFecha(d2)}`;

    mostrarResultado(res, `
      <ul>
        <li class="total-destacado"><span>${d.labelTotal}</span><span>${abs} ${d.pluralDay}</span></li>
        <li><span>${d.labelBreakdown}</span><span>${desc}</span></li>
        <li><span>${d.labelFullWeeks}</span><span>${semanas}</span></li>
        ${dias !== 0 ? `<li><span>${d.labelDirection}</span><span>${formatFecha(d2)} ${d.labelIs} ${abs} ${d.pluralDay} ${dir} ${d.labelOf} ${formatFecha(d1)}</span></li>` : ''}
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

    const accion = operacion === 'sumar' ? d.labelAdding : d.labelSubtracting;
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
    `, textoCopiar);
  }

  document.getElementById('btn-hasta')?.addEventListener('click', () => {
    const fechaStr = document.getElementById('fecha-evento').value;
    const nombre   = document.getElementById('nombre-evento').value.trim();
    calcularHasta(fechaStr, nombre || d.labelEvent);
  });

  // ── ACCESOS RÁPIDOS ─────────────────────────────────────────────────────────
  // Las fechas se calculan dinámicamente; los nombres vienen del HTML via data-evento
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

  // ── SOPORTE ENTER ───────────────────────────────────────────────────────────
  document.querySelectorAll('.fechas-card input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const panel = input.closest('.calc-panel');
      panel?.querySelector('.btn-fechas')?.click();
    });
  });

});
/**
 * fechas.js
 * Calculadora de días entre fechas — tres modos:
 *   1. Entre dos fechas  → diferencia en días + desglose
 *   2. Sumar / restar    → fecha resultante
 *   3. Días hasta evento → cuenta atrás con nombre opcional
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── TABS DE MODO ────────────────────────────────────────────────────────────
  const tabs   = document.querySelectorAll('.fechas-tab');
  const panels = document.querySelectorAll('.fechas-panel');
  const accesos = document.getElementById('accesos-rapidos');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const mode = tab.dataset.mode;
      panels.forEach(p => p.style.display = 'none');
      document.getElementById(`panel-${mode}`).style.display = 'block';

      // Los accesos rápidos solo tienen sentido en modo "hasta"
      if (accesos) accesos.style.display = mode === 'hasta' ? 'flex' : 'none';

      // Limpiar resultados anteriores
      document.querySelectorAll('.fechas-result').forEach(r => r.innerHTML = '');
    });
  });

  // Ocultar accesos rápidos en modos que no son "hasta"
  if (accesos) accesos.style.display = 'none';

  // ── HELPERS ─────────────────────────────────────────────────────────────────

  // Hoy a medianoche local (sin hora para evitar desfases UTC)
  function hoy() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  // Diferencia exacta en días entre dos objetos Date
  function diffDias(desde, hasta) {
    return Math.round((hasta - desde) / 86400000);
  }

  // Desglose legible: "2 años, 3 meses y 5 días"
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
    if (meses < 0) {
      anios--;
      meses += 12;
    }

    const partes = [];
    if (anios > 0)  partes.push(`${anios} ${anios === 1 ? 'año' : 'años'}`);
    if (meses > 0)  partes.push(`${meses} ${meses === 1 ? 'mes' : 'meses'}`);
    if (dias > 0)   partes.push(`${dias} ${dias === 1 ? 'día' : 'días'}`);
    if (partes.length === 0) return 'el mismo día';

    return partes.length === 1
      ? partes[0]
      : partes.slice(0, -1).join(', ') + ' y ' + partes.at(-1);
  }

  // Formatea una fecha a texto legible en español
  function formatFecha(date) {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // Inyecta HTML de resultado + botón copiar (dentro del resumen-calculo, igual que el resto de calculadoras)
  function mostrarResultado(contenedor, html, textoCopiar) {
    contenedor.innerHTML = `
      <div class="resumen-calculo">
        ${html}
        ${textoCopiar ? `<button class="btn-copy" data-copy-text="${textoCopiar}">📋 Copiar resultado</button>` : ''}
      </div>
    `;

    const btn = contenedor.querySelector('.btn-copy');
    btn?.addEventListener('click', function () {
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
  }

  // ── MODO 1: ENTRE DOS FECHAS ────────────────────────────────────────────────
  document.getElementById('btn-entre')?.addEventListener('click', () => {
    const res    = document.getElementById('result-entre');
    const inicio = document.getElementById('fecha-inicio').value;
    const fin    = document.getElementById('fecha-fin').value;

    if (!inicio || !fin) {
      res.innerHTML = '<p class="error-msg">⚠️ Selecciona ambas fechas.</p>';
      return;
    }

    const d1   = new Date(inicio + 'T00:00:00');
    const d2   = new Date(fin    + 'T00:00:00');
    const dias = diffDias(d1, d2);
    const abs  = Math.abs(dias);
    const desc = desglose(d1, d2);
    const dir  = dias < 0 ? 'antes' : dias > 0 ? 'después' : '';
    const semanas = Math.floor(abs / 7);
    const textoCopiar = `${abs} días (${desc}) entre ${formatFecha(d1)} y ${formatFecha(d2)}`;

    mostrarResultado(res, `
      <ul>
        <li class="total-destacado"><span>Total</span><span>${abs} días</span></li>
        <li><span>Desglose</span><span>${desc}</span></li>
        <li><span>Semanas completas</span><span>${semanas}</span></li>
        ${dias !== 0 ? `<li><span>Dirección</span><span>${formatFecha(d2)} es ${abs} días ${dir} de ${formatFecha(d1)}</span></li>` : ''}
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
      res.innerHTML = '<p class="error-msg">⚠️ Introduce una fecha y un número de días válido.</p>';
      return;
    }

    const d = new Date(base + 'T00:00:00');
    const resultado = new Date(d);
    resultado.setDate(resultado.getDate() + (operacion === 'sumar' ? numDias : -numDias));

    const accion  = operacion === 'sumar' ? 'sumando' : 'restando';
    const textoCopiar = `${accion} ${numDias} días a ${formatFecha(d)} → ${formatFecha(resultado)}`;

    mostrarResultado(res, `
      <ul>
        <li><span>Fecha de partida</span><span>${formatFecha(d)}</span></li>
        <li><span>${operacion === 'sumar' ? '➕ Días sumados' : '➖ Días restados'}</span><span>${numDias} días</span></li>
        <li class="total-destacado"><span>Fecha resultante</span><span>${formatFecha(resultado)}</span></li>
      </ul>
    `, textoCopiar);
  });

  // ── MODO 3: DÍAS HASTA UN EVENTO ────────────────────────────────────────────
  function calcularHasta(fechaStr, nombre) {
    const res = document.getElementById('result-hasta');

    if (!fechaStr) {
      res.innerHTML = '<p class="error-msg">⚠️ Selecciona la fecha del evento.</p>';
      return;
    }

    const evento  = new Date(fechaStr + 'T00:00:00');
    const ahora   = hoy();
    const dias    = diffDias(ahora, evento);
    const etiqueta = nombre || 'el evento';

    let mensaje, icono;
    if (dias === 0) {
      mensaje = `¡Hoy es ${etiqueta}!`;
      icono = '🎉';
    } else if (dias > 0) {
      mensaje = `Faltan <strong>${dias} días</strong> para ${etiqueta}`;
      icono = '⏳';
    } else {
      mensaje = `${etiqueta} fue hace <strong>${Math.abs(dias)} días</strong>`;
      icono = '📆';
    }

    const semanas  = Math.floor(Math.abs(dias) / 7);
    const desc     = dias !== 0 ? desglose(ahora, evento) : '';
    const textoCopiar = `${Math.abs(dias)} días ${dias >= 0 ? 'para' : 'desde'} ${etiqueta} (${formatFecha(evento)})`;

    mostrarResultado(res, `
      <ul>
        <li class="total-destacado"><span>${icono} ${mensaje}</span></li>
        ${desc ? `<li><span>Desglose</span><span>${desc}</span></li>` : ''}
        ${dias !== 0 ? `<li><span>Semanas</span><span>${semanas}</span></li>` : ''}
        <li><span>Fecha</span><span>${formatFecha(evento)}</span></li>
      </ul>
    `, textoCopiar);
  }

  document.getElementById('btn-hasta')?.addEventListener('click', () => {
    const fechaStr = document.getElementById('fecha-evento').value;
    const nombre   = document.getElementById('nombre-evento').value.trim();
    calcularHasta(fechaStr, nombre || 'el evento');
  });

  // ── ACCESOS RÁPIDOS ─────────────────────────────────────────────────────────
  const eventosRapidos = {
    'Navidad':    () => { const d = new Date(); return `${d.getMonth() >= 11 ? d.getFullYear() + 1 : d.getFullYear()}-12-25`; },
    'Año Nuevo':  () => { const d = new Date(); return `${d.getFullYear() + 1}-01-01`; },
    'Verano':     () => { const d = new Date(); const y = d.getFullYear(); return `${d.getMonth() >= 5 ? y + 1 : y}-06-21`; },
    'Halloween':  () => { const d = new Date(); const y = d.getFullYear(); return `${d.getMonth() >= 9 ? y + 1 : y}-10-31`; },
  };

  document.querySelectorAll('.btn-mini[data-evento]').forEach(btn => {
    btn.addEventListener('click', () => {
      // Activar la pestaña "hasta" si no está activa
      const tabHasta = document.querySelector('.fechas-tab[data-mode="hasta"]');
      if (!tabHasta.classList.contains('active')) tabHasta.click();

      const nombre   = btn.dataset.evento;
      const fechaStr = eventosRapidos[nombre]?.();
      if (!fechaStr) return;

      document.getElementById('fecha-evento').value    = fechaStr;
      document.getElementById('nombre-evento').value   = nombre;
      calcularHasta(fechaStr, nombre);
    });
  });

  // ── SOPORTE ENTER ───────────────────────────────────────────────────────────
  document.querySelectorAll('.fechas-card input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const panel = input.closest('.fechas-panel');
      panel?.querySelector('.btn-fechas')?.click();
    });
  });

});
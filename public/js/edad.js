/**
 * edad.js
 * Calculadora de edad exacta.
 * Muestra: años, meses y días exactos + datos curiosos (días, semanas, horas vividas).
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnCalcular  = document.getElementById('btn-calcular');
  const resultDiv    = document.getElementById('edad-result');
  const inputNac     = document.getElementById('fecha-nacimiento');
  const inputCalculo = document.getElementById('fecha-calculo');

  // Por defecto, la fecha de cálculo es hoy
  const hoy = new Date();
  inputCalculo.value = hoy.toISOString().split('T')[0];

  // ── HELPERS ────────────────────────────────────────────────────────────────

  // Edad exacta en años, meses y días
  function calcularEdad(nacimiento, referencia) {
    let anios = referencia.getFullYear() - nacimiento.getFullYear();
    let meses = referencia.getMonth()   - nacimiento.getMonth();
    let dias  = referencia.getDate()    - nacimiento.getDate();

    if (dias < 0) {
      meses--;
      // Días del mes anterior a la fecha de referencia
      const mesAnterior = new Date(referencia.getFullYear(), referencia.getMonth(), 0);
      dias += mesAnterior.getDate();
    }

    if (meses < 0) {
      anios--;
      meses += 12;
    }

    return { anios, meses, dias };
  }

  // Total de días entre dos fechas
  function totalDias(nacimiento, referencia) {
    return Math.floor((referencia - nacimiento) / 86400000);
  }

  // Formato plural español
  function plural(n, singular, plural) {
    return `${n.toLocaleString('es-ES')} ${n === 1 ? singular : plural}`;
  }

  // ── CÁLCULO ────────────────────────────────────────────────────────────────
  const calcular = () => {
    const nacStr = inputNac.value;
    const refStr = inputCalculo.value;

    if (!nacStr || !refStr) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce ambas fechas.</p>';
      return;
    }

    const nacimiento  = new Date(nacStr + 'T00:00:00');
    const referencia  = new Date(refStr + 'T00:00:00');

    if (nacimiento >= referencia) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ La fecha de nacimiento debe ser anterior a la fecha de cálculo.</p>';
      return;
    }

    const { anios, meses, dias } = calcularEdad(nacimiento, referencia);
    const diasTotales   = totalDias(nacimiento, referencia);
    const semanas       = Math.floor(diasTotales / 7);
    const horas         = diasTotales * 24;
    const mesesTotales  = anios * 12 + meses;

    // Desglose principal
    const edadTexto = [
      anios  > 0 ? plural(anios,  'año',  'años')   : null,
      meses  > 0 ? plural(meses,  'mes',  'meses')  : null,
      dias   > 0 ? plural(dias,   'día',  'días')   : null,
    ].filter(Boolean).join(', ') || '0 días';

    const textoCopiar = [
      `Edad: ${edadTexto}`,
      `Total días vividos: ${diasTotales.toLocaleString('es-ES')}`,
      `Total semanas: ${semanas.toLocaleString('es-ES')}`,
      `Total meses: ${mesesTotales.toLocaleString('es-ES')}`,
      `Total horas: ${horas.toLocaleString('es-ES')}`,
    ].join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">Tu edad exacta</p>
        <ul>
          <li class="total-destacado"><span>Edad</span><span>${edadTexto}</span></li>
          <li><span>Días vividos</span><span>${plural(diasTotales, 'día', 'días')}</span></li>
          <li><span>Semanas vividas</span><span>${plural(semanas, 'semana', 'semanas')}</span></li>
          <li><span>Meses totales</span><span>${plural(mesesTotales, 'mes', 'meses')}</span></li>
          <li><span>Horas vividas</span><span>${horas.toLocaleString('es-ES')} h</span></li>
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

  btnCalcular?.addEventListener('click', calcular);

  // Soporte Enter
  [inputNac, inputCalculo].forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') calcular();
    });
  });
});
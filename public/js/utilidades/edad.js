/**
 * edad.js
 * Calculadora de edad exacta.
 * Todos los textos visibles se leen desde data-* del div#edad-result (i18n via HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

  const btnCalcular  = document.getElementById('btn-calcular');
  const resultDiv    = document.getElementById('edad-result');
  const inputNac     = document.getElementById('fecha-nacimiento');
  const inputCalculo = document.getElementById('fecha-calculo');

  if (!btnCalcular || !resultDiv) return;

  const d = resultDiv.dataset;

  // Por defecto, la fecha de cálculo es hoy
  const hoy = new Date();
  inputCalculo.value = hoy.toISOString().split('T')[0];

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function calcularEdad(nacimiento, referencia) {
    let anios = referencia.getFullYear() - nacimiento.getFullYear();
    let meses = referencia.getMonth()   - nacimiento.getMonth();
    let dias  = referencia.getDate()    - nacimiento.getDate();

    if (dias < 0) {
      meses--;
      const mesAnterior = new Date(referencia.getFullYear(), referencia.getMonth(), 0);
      dias += mesAnterior.getDate();
    }
    if (meses < 0) {
      anios--;
      meses += 12;
    }

    return { anios, meses, dias };
  }

  function totalDias(nacimiento, referencia) {
    return Math.floor((referencia - nacimiento) / 86400000);
  }

  // Plural genérico leyendo data-* del HTML
  // data-singular-year / data-plural-year, etc.
  function plural(n, singularKey, pluralKey) {
    return `${n.toLocaleString(d.locale)} ${n === 1 ? d[singularKey] : d[pluralKey]}`;
  }

  // ── CÁLCULO ────────────────────────────────────────────────────────────────
  const calcular = () => {
    const nacStr = inputNac.value;
    const refStr = inputCalculo.value;

    if (!nacStr || !refStr) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorEmpty}</p>`;
      return;
    }

    const nacimiento = new Date(nacStr + 'T00:00:00');
    const referencia = new Date(refStr + 'T00:00:00');

    if (nacimiento >= referencia) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorOrder}</p>`;
      return;
    }

    const { anios, meses, dias } = calcularEdad(nacimiento, referencia);
    const diasTotales  = totalDias(nacimiento, referencia);
    const semanas      = Math.floor(diasTotales / 7);
    const horas        = diasTotales * 24;
    const mesesTotales = anios * 12 + meses;

    const edadTexto = [
      anios > 0 ? plural(anios, 'singularYear',  'pluralYear')  : null,
      meses > 0 ? plural(meses, 'singularMonth', 'pluralMonth') : null,
      dias  > 0 ? plural(dias,  'singularDay',   'pluralDay')   : null,
    ].filter(Boolean).join(', ') || `0 ${d.pluralDay}`;

    const textoCopiar = [
      `${d.labelAge}: ${edadTexto}`,
      `${d.labelTotalDays}: ${diasTotales.toLocaleString(d.locale)}`,
      `${d.labelTotalWeeks}: ${semanas.toLocaleString(d.locale)}`,
      `${d.labelTotalMonths}: ${mesesTotales.toLocaleString(d.locale)}`,
      `${d.labelTotalHours}: ${horas.toLocaleString(d.locale)}`,
    ].join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${d.labelTitle}</p>
        <ul>
          <li class="total-destacado"><span>${d.labelAge}</span><span>${edadTexto}</span></li>
          <li><span>${d.labelTotalDays}</span><span>${plural(diasTotales, 'singularDay', 'pluralDay')}</span></li>
          <li><span>${d.labelTotalWeeks}</span><span>${plural(semanas, 'singularWeek', 'pluralWeek')}</span></li>
          <li><span>${d.labelTotalMonths}</span><span>${plural(mesesTotales, 'singularMonth', 'pluralMonth')}</span></li>
          <li><span>${d.labelTotalHours}</span><span>${horas.toLocaleString(d.locale)} h</span></li>
        </ul>
        <button class="btn-copy" data-copy-text="${textoCopiar}">📋 ${d.btnCopy}</button>
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
  };

  btnCalcular.addEventListener('click', calcular);

  [inputNac, inputCalculo].forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') calcular(); });
  });

});
/**
 * estadistica.js
 * Calculadora de estadística básica:
 * media aritmética, mediana, moda y rango.
 * Todos los textos visibles se leen desde data-* de div#estadistica-result (i18n via HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

  const btn       = document.getElementById('btn-calcular');
  const input     = document.getElementById('numeros');
  const resultDiv = document.getElementById('estadistica-result');

  if (!btn || !resultDiv) return;

  const d = resultDiv.dataset;

  // ── PARSEAR ENTRADA ────────────────────────────────────────────────────────
  function parsearNumeros(texto) {
    return texto
      .replace(/,(?=\s*[^\d\s])/g, '.')
      .split(/[\s,;]+/)
      .map(s => s.replace(',', '.').trim())
      .filter(s => s !== '')
      .map(Number)
      .filter(n => !isNaN(n));
  }

  // ── CÁLCULOS ───────────────────────────────────────────────────────────────
  function calcularMedia(nums) {
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  }

  function calcularMediana(nums) {
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function calcularModa(nums) {
    const freq = {};
    nums.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    if (maxFreq === 1) return { modas: [], freq: 1 };
    const modas = Object.keys(freq)
      .filter(k => freq[k] === maxFreq)
      .map(Number)
      .sort((a, b) => a - b);
    return { modas, freq: maxFreq };
  }

  // ── FORMATO ────────────────────────────────────────────────────────────────
  function fmt(n) {
    return parseFloat(n.toPrecision(8)).toLocaleString(d.locale);
  }

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  const calcular = () => {
    const texto = input.value.trim();

    if (!texto) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorEmpty}</p>`;
      return;
    }

    const nums = parsearNumeros(texto);

    if (nums.length === 0) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorInvalid}</p>`;
      return;
    }

    if (nums.length < 2) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorMin}</p>`;
      return;
    }

    const media   = calcularMedia(nums);
    const mediana = calcularMediana(nums);
    const { modas, freq: freqModa } = calcularModa(nums);
    const min   = Math.min(...nums);
    const max   = Math.max(...nums);
    const rango = max - min;

    const modaTexto = modas.length === 0
      ? d.labelNoMode
      : modas.map(fmt).join(', ') + ` (${d.labelAppears} ${freqModa} ${freqModa === 1 ? d.singularTime : d.pluralTime})`;

    const sorted = [...nums].sort((a, b) => a - b).map(fmt).join(', ');

    const textoCopiar = [
      `${d.labelCount}: ${nums.length}`,
      `${d.labelMean}: ${fmt(media)}`,
      `${d.labelMedian}: ${fmt(mediana)}`,
      `${d.labelMode}: ${modaTexto}`,
      `${d.labelMin}: ${fmt(min)}`,
      `${d.labelMax}: ${fmt(max)}`,
      `${d.labelRange}: ${fmt(rango)}`,
    ].join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${d.labelTitle} (${nums.length} ${nums.length === 1 ? d.singularDatum : d.pluralData})</p>
        <ul>
          <li class="total-destacado"><span>${d.labelMean}</span><span>${fmt(media)}</span></li>
          <li><span>${d.labelMedian}</span><span>${fmt(mediana)}</span></li>
          <li><span>${d.labelMode}</span><span>${modaTexto}</span></li>
          <li><span>${d.labelMin}</span><span>${fmt(min)}</span></li>
          <li><span>${d.labelMax}</span><span>${fmt(max)}</span></li>
          <li><span>${d.labelRange}</span><span>${fmt(rango)}</span></li>
          <li><span>${d.labelSorted}</span><span class="estadistica-sorted">${sorted}</span></li>
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

  btn.addEventListener('click', calcular);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') calcular(); });

});
/**
 * estadistica.js
 * Calculadora de estadística básica:
 * media aritmética, mediana, moda y rango.
 */

document.addEventListener('DOMContentLoaded', () => {
  const btn       = document.getElementById('btn-calcular');
  const input     = document.getElementById('numeros');
  const resultDiv = document.getElementById('estadistica-result');

  // ── PARSEAR ENTRADA ────────────────────────────────────────────────────────
  // Acepta números separados por comas, espacios o punto y coma
  // y decimales con punto o coma
  function parsearNumeros(texto) {
    return texto
      .replace(/,(?=\s*[^\d\s])/g, '.') // coma decimal → punto (ej: "3,5")
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
    if (maxFreq === 1) return { modas: [], freq: 1 }; // sin moda
    const modas = Object.keys(freq)
      .filter(k => freq[k] === maxFreq)
      .map(Number)
      .sort((a, b) => a - b);
    return { modas, freq: maxFreq };
  }

  // ── FORMATO ────────────────────────────────────────────────────────────────
  function fmt(n) {
    return parseFloat(n.toPrecision(8)).toLocaleString('es-ES');
  }

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  const calcular = () => {
    const texto = input.value.trim();
    if (!texto) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce al menos un número.</p>';
      return;
    }

    const nums = parsearNumeros(texto);

    if (nums.length === 0) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ No se han encontrado números válidos. Usa punto o coma como decimal.</p>';
      return;
    }

    if (nums.length < 2) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce al menos 2 números para calcular estadísticos.</p>';
      return;
    }

    const media   = calcularMedia(nums);
    const mediana = calcularMediana(nums);
    const { modas, freq: freqModa } = calcularModa(nums);
    const min     = Math.min(...nums);
    const max     = Math.max(...nums);
    const rango   = max - min;

    const modaTexto = modas.length === 0
      ? 'Sin moda (todos los valores son distintos)'
      : modas.map(fmt).join(', ') + ` (aparece ${freqModa} veces)`;

    const sorted = [...nums].sort((a, b) => a - b).map(fmt).join(', ');

    const textoCopiar = [
      `Cantidad de datos: ${nums.length}`,
      `Media: ${fmt(media)}`,
      `Mediana: ${fmt(mediana)}`,
      `Moda: ${modaTexto}`,
      `Mínimo: ${fmt(min)}`,
      `Máximo: ${fmt(max)}`,
      `Rango: ${fmt(rango)}`,
    ].join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">Estadísticos básicos (${nums.length} datos)</p>
        <ul>
          <li class="total-destacado"><span>Media</span><span>${fmt(media)}</span></li>
          <li><span>Mediana</span><span>${fmt(mediana)}</span></li>
          <li><span>Moda</span><span>${modaTexto}</span></li>
          <li><span>Mínimo</span><span>${fmt(min)}</span></li>
          <li><span>Máximo</span><span>${fmt(max)}</span></li>
          <li><span>Rango</span><span>${fmt(rango)}</span></li>
          <li><span>Datos ordenados</span><span class="estadistica-sorted">${sorted}</span></li>
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

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') calcular();
  });
});
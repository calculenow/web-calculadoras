/**
 * CALCULADORA DE INTERÉS COMPUESTO
 * Lógica de cálculo, interactividad y gráficos SVG
 */

// Constante global de idioma
const isEn = window.location.pathname.includes('/en/');

// Valores de respaldo
let datosMercado = {
  indices: { sp500: 10.0, nasdaq: 12.0 },
  macro: { ahorro: 3.5, inflacion: 2.5 },
  last_update: "Febrero 2026"
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch('/data/mercado.json', { signal: controller.signal });
    clearTimeout(timeout);
    if (response.ok) {
      datosMercado = await response.json();
    }
  } catch (e) {
    console.warn("Usando valores locales de respaldo.");
  }

  actualizarTextosBotones();
  actualizarFecha();
  initListeners();
});

function initListeners() {
  document.querySelectorAll('.field').forEach(input => {
    input.addEventListener('input', calcularInteres);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') calcularInteres();
    });
  });

  document.getElementById('container-perfiles')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const perfil = btn.dataset.perfil;
    const inputInteres = document.getElementById('interes');

    if (perfil === 'ahorro') inputInteres.value = datosMercado.macro.ahorro;
    if (perfil === 'moderado') inputInteres.value = datosMercado.indices.sp500;
    if (perfil === 'tecnologico') inputInteres.value = datosMercado.indices.nasdaq;

    inputInteres.classList.add('field--highlight');
    setTimeout(() => inputInteres.classList.remove('field--highlight'), 300);

    calcularInteres();
  });

  document.getElementById('btn-calcular')?.addEventListener('click', calcularInteres);
}

function calcularInteres() {
  const capital = parseFloat(document.getElementById('capital').value) || 0;
  const aportacion = parseFloat(document.getElementById('aportacion').value) || 0;
  const tasaAnual = parseFloat(document.getElementById('interes').value) || 0;
  const anyos = parseFloat(document.getElementById('anyos').value) || 0;

  if (anyos <= 0) {
    renderizarResultados(capital, capital, 0, capital, 0);
    dibujarGrafico(capital, 0, 0);
    return;
  }

  const tasaMensual = (tasaAnual / 100) / 12;
  const mesesTotales = anyos * 12;

  const capitalFinal = capital * Math.pow(1 + tasaMensual, mesesTotales);

  const aportacionesFinales = tasaMensual > 0
    ? aportacion * ((Math.pow(1 + tasaMensual, mesesTotales) - 1) / tasaMensual)
    : aportacion * mesesTotales;

  const totalFinal = capitalFinal + aportacionesFinales;
  const totalAportado = aportacion * mesesTotales;
  const totalInvertido = capital + totalAportado;
  const beneficios = totalFinal - totalInvertido;

  // Rentabilidad real descontando inflación
  const tasaReal = tasaAnual - datosMercado.macro.inflacion;
  const tasaMensualReal = (tasaReal / 100) / 12;
  const capitalFinalReal = capital * Math.pow(1 + tasaMensualReal, mesesTotales);
  const aportacionesFinalesReal = tasaMensualReal > 0
    ? aportacion * ((Math.pow(1 + tasaMensualReal, mesesTotales) - 1) / tasaMensualReal)
    : aportacion * mesesTotales;
  const totalFinalReal = capitalFinalReal + aportacionesFinalesReal;

  renderizarResultados(totalFinal, totalInvertido, beneficios, capital, totalAportado, totalFinalReal);
  dibujarGrafico(capital, totalAportado, beneficios);
}

function dibujarGrafico(inicial, aportado, intereses) {
  const contenedor = document.getElementById('visual-chart');
  if (!contenedor) return;

  const total = inicial + aportado + intereses;
  if (total <= 0) return;

  // Normalizamos para evitar gaps por decimales de coma flotante
  const wInicial = (inicial / total) * 100;
  const wAportado = (aportado / total) * 100;
  const wIntereses = 100 - wInicial - wAportado;

  const labelInic = isEn ? 'Initial' : 'Inicial';
  const labelApor = isEn ? 'Invested' : 'Aportado';
  const labelInt = isEn ? 'Interest' : 'Interés';

  contenedor.innerHTML = `
    <svg viewBox="0 0 100 20" class="svg-render">
      <rect x="0" y="0" width="${wInicial}" height="20" fill="#3b82f6" />
      <rect x="${wInicial}" y="0" width="${wAportado}" height="20" fill="#10b981" />
      <rect x="${wInicial + wAportado}" y="0" width="${wIntereses}" height="20" fill="#f59e0b" />
    </svg>
    <div class="chart-legend-simple">
      <span><small>●</small> ${labelInic}</span>
      <span><small>●</small> ${labelApor}</span>
      <span><small>●</small> ${labelInt}</span>
    </div>
  `;
}

function renderizarResultados(total, invertido, beneficios, inicial, aportaciones, totalReal) {
  const resDiv = document.querySelector('.result-interes');
  if (!resDiv) return;

  const labels = resDiv.dataset;
  const clean = (s) => s ? s.replace(/:/g, '').trim() : '';

  const tIni = clean(labels.labelInitial) || (isEn ? "Initial investment" : "Inversión inicial");
  const tApo = clean(labels.labelContrib) || (isEn ? "Total contributions" : "Total aportaciones");
  const tInt = clean(labels.labelProfit) || (isEn ? "Interest generated" : "Intereses generados");
  const tFin = clean(labels.labelFinal) || (isEn ? "Estimated Final Capital" : "Capital Final Estimado");
  const tReal = isEn
    ? `Real return (inflation ${datosMercado.macro.inflacion}%)`
    : `Rentabilidad real (inflación ${datosMercado.macro.inflacion}%)`;
  const bCopy = labels.btnCopy || (isEn ? "Copy Result" : "Copiar Resultado");

  resDiv.innerHTML = `
    <div class="resumen-calculo">
      <ul>
        <li><span>${tIni}:</span> <strong>${formatMoneda(inicial)}</strong></li>
        <li><span>${tApo}:</span> <strong>${formatMoneda(aportaciones)}</strong></li>
        <li><span>${tInt}:</span> <strong style="color: var(--success)">${formatMoneda(beneficios)}</strong></li>
        <li class="total-destacado">
          <span>${tFin}:</span>
          <strong>${formatMoneda(total)}</strong>
        </li>
        <li class="total-real">
          <span>${tReal}:</span>
          <strong>${formatMoneda(totalReal)}</strong>
        </li>
      </ul>
      <button class="btn-copy" data-copy-text="${tIni}: ${formatMoneda(inicial)}&#10;${tApo}: ${formatMoneda(aportaciones)}&#10;${tInt}: ${formatMoneda(beneficios)}&#10;---------------------------&#10;${tFin}: ${formatMoneda(total)}&#10;${tReal}: ${formatMoneda(totalReal)}">
        ${bCopy}
      </button>
    </div>
  `;

  resDiv.querySelector('.btn-copy').addEventListener('click', function () {
    const text = this.dataset.copyText.replace(/&#10;/g, '\n');
    navigator.clipboard.writeText(text).then(() => {
      const original = this.innerText;
      this.innerText = "✅";
      this.classList.add('copied');
      setTimeout(() => {
        this.innerText = original;
        this.classList.remove('copied');
      }, 2000);
    });
  });
}

function formatMoneda(val) {
  const decimales = val < 1000 ? 2 : 0;
  return val.toLocaleString(isEn ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: isEn ? 'USD' : 'EUR',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  });
}

function actualizarTextosBotones() {
  const bAhorro = document.getElementById('btn-ahorro');
  const bMod = document.getElementById('btn-moderado');
  const bTech = document.getElementById('btn-tech');

  if (bAhorro) bAhorro.innerHTML = `${isEn ? '🏦 Savings' : '🏦 Ahorro'} <span>${datosMercado.macro.ahorro}%</span>`;
  if (bMod) bMod.innerHTML = `📈 S&P 500 <span>${datosMercado.indices.sp500}%</span>`;
  if (bTech) bTech.innerHTML = `🚀 NASDAQ <span>${datosMercado.indices.nasdaq}%</span>`;
}

function actualizarFecha() {
  const el = document.getElementById('fecha-actualizacion');
  if (el) el.textContent = isEn
    ? `Historical averages updated: ${datosMercado.last_update}`
    : `Medias históricas actualizadas: ${datosMercado.last_update}`;
}
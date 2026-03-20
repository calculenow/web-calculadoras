/**
 * CALCULADORA DE INTERÉS COMPUESTO
 * Lógica de cálculo, interactividad y gráficos SVG
 */

let datosMercado = {
  indices: { sp500: 10.0, nasdaq: 12.0 },
  macro: { ahorro: 3.5 },
  last_update: "Febrero 2026"
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/data/mercado.json');
    if (response.ok) {
      datosMercado = await response.json();
    }
  } catch (e) {
    console.warn("Usando valores locales de respaldo.");
  }

  actualizarTextosBotones();
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

    // Feedback visual usando clase CSS en vez de estilo inline
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

  renderizarResultados(totalFinal, totalInvertido, beneficios, capital, totalAportado);
  dibujarGrafico(capital, totalAportado, beneficios);
}

function dibujarGrafico(inicial, aportado, intereses) {
  const contenedor = document.getElementById('visual-chart');
  if (!contenedor) return;

  const total = inicial + aportado + intereses;
  if (total <= 0) return;

  const wInicial = (inicial / total) * 100;
  const wAportado = (aportado / total) * 100;
  const wIntereses = (intereses / total) * 100;

  const isEn = window.location.pathname.includes('/en/');
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

function renderizarResultados(total, invertido, beneficios, inicial, aportaciones) {
  const resDiv = document.querySelector('.result-interes');
  if (!resDiv) return;

  const labels = resDiv.dataset;
  const isEn = window.location.pathname.includes('/en/');
  const clean = (s) => s ? s.replace(/:/g, '').trim() : '';

  const tIni = clean(labels.labelInitial) || (isEn ? "Initial investment" : "Inversión inicial");
  const tApo = clean(labels.labelContrib) || (isEn ? "Total contributions" : "Total aportaciones");
  const tInt = clean(labels.labelProfit) || (isEn ? "Interest generated" : "Intereses generados");
  const tFin = clean(labels.labelFinal) || (isEn ? "Estimated Final Capital" : "Capital Final Estimado");
  const bCopy = labels.btnCopy || (isEn ? "Copy Result" : "Copiar Resultado");

  resDiv.innerHTML = `
    <div class="resumen-calculo">
      <ul>
        <li><span>${tIni}:</span> <strong>${formatEuro(inicial)}</strong></li>
        <li><span>${tApo}:</span> <strong>${formatEuro(aportaciones)}</strong></li>
        <li><span>${tInt}:</span> <strong style="color: var(--success)">${formatEuro(beneficios)}</strong></li>
        <li class="total-destacado">
          <span>${tFin}:</span>
          <strong>${formatEuro(total)}</strong>
        </li>
      </ul>
      <button class="btn-copy" data-copy-text="${tIni}: ${formatEuro(inicial)}&#10;${tApo}: ${formatEuro(aportaciones)}&#10;${tInt}: ${formatEuro(beneficios)}&#10;---------------------------&#10;${tFin}: ${formatEuro(total)}">
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

function formatEuro(val) {
  const isEn = window.location.pathname.includes('/en/');
  const decimales = val < 1000 ? 2 : 0;
  return val.toLocaleString(isEn ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: isEn ? 'USD' : 'EUR',
    maximumFractionDigits: decimales
  });
}

function actualizarTextosBotones() {
  const bAhorro = document.getElementById('btn-ahorro');
  const bMod = document.getElementById('btn-moderado');
  const bTech = document.getElementById('btn-tech');
  const isEn = window.location.pathname.includes('/en/');

  if (bAhorro) bAhorro.innerHTML = `${isEn ? '🏦 Savings' : '🏦 Ahorro'} <span>${datosMercado.macro.ahorro}%</span>`;
  if (bMod) bMod.innerHTML = `📈 S&P 500 <span>${datosMercado.indices.sp500}%</span>`;
  if (bTech) bTech.innerHTML = `🚀 NASDAQ <span>${datosMercado.indices.nasdaq}%</span>`;
}
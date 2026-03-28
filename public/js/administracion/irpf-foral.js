/**
 * irpf-foral.js
 * Calculadora de IRPF foral 2025 — Navarra y País Vasco
 *
 * Fuente: Adlanter / Normas Forales / Panorama Fiscalidad Autonómica REAF 2025
 *
 * DIFERENCIAS con el régimen común:
 * - País Vasco: escala única (misma para base general, no se divide en estatal/autonómica)
 *   8 tramos: 23% → 49%
 * - Navarra: escala propia de 11 tramos: 13% → 52%
 * - Mínimos personales y deducciones propias (distintos al régimen común)
 * - No hay reducción por trabajo con la misma fórmula que el régimen común
 *
 * Nota: los cálculos son orientativos. Los regímenes forales tienen
 * deducciones propias (por vivienda, familia, discapacidad…) no incluidas aquí.
 */

// ── TRAMOS PAÍS VASCO (Álava/Bizkaia/Gipuzkoa) 2025 ─────────────────────────
// Escala única — no se divide en estatal + autonómica
const TRAMOS_PAIS_VASCO = [
  [16030,    0.23],
  [32060,    0.28],
  [48090,    0.35],
  [68690,    0.40],
  [95150,    0.45],
  [126850,   0.46],
  [184950,   0.47],
  [Infinity, 0.49],
];

// ── TRAMOS NAVARRA 2025 ──────────────────────────────────────────────────────
const TRAMOS_NAVARRA = [
  [4080,     0.13],
  [9180,     0.22],
  [19380,    0.25],
  [32640,    0.28],
  [46920,    0.365],
  [61200,    0.415],
  [81600,    0.44],
  [127500,   0.47],
  [178500,   0.49],
  [306000,   0.505],
  [Infinity, 0.52],
];

// ── MÍNIMOS PERSONALES FORALES (aproximados) ────────────────────────────────
// País Vasco y Navarra tienen mínimos propios distintos al régimen común
const MINIMO_PERSONAL_FORAL = {
  pais_vasco: { menor65: 4774, '65_75': 5481, mayor75: 6544 },
  navarra:    { menor65: 5550, '65_75': 6700, mayor75: 8100 },
};

const MINIMO_HIJOS_FORAL = {
  pais_vasco: { soltero: 0, casado: 0, hijos1: 2316, hijos2: 2316 + 2662, hijos3: 2316 + 2662 + 3990 },
  navarra:    { soltero: 0, casado: 0, hijos1: 2400, hijos2: 2400 + 2700, hijos3: 2400 + 2700 + 4000 },
};

// ── REDUCCIÓN POR TRABAJO (aproximada para regímenes forales) ────────────────
// País Vasco tiene su propia tabla de reducción, simplificada aquí
function reduccionTrabajoPV(salario) {
  if (salario <= 12000) return 4650;
  if (salario <= 14000) return 4650 - 1.163 * (salario - 12000);
  return 2326;
}

// Navarra — reducción por trabajo similar al régimen común
function reduccionTrabajoNavarra(salario) {
  const gastosFijos = 2000;
  let reduccion = 0;
  if (salario <= 13115)       reduccion = 5565;
  else if (salario <= 16825)  reduccion = 5565 - 1.5 * (salario - 13115);
  return gastosFijos + reduccion;
}

// ── APLICAR ESCALA ────────────────────────────────────────────────────────────
function aplicarEscala(base, tramos) {
  if (base <= 0) return 0;
  let cuota = 0;
  let baseAnterior = 0;

  for (const [limite, tipo] of tramos) {
    if (base <= baseAnterior) break;
    const tramo = Math.min(base, limite) - baseAnterior;
    cuota += tramo * tipo;
    baseAnterior = limite;
    if (limite === Infinity) break;
  }
  return cuota;
}

// ── CÁLCULO PRINCIPAL ─────────────────────────────────────────────────────────
function calcularIRPFForal(salarioBruto, territorio, edad, situacion, retencionActualPct) {
  const tramos = territorio === 'pais_vasco' ? TRAMOS_PAIS_VASCO : TRAMOS_NAVARRA;
  const minimosPersonales = MINIMO_PERSONAL_FORAL[territorio];
  const minimosHijos      = MINIMO_HIJOS_FORAL[territorio];

  if (!tramos || !minimosPersonales) return null;

  // 1. Reducción por trabajo
  const redTrabajo = territorio === 'pais_vasco'
    ? reduccionTrabajoPV(salarioBruto)
    : reduccionTrabajoNavarra(salarioBruto);

  // 2. Base liquidable
  const baseLiquidable = Math.max(0, salarioBruto - redTrabajo);

  // 3. Mínimo personal + familiar
  const minimoPersonal = minimosPersonales[edad] || minimosPersonales.menor65;
  const minimoFamiliar = minimosHijos[situacion] || 0;
  const minimoTotal    = minimoPersonal + minimoFamiliar;

  // 4. Cuota íntegra
  const cuotaIntegra = aplicarEscala(baseLiquidable, tramos);

  // 5. Cuota del mínimo personal
  const cuotaMinimo = aplicarEscala(minimoTotal, tramos);

  // 6. Cuota líquida
  const cuotaLiquida = Math.max(0, cuotaIntegra - cuotaMinimo);

  // 7. Tipo efectivo
  const tipoEfectivo = salarioBruto > 0 ? (cuotaLiquida / salarioBruto) * 100 : 0;

  // 8. Simulador de retención
  const retenidoAnual = retencionActualPct > 0
    ? salarioBruto * (retencionActualPct / 100)
    : null;
  const diferencia = retenidoAnual !== null
    ? retenidoAnual - cuotaLiquida
    : null;

  return {
    salarioBruto,
    redTrabajo,
    baseLiquidable,
    minimoTotal,
    cuotaIntegra,
    cuotaLiquida,
    tipoEfectivo,
    retenidoAnual,
    diferencia,
    territorio,
  };
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function fmt(n) {
  return n.toLocaleString('es-ES', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
}
function fmtPct(n) {
  return n.toFixed(2).replace('.', ',') + ' %';
}

// ── RENDERIZAR RESULTADO ──────────────────────────────────────────────────────
function renderResultado(res, resultDiv) {
  const signo = res.diferencia !== null
    ? (res.diferencia >= 0 ? 'devolver' : 'pagar')
    : null;
  const absDiv = res.diferencia !== null ? Math.abs(res.diferencia) : 0;
  const nombreTerritorio = res.territorio === 'pais_vasco' ? 'País Vasco' : 'Navarra';

  const retencionHTML = res.diferencia !== null ? `
    <li class="irpf-separador"><span>── Simulador de retención ──</span></li>
    <li><span>Retenido en nómina (estimado)</span><span>${fmt(res.retenidoAnual)}</span></li>
    <li class="total-destacado ${signo === 'devolver' ? 'irpf-devolver' : 'irpf-pagar'}">
      <span>Declaración estimada</span>
      <span>${signo === 'devolver' ? '✅ A devolver' : '⚠️ A pagar'} ${fmt(absDiv)}</span>
    </li>
  ` : '';

  const textoCopiar = [
    `Territorio: ${nombreTerritorio}`,
    `Salario bruto: ${fmt(res.salarioBruto)}`,
    `Reducción trabajo: ${fmt(res.redTrabajo)}`,
    `Base liquidable: ${fmt(res.baseLiquidable)}`,
    `Mínimo personal/familiar: ${fmt(res.minimoTotal)}`,
    `Cuota íntegra: ${fmt(res.cuotaIntegra)}`,
    `Cuota líquida: ${fmt(res.cuotaLiquida)}`,
    `Tipo efectivo: ${fmtPct(res.tipoEfectivo)}`,
    res.diferencia !== null
      ? `Declaración estimada: ${signo === 'devolver' ? 'A devolver' : 'A pagar'} ${fmt(absDiv)}`
      : '',
  ].filter(Boolean).join('\n');

  resultDiv.innerHTML = `
    <div class="resumen-calculo">
      <p class="resumen-titulo">Resultado IRPF Foral 2025 — ${nombreTerritorio}</p>
      <ul>
        <li><span>Salario bruto</span><span>${fmt(res.salarioBruto)}</span></li>
        <li><span>Reducción por trabajo</span><span>- ${fmt(res.redTrabajo)}</span></li>
        <li><span>Base liquidable</span><span>${fmt(res.baseLiquidable)}</span></li>
        <li><span>Cuota íntegra foral</span><span>${fmt(res.cuotaIntegra)}</span></li>
        <li><span>Mínimo personal y familiar</span><span>- ${fmt(res.minimoTotal)}</span></li>
        <li class="total-destacado"><span>Cuota líquida</span><span>${fmt(res.cuotaLiquida)}</span></li>
        <li><span>Tipo efectivo</span><span>${fmtPct(res.tipoEfectivo)}</span></li>
        ${retencionHTML}
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
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btn       = document.getElementById('btn-calcular');
  const resultDiv = document.getElementById('irpf-result');

  btn?.addEventListener('click', () => {
    const territorio      = document.getElementById('territorio').value;
    const salarioBruto    = parseFloat(document.getElementById('salario-bruto').value);
    const edad            = document.getElementById('edad').value;
    const situacion       = document.getElementById('situacion').value;
    const retencionActual = parseFloat(document.getElementById('retencion-actual').value) || 0;

    if (!territorio) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Selecciona tu territorio foral.</p>';
      return;
    }
    if (isNaN(salarioBruto) || salarioBruto <= 0) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce un salario bruto válido.</p>';
      return;
    }

    const res = calcularIRPFForal(salarioBruto, territorio, edad, situacion, retencionActual);
    if (!res) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Error en el cálculo. Revisa los datos.</p>';
      return;
    }

    renderResultado(res, resultDiv);
  });

  // Soporte Enter
  document.querySelectorAll('.irpf-card input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') btn?.click();
    });
  });
});
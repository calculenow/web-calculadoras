/**
 * irpf.js
 * Calculadora de IRPF 2025 — territorio común (15 CCAA)
 *
 * Lógica:
 *  1. Reducción por rendimientos del trabajo (art. 20 LIRPF)
 *  2. Mínimo personal y familiar
 *  3. Base liquidable = salario bruto - reducción trabajo
 *  4. Aplicar escala estatal (mitad) + escala autonómica
 *  5. Restar cuota del mínimo personal (tipo medio × mínimo)
 *  6. Simular retención: comparar cuota con lo retenido en nómina
 *
 * FUENTE: Tramos IRPF 2025 — AEAT / Panorama Fiscalidad Autonómica REAF 2025
 * Actualizar este archivo cada año con los nuevos tramos.
 */

// ── TRAMOS ESTATALES 2025 ────────────────────────────────────────────────────
// Cada entrada: [hasta, tipo]  (tipo en tanto por uno)
// El último tramo no tiene límite superior.
const TRAMOS_ESTATAL = [
  [12450,   0.095],
  [20200,   0.120],
  [35200,   0.150],
  [60000,   0.185],
  [300000,  0.225],
  [Infinity, 0.245],
];

// ── TRAMOS AUTONÓMICOS 2025 ──────────────────────────────────────────────────
// Mismo formato: [hasta, tipo]
// Fuente: escalas autonómicas vigentes ejercicio 2024 (declaración 2025)
const TRAMOS_AUTONOMICOS = {
  andalucia: [
    [12450,   0.095],
    [20200,   0.120],
    [35200,   0.150],
    [60000,   0.185],
    [Infinity, 0.225],
  ],
  aragon: [
    [12450,   0.100],
    [20200,   0.125],
    [35200,   0.155],
    [60000,   0.190],
    [Infinity, 0.250],
  ],
  asturias: [
    [12450,   0.090],
    [17707,   0.115],
    [33007,   0.140],
    [53407,   0.180],
    [70000,   0.215],
    [90000,   0.235],
    [175000,  0.245],
    [Infinity, 0.260],
  ],
  baleares: [
    [10000,   0.095],
    [18000,   0.115],
    [30000,   0.155],
    [50000,   0.195],
    [70000,   0.235],
    [Infinity, 0.275],
  ],
  canarias: [
    [12450,   0.090],
    [20200,   0.115],
    [35200,   0.130],
    [60000,   0.180],
    [90000,   0.235],
    [Infinity, 0.260],
  ],
  cantabria: [
    [12450,   0.090],
    [20200,   0.115],
    [35200,   0.155],
    [60000,   0.190],
    [90000,   0.230],
    [Infinity, 0.2475],
  ],
  castilla_la_mancha: [
    [12450,   0.095],
    [20200,   0.120],
    [35200,   0.150],
    [60000,   0.185],
    [Infinity, 0.225],
  ],
  castilla_y_leon: [
    [12450,   0.090],
    [20200,   0.120],
    [35200,   0.140],
    [60000,   0.185],
    [Infinity, 0.215],
  ],
  cataluna: [
    [12450,   0.105],
    [17707,   0.120],
    [21000,   0.140],
    [33007,   0.155],
    [53407,   0.175],
    [90000,   0.215],
    [120000,  0.235],
    [175000,  0.245],
    [Infinity, 0.255],
  ],
  extremadura: [
    [12450,   0.080],
    [20200,   0.105],
    [35200,   0.145],
    [60000,   0.190],
    [Infinity, 0.250],
  ],
  galicia: [
    [12450,   0.090],
    [20200,   0.115],
    [35200,   0.145],
    [60000,   0.185],
    [Infinity, 0.225],
  ],
  madrid: [
    [12450,   0.090],
    [17707,   0.110],
    [33007,   0.130],
    [53407,   0.170],
    [Infinity, 0.210],
  ],
  murcia: [
    [12450,   0.095],
    [20200,   0.120],
    [35200,   0.150],
    [60000,   0.185],
    [Infinity, 0.225],
  ],
  la_rioja: [
    [12450,   0.090],
    [20200,   0.115],
    [35200,   0.150],
    [60000,   0.195],
    [90000,   0.245],
    [Infinity, 0.270],
  ],
  c_valenciana: [
    [12000,   0.100],
    [20200,   0.130],
    [35200,   0.155],
    [60000,   0.185],
    [80000,   0.235],
    [120000,  0.255],
    [175000,  0.270],
    [Infinity, 0.295],
  ],
};

// ── MÍNIMOS PERSONALES 2025 ──────────────────────────────────────────────────
const MINIMO_PERSONAL = {
  menor65:  5550,
  '65_75':  6700,
  mayor75:  8100,
};

// Mínimos por descendientes (primer hijo, segundo, tercero, cuarto+)
const MINIMO_HIJOS = {
  soltero:  0,
  casado:   0,
  hijos1:   2400,
  hijos2:   2400 + 2700,
  hijos3:   2400 + 2700 + 4000,
};

// ── REDUCCIÓN POR RENDIMIENTOS DEL TRABAJO (art. 20 LIRPF 2025) ─────────────
function reduccionTrabajo(salarioBruto) {
  // Gastos deducibles fijos: 2.000 €
  const gastosFijos = 2000;
  let reduccion = 0;

  if (salarioBruto <= 13115) {
    reduccion = 5565;
  } else if (salarioBruto <= 16825) {
    reduccion = 5565 - 1.5 * (salarioBruto - 13115);
  } else {
    reduccion = 0;
  }

  return gastosFijos + reduccion;
}

// ── APLICAR ESCALA DE TRAMOS ─────────────────────────────────────────────────
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

// ── CÁLCULO PRINCIPAL ────────────────────────────────────────────────────────
function calcularIRPF(salarioBruto, ccaa, edad, situacion, retencionActualPct) {
  const tramosAuto = TRAMOS_AUTONOMICOS[ccaa];
  if (!tramosAuto) return null;

  // 1. Reducción por trabajo
  const redTrabajo = reduccionTrabajo(salarioBruto);

  // 2. Base liquidable general
  const baseLiquidable = Math.max(0, salarioBruto - redTrabajo);

  // 3. Mínimo personal + familiar
  const minimoPersonal = MINIMO_PERSONAL[edad] || 5550;
  const minimoFamiliar = MINIMO_HIJOS[situacion] || 0;
  const minimoTotal    = minimoPersonal + minimoFamiliar;

  // 4. Cuota íntegra estatal (mitad de la escala estatal)
  // La escala estatal se divide al 50% entre estado y CCAA para no residentes,
  // pero para residentes en CCAA de régimen común el estado aplica su propia escala.
  const cuotaEstatal  = aplicarEscala(baseLiquidable, TRAMOS_ESTATAL);
  const cuotaAuto     = aplicarEscala(baseLiquidable, tramosAuto);
  const cuotaIntegra  = cuotaEstatal + cuotaAuto;

  // 5. Reducción por mínimo personal (se aplica a tipo medio)
  // La cuota del mínimo personal se calcula aplicando los mismos tramos sobre el mínimo
  const cuotaMinEstatal = aplicarEscala(minimoTotal, TRAMOS_ESTATAL);
  const cuotaMinAuto    = aplicarEscala(minimoTotal, tramosAuto);
  const cuotaMinTotal   = cuotaMinEstatal + cuotaMinAuto;

  // 6. Cuota líquida (antes de deducciones adicionales)
  const cuotaLiquida = Math.max(0, cuotaIntegra - cuotaMinTotal);

  // 7. Tipo efectivo real
  const tipoEfectivo = salarioBruto > 0 ? (cuotaLiquida / salarioBruto) * 100 : 0;

  // 8. Simulador de retención
  const retenidoAnual  = retencionActualPct > 0
    ? salarioBruto * (retencionActualPct / 100)
    : null;
  const diferencia     = retenidoAnual !== null
    ? retenidoAnual - cuotaLiquida
    : null;

  return {
    salarioBruto,
    redTrabajo,
    baseLiquidable,
    minimoTotal,
    cuotaEstatal,
    cuotaAuto,
    cuotaIntegra,
    cuotaLiquida,
    tipoEfectivo,
    retenidoAnual,
    diferencia,
  };
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function fmt(n) {
  return n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtPct(n) {
  return n.toFixed(2).replace('.', ',') + ' %';
}

// ── RENDERIZAR RESULTADO ─────────────────────────────────────────────────────
function renderResultado(res, resultDiv) {
  const signo = res.diferencia !== null
    ? (res.diferencia >= 0 ? 'devolver' : 'pagar')
    : null;
  const absDiv = res.diferencia !== null ? Math.abs(res.diferencia) : 0;

  const retencionHTML = res.diferencia !== null ? `
    <li class="irpf-separador"><span colspan="2">── Simulador de retención ──</span></li>
    <li><span>Retenido en nómina (estimado)</span><span>${fmt(res.retenidoAnual)}</span></li>
    <li class="total-destacado ${signo === 'devolver' ? 'irpf-devolver' : 'irpf-pagar'}">
      <span>Declaración estimada</span>
      <span>${signo === 'devolver' ? '✅ A devolver' : '⚠️ A pagar'} ${fmt(absDiv)}</span>
    </li>
  ` : '';

  const textoCopiar = [
    `Salario bruto: ${fmt(res.salarioBruto)}`,
    `Reducción trabajo: ${fmt(res.redTrabajo)}`,
    `Base liquidable: ${fmt(res.baseLiquidable)}`,
    `Cuota estatal: ${fmt(res.cuotaEstatal)}`,
    `Cuota autonómica: ${fmt(res.cuotaAuto)}`,
    `Mínimo personal/familiar: ${fmt(res.minimoTotal)}`,
    `Cuota líquida: ${fmt(res.cuotaLiquida)}`,
    `Tipo efectivo: ${fmtPct(res.tipoEfectivo)}`,
    res.diferencia !== null
      ? `Declaración estimada: ${signo === 'devolver' ? 'A devolver' : 'A pagar'} ${fmt(absDiv)}`
      : '',
  ].filter(Boolean).join('\n');

  resultDiv.innerHTML = `
    <div class="resumen-calculo">
      <p class="resumen-titulo">Resultado IRPF 2025</p>
      <ul>
        <li><span>Salario bruto</span><span>${fmt(res.salarioBruto)}</span></li>
        <li><span>Reducción por trabajo</span><span>- ${fmt(res.redTrabajo)}</span></li>
        <li><span>Base liquidable</span><span>${fmt(res.baseLiquidable)}</span></li>
        <li><span>Cuota íntegra estatal</span><span>${fmt(res.cuotaEstatal)}</span></li>
        <li><span>Cuota íntegra autonómica</span><span>${fmt(res.cuotaAuto)}</span></li>
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

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btn         = document.getElementById('btn-calcular');
  const resultDiv   = document.getElementById('irpf-result');
  const ccaaSelect  = document.getElementById('ccaa');
  const foralNota   = document.getElementById('foral-nota');

  // Mostrar nota foral si seleccionan la opción deshabilitada
  ccaaSelect?.addEventListener('change', () => {
    foralNota.style.display = ccaaSelect.value === 'foral' ? 'block' : 'none';
  });

  btn?.addEventListener('click', () => {
    const ccaa           = ccaaSelect.value;
    const salarioBruto   = parseFloat(document.getElementById('salario-bruto').value);
    const edad           = document.getElementById('edad').value;
    const situacion      = document.getElementById('situacion').value;
    const retencionActual = parseFloat(document.getElementById('retencion-actual').value) || 0;

    // Validaciones
    if (!ccaa || ccaa === 'foral') {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Selecciona tu comunidad autónoma.</p>';
      return;
    }
    if (isNaN(salarioBruto) || salarioBruto <= 0) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce un salario bruto válido.</p>';
      return;
    }
    if (salarioBruto > 10000000) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ El salario introducido parece demasiado alto.</p>';
      return;
    }

    const res = calcularIRPF(salarioBruto, ccaa, edad, situacion, retencionActual);
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
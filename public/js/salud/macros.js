/**
 * macros.js
 * Calculadora de macronutrientes diarios.
 * Fórmula: Mifflin-St Jeor → TDEE → ajuste por objetivo → distribución de macros
 */

document.addEventListener('DOMContentLoaded', () => {

  const btn       = document.getElementById('btn-calcular');
  const resultDiv = document.getElementById('macros-result');

  // ── DISTRIBUCIONES DE MACROS POR OBJETIVO ──────────────────────────────────
  // [proteínas%, carbos%, grasas%]
  const distribuciones = {
    deficit:       { prot: 0.33, carbs: 0.37, grasas: 0.30, ajuste: 0.80, label: 'Pérdida de grasa' },
    mantenimiento: { prot: 0.28, carbs: 0.45, grasas: 0.27, ajuste: 1.00, label: 'Mantenimiento' },
    superavit:     { prot: 0.28, carbs: 0.50, grasas: 0.22, ajuste: 1.10, label: 'Ganancia muscular' },
  };

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function fmt(n, dec = 0) {
    return Math.round(n).toLocaleString('es-ES');
  }

  function fmtG(n) {
    return `${Math.round(n)} g`;
  }

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  btn?.addEventListener('click', () => {
    const sexo      = document.getElementById('sexo').value;
    const edad      = parseFloat(document.getElementById('edad').value);
    const peso      = parseFloat(document.getElementById('peso').value);
    const altura    = parseFloat(document.getElementById('altura').value);
    const actividad = parseFloat(document.getElementById('actividad').value);
    const objetivo  = document.getElementById('objetivo').value;

    if ([edad, peso, altura].some(v => isNaN(v) || v <= 0)) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce todos los datos correctamente.</p>';
      return;
    }

    // TMB Mifflin-St Jeor
    const tmb = sexo === 'hombre'
      ? 10 * peso + 6.25 * altura - 5 * edad + 5
      : 10 * peso + 6.25 * altura - 5 * edad - 161;

    // TDEE y ajuste por objetivo
    const tdee     = tmb * actividad;
    const dist     = distribuciones[objetivo];
    const kcalObj  = tdee * dist.ajuste;

    // Gramos de cada macro
    const protG   = (kcalObj * dist.prot)   / 4;
    const carbsG  = (kcalObj * dist.carbs)  / 4;
    const grasasG = (kcalObj * dist.grasas) / 9;

    // Calorías de cada macro
    const kcalProt   = protG   * 4;
    const kcalCarbs  = carbsG  * 4;
    const kcalGrasas = grasasG * 9;

    const textoCopiar = [
      `Objetivo: ${dist.label}`,
      `Calorías totales: ${fmt(kcalObj)} kcal/día`,
      ``,
      `Proteínas:     ${fmtG(protG)}   (${fmt(kcalProt)} kcal)`,
      `Carbohidratos: ${fmtG(carbsG)}  (${fmt(kcalCarbs)} kcal)`,
      `Grasas:        ${fmtG(grasasG)} (${fmt(kcalGrasas)} kcal)`,
      ``,
      `TMB: ${fmt(tmb)} kcal | TDEE: ${fmt(tdee)} kcal`,
    ].join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${dist.label} — ${fmt(kcalObj)} kcal/día</p>
        <ul>
          <li class="total-destacado macros-proteinas">
            <span>🥩 Proteínas</span>
            <span>${fmtG(protG)} <small>(${fmt(kcalProt)} kcal)</small></span>
          </li>
          <li class="macros-carbos">
            <span>🍞 Carbohidratos</span>
            <span>${fmtG(carbsG)} <small>(${fmt(kcalCarbs)} kcal)</small></span>
          </li>
          <li class="macros-grasas">
            <span>🥑 Grasas</span>
            <span>${fmtG(grasasG)} <small>(${fmt(kcalGrasas)} kcal)</small></span>
          </li>
        </ul>

        <div class="macros-barra">
          <div class="macros-barra-prot"  style="width:${Math.round(dist.prot  * 100)}%" title="Proteínas ${Math.round(dist.prot * 100)}%"></div>
          <div class="macros-barra-carbs" style="width:${Math.round(dist.carbs * 100)}%" title="Carbos ${Math.round(dist.carbs * 100)}%"></div>
          <div class="macros-barra-gras"  style="width:${Math.round(dist.grasas * 100)}%" title="Grasas ${Math.round(dist.grasas * 100)}%"></div>
        </div>
        <div class="macros-barra-legend">
          <span class="macros-dot-prot">● Proteínas ${Math.round(dist.prot * 100)}%</span>
          <span class="macros-dot-carbs">● Carbos ${Math.round(dist.carbs * 100)}%</span>
          <span class="macros-dot-gras">● Grasas ${Math.round(dist.grasas * 100)}%</span>
        </div>

        <ul class="macros-desglose">
          <li><span>TMB (metabolismo basal)</span><span>${fmt(tmb)} kcal</span></li>
          <li><span>TDEE (gasto total diario)</span><span>${fmt(tdee)} kcal</span></li>
          <li><span>Calorías objetivo</span><span>${fmt(kcalObj)} kcal</span></li>
        </ul>

        <button class="btn-copy" data-copy-text="${textoCopiar}">📋 Copiar resultado</button>
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
  });

  // Soporte Enter
  document.querySelectorAll('.macros-card input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') btn?.click();
    });
  });

});
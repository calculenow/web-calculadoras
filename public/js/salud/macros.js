/**
 * macros.js
 * Calculadora de macronutrientes diarios.
 * Fórmula: Mifflin-St Jeor → TDEE → ajuste por objetivo → distribución de macros
 * Todos los textos visibles se leen desde data-* del div#macros-result (i18n via HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

  const btn       = document.getElementById('btn-calcular');
  const resultDiv = document.getElementById('macros-result');

  if (!btn || !resultDiv) return;

  const d = resultDiv.dataset;

  // ── DISTRIBUCIONES DE MACROS POR OBJETIVO ──────────────────────────────────
  const distribuciones = {
    deficit:       { prot: 0.33, carbs: 0.37, grasas: 0.30, ajuste: 0.80, label: d.labelDeficit },
    mantenimiento: { prot: 0.28, carbs: 0.45, grasas: 0.27, ajuste: 1.00, label: d.labelMant },
    superavit:     { prot: 0.28, carbs: 0.50, grasas: 0.22, ajuste: 1.10, label: d.labelSuperavit },
  };

  // ── HELPERS ────────────────────────────────────────────────────────────────
  const fmt  = n => Math.round(n).toLocaleString();
  const fmtG = n => `${Math.round(n)} g`;

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    const sexo      = document.getElementById('sexo').value;
    const edad      = parseFloat(document.getElementById('edad').value);
    const peso      = parseFloat(document.getElementById('peso').value);
    const altura    = parseFloat(document.getElementById('altura').value);
    const actividad = parseFloat(document.getElementById('actividad').value);
    const objetivo  = document.getElementById('objetivo').value;

    if ([edad, peso, altura].some(v => isNaN(v) || v <= 0)) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msError}</p>`;
      return;
    }

    // TMB Mifflin-St Jeor
    const tmb = sexo === d.valMale
      ? 10 * peso + 6.25 * altura - 5 * edad + 5
      : 10 * peso + 6.25 * altura - 5 * edad - 161;

    const tdee    = tmb * actividad;
    const dist    = distribuciones[objetivo];
    const kcalObj = tdee * dist.ajuste;

    const protG   = (kcalObj * dist.prot)   / 4;
    const carbsG  = (kcalObj * dist.carbs)  / 4;
    const grasasG = (kcalObj * dist.grasas) / 9;

    const kcalProt   = protG   * 4;
    const kcalCarbs  = carbsG  * 4;
    const kcalGrasas = grasasG * 9;

    const textoCopiar = [
      `${d.labelGoal}: ${dist.label}`,
      `${d.labelTotalKcal}: ${fmt(kcalObj)} kcal/${d.labelDay}`,
      ``,
      `${d.labelProt}:  ${fmtG(protG)}   (${fmt(kcalProt)} kcal)`,
      `${d.labelCarbs}: ${fmtG(carbsG)}  (${fmt(kcalCarbs)} kcal)`,
      `${d.labelFat}:   ${fmtG(grasasG)} (${fmt(kcalGrasas)} kcal)`,
      ``,
      `${d.labelTmb}: ${fmt(tmb)} kcal | ${d.labelTdee}: ${fmt(tdee)} kcal`,
    ].join('\n');

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${dist.label} — ${fmt(kcalObj)} kcal/${d.labelDay}</p>
        <ul>
          <li class="total-destacado macros-proteinas">
            <span>${d.iconProt} ${d.labelProt}</span>
            <span>${fmtG(protG)} <small>(${fmt(kcalProt)} kcal)</small></span>
          </li>
          <li class="macros-carbos">
            <span>${d.iconCarbs} ${d.labelCarbs}</span>
            <span>${fmtG(carbsG)} <small>(${fmt(kcalCarbs)} kcal)</small></span>
          </li>
          <li class="macros-grasas">
            <span>${d.iconFat} ${d.labelFat}</span>
            <span>${fmtG(grasasG)} <small>(${fmt(kcalGrasas)} kcal)</small></span>
          </li>
        </ul>

        <div class="macros-barra">
          <div class="macros-barra-prot"  style="width:${Math.round(dist.prot  * 100)}%" title="${d.labelProt} ${Math.round(dist.prot * 100)}%"></div>
          <div class="macros-barra-carbs" style="width:${Math.round(dist.carbs * 100)}%" title="${d.labelCarbs} ${Math.round(dist.carbs * 100)}%"></div>
          <div class="macros-barra-gras"  style="width:${Math.round(dist.grasas * 100)}%" title="${d.labelFat} ${Math.round(dist.grasas * 100)}%"></div>
        </div>
        <div class="macros-barra-legend">
          <span class="macros-dot-prot">● ${d.labelProt} ${Math.round(dist.prot * 100)}%</span>
          <span class="macros-dot-carbs">● ${d.labelCarbs} ${Math.round(dist.carbs * 100)}%</span>
          <span class="macros-dot-gras">● ${d.labelFat} ${Math.round(dist.grasas * 100)}%</span>
        </div>

        <ul class="macros-desglose">
          <li><span>${d.labelTmb}</span><span>${fmt(tmb)} kcal</span></li>
          <li><span>${d.labelTdee}</span><span>${fmt(tdee)} kcal</span></li>
          <li><span>${d.labelTotalKcal}</span><span>${fmt(kcalObj)} kcal</span></li>
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
  });

  document.querySelectorAll('.macros-card input').forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
  });

});
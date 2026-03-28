/**
 * geometria.js
 * Calculadora de área y perímetro de figuras geométricas.
 * Todos los textos visibles se leen desde data-* de div#geometria-i18n (i18n via HTML).
 * Cada figura tiene sus propios data-* con labels de inputs y fórmula.
 */

document.addEventListener('DOMContentLoaded', () => {

  const i18n = document.getElementById('geometria-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

  const selectFigura = document.getElementById('figura');
  const inputsDiv    = document.getElementById('geometria-inputs');
  const formulaDiv   = document.getElementById('geometria-formula');
  const btn          = document.getElementById('btn-calcular');
  const resultDiv    = document.getElementById('geometria-result');

  // ── DEFINICIÓN DE FIGURAS ──────────────────────────────────────────────────
  // Los textos vienen del i18n div. Cada figura tiene:
  //   data-{key}-label    → nombre visible de la figura
  //   data-{key}-formula  → fórmula visual
  //   data-{key}-inputs   → JSON con array de {id, label}
  const figuras = {
    cuadrado:   { calc: v => ({ area: v.lado ** 2,                                                    perimetro: 4 * v.lado }) },
    rectangulo: { calc: v => ({ area: v.base * v.altura,                                              perimetro: 2 * (v.base + v.altura) }) },
    triangulo:  { calc: v => ({ area: (v.base * v.altura) / 2,                                        perimetro: v.lado1 + v.lado2 + v.lado3 }) },
    circulo:    { calc: v => ({ area: Math.PI * v.radio ** 2,                                         perimetro: 2 * Math.PI * v.radio }) },
    trapecio:   { calc: v => ({ area: ((v.baseMayor + v.baseMenor) * v.altura) / 2,                   perimetro: v.baseMayor + v.baseMenor + v.lado1 + v.lado2 }) },
    rombo:      { calc: v => ({ area: (v.diag1 * v.diag2) / 2,                                        perimetro: 4 * Math.sqrt((v.diag1 / 2) ** 2 + (v.diag2 / 2) ** 2) }) },
    elipse:     { calc: v => ({ area: Math.PI * v.semieje_a * v.semieje_b,                            perimetro: Math.PI * (3 * (v.semieje_a + v.semieje_b) - Math.sqrt((3 * v.semieje_a + v.semieje_b) * (v.semieje_a + 3 * v.semieje_b))) }) },
    pentagono:  { calc: v => ({ area: (v.lado ** 2 * Math.sqrt(25 + 10 * Math.sqrt(5))) / 4,          perimetro: 5 * v.lado }) },
    hexagono:   { calc: v => ({ area: (3 * Math.sqrt(3) / 2) * v.lado ** 2,                           perimetro: 6 * v.lado }) },
  };

  // ── LEER TEXTOS DE FIGURA DESDE i18n ──────────────────────────────────────
  function getFiguraData(key) {
    return {
      label:   d[`${key}Label`],
      formula: d[`${key}Formula`],
      inputs:  JSON.parse(d[`${key}Inputs`]),
    };
  }

  // ── RENDERIZAR INPUTS ──────────────────────────────────────────────────────
  function renderInputs(figuraKey) {
    const figura = getFiguraData(figuraKey);
    resultDiv.innerHTML = '';

    inputsDiv.innerHTML = figura.inputs.map(inp => `
      <div class="form-group">
        <label for="geo-${inp.id}">${inp.label}</label>
        <input id="geo-${inp.id}" class="field geo-input" data-key="${inp.id}"
          type="number" placeholder="0" min="0" step="any" />
      </div>
    `).join('');

    inputsDiv.querySelectorAll('.geo-input').forEach(input => {
      input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
    });

    formulaDiv.textContent = figura.formula;
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function fmt(n) {
    return parseFloat(n.toPrecision(6)).toLocaleString(d.locale);
  }

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    const figuraKey = selectFigura.value;
    const figura    = getFiguraData(figuraKey);
    const valores   = {};
    let hayError    = false;

    inputsDiv.querySelectorAll('.geo-input').forEach(input => {
      const val = parseFloat(input.value);
      if (isNaN(val) || val <= 0) { hayError = true; }
      else { valores[input.dataset.key] = val; }
    });

    if (hayError) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msError}</p>`;
      return;
    }

    const { area, perimetro } = figuras[figuraKey].calc(valores);

    const textoCopiar = `${figura.label}\n${d.labelArea}: ${fmt(area)}\n${d.labelPerimeter}: ${fmt(perimetro)}`;

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${figura.label}</p>
        <ul>
          <li class="total-destacado"><span>${d.labelArea}</span><span>${fmt(area)}</span></li>
          <li><span>${d.labelPerimeter}</span><span>${fmt(perimetro)}</span></li>
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

  // ── CAMBIO DE FIGURA ───────────────────────────────────────────────────────
  selectFigura.addEventListener('change', () => renderInputs(selectFigura.value));

  // ── INICIO ─────────────────────────────────────────────────────────────────
  renderInputs(selectFigura.value);

});
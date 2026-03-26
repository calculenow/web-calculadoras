/**
 * geometria.js
 * Calculadora de área y perímetro de figuras geométricas.
 * Figuras: cuadrado, rectángulo, triángulo, círculo, trapecio,
 *          rombo, elipse, pentágono regular, hexágono regular.
 */

document.addEventListener('DOMContentLoaded', () => {

  const selectFigura  = document.getElementById('figura');
  const inputsDiv     = document.getElementById('geometria-inputs');
  const formulaDiv    = document.getElementById('geometria-formula');
  const btn           = document.getElementById('btn-calcular');
  const resultDiv     = document.getElementById('geometria-result');

  // ── DEFINICIÓN DE FIGURAS ──────────────────────────────────────────────────
  const figuras = {
    cuadrado: {
      label:   'Cuadrado',
      inputs:  [{ id: 'lado', label: 'Lado (l)' }],
      formula: 'Área = l²   |   Perímetro = 4 × l',
      calc(v) {
        const l = v.lado;
        return { area: l ** 2, perimetro: 4 * l };
      },
    },
    rectangulo: {
      label:   'Rectángulo',
      inputs:  [{ id: 'base', label: 'Base (b)' }, { id: 'altura', label: 'Altura (h)' }],
      formula: 'Área = b × h   |   Perímetro = 2 × (b + h)',
      calc(v) {
        return { area: v.base * v.altura, perimetro: 2 * (v.base + v.altura) };
      },
    },
    triangulo: {
      label:   'Triángulo',
      inputs:  [
        { id: 'base',   label: 'Base (b)' },
        { id: 'altura', label: 'Altura (h)' },
        { id: 'lado1',  label: 'Lado 1 (a)' },
        { id: 'lado2',  label: 'Lado 2 (b)' },
        { id: 'lado3',  label: 'Lado 3 (c)' },
      ],
      formula: 'Área = (b × h) / 2   |   Perímetro = a + b + c',
      calc(v) {
        return {
          area:      (v.base * v.altura) / 2,
          perimetro: v.lado1 + v.lado2 + v.lado3,
        };
      },
    },
    circulo: {
      label:   'Círculo',
      inputs:  [{ id: 'radio', label: 'Radio (r)' }],
      formula: 'Área = π × r²   |   Perímetro = 2 × π × r',
      calc(v) {
        return {
          area:      Math.PI * v.radio ** 2,
          perimetro: 2 * Math.PI * v.radio,
        };
      },
    },
    trapecio: {
      label:   'Trapecio',
      inputs:  [
        { id: 'baseMayor', label: 'Base mayor (B)' },
        { id: 'baseMenor', label: 'Base menor (b)' },
        { id: 'altura',    label: 'Altura (h)' },
        { id: 'lado1',     label: 'Lado oblicuo 1' },
        { id: 'lado2',     label: 'Lado oblicuo 2' },
      ],
      formula: 'Área = ((B + b) × h) / 2   |   Perímetro = B + b + l₁ + l₂',
      calc(v) {
        return {
          area:      ((v.baseMayor + v.baseMenor) * v.altura) / 2,
          perimetro: v.baseMayor + v.baseMenor + v.lado1 + v.lado2,
        };
      },
    },
    rombo: {
      label:   'Rombo',
      inputs:  [
        { id: 'diag1', label: 'Diagonal mayor (d₁)' },
        { id: 'diag2', label: 'Diagonal menor (d₂)' },
      ],
      formula: 'Área = (d₁ × d₂) / 2   |   Perímetro = 4 × √((d₁/2)² + (d₂/2)²)',
      calc(v) {
        const lado = Math.sqrt((v.diag1 / 2) ** 2 + (v.diag2 / 2) ** 2);
        return {
          area:      (v.diag1 * v.diag2) / 2,
          perimetro: 4 * lado,
        };
      },
    },
    elipse: {
      label:   'Elipse',
      inputs:  [
        { id: 'semieje_a', label: 'Semieje mayor (a)' },
        { id: 'semieje_b', label: 'Semieje menor (b)' },
      ],
      formula: 'Área = π × a × b   |   Perímetro ≈ π × (3(a+b) − √((3a+b)(a+3b)))',
      calc(v) {
        const a = v.semieje_a, b = v.semieje_b;
        // Aproximación de Ramanujan
        const perimetro = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
        return { area: Math.PI * a * b, perimetro };
      },
    },
    pentagono: {
      label:   'Pentágono regular',
      inputs:  [{ id: 'lado', label: 'Lado (l)' }],
      formula: 'Área = (l² × √(25 + 10√5)) / 4   |   Perímetro = 5 × l',
      calc(v) {
        const l = v.lado;
        return {
          area:      (l ** 2 * Math.sqrt(25 + 10 * Math.sqrt(5))) / 4,
          perimetro: 5 * l,
        };
      },
    },
    hexagono: {
      label:   'Hexágono regular',
      inputs:  [{ id: 'lado', label: 'Lado (l)' }],
      formula: 'Área = (3√3 / 2) × l²   |   Perímetro = 6 × l',
      calc(v) {
        const l = v.lado;
        return {
          area:      (3 * Math.sqrt(3) / 2) * l ** 2,
          perimetro: 6 * l,
        };
      },
    },
  };

  // ── RENDERIZAR INPUTS ──────────────────────────────────────────────────────
  function renderInputs(figuraKey) {
    const figura = figuras[figuraKey];
    resultDiv.innerHTML = '';

    inputsDiv.innerHTML = figura.inputs.map(inp => `
      <div class="form-group">
        <label for="geo-${inp.id}">${inp.label}</label>
        <input id="geo-${inp.id}" class="field geo-input" data-key="${inp.id}"
          type="number" placeholder="0" min="0" step="any" />
      </div>
    `).join('');

    // Soporte Enter
    inputsDiv.querySelectorAll('.geo-input').forEach(input => {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') btn.click();
      });
    });

    formulaDiv.textContent = figura.formula;
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────
  function fmt(n) {
    return parseFloat(n.toPrecision(6)).toLocaleString('es-ES');
  }

  // ── CALCULAR ───────────────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    const figuraKey = selectFigura.value;
    const figura    = figuras[figuraKey];
    const valores   = {};
    let hayError    = false;

    inputsDiv.querySelectorAll('.geo-input').forEach(input => {
      const val = parseFloat(input.value);
      if (isNaN(val) || val <= 0) {
        hayError = true;
      } else {
        valores[input.dataset.key] = val;
      }
    });

    if (hayError) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce valores válidos y mayores que 0 en todos los campos.</p>';
      return;
    }

    const { area, perimetro } = figura.calc(valores);

    const textoCopiar = `${figura.label}\nÁrea: ${fmt(area)}\nPerímetro: ${fmt(perimetro)}`;

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${figura.label}</p>
        <ul>
          <li class="total-destacado"><span>Área</span><span>${fmt(area)}</span></li>
          <li><span>Perímetro</span><span>${fmt(perimetro)}</span></li>
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

  // ── CAMBIO DE FIGURA ───────────────────────────────────────────────────────
  selectFigura.addEventListener('change', () => renderInputs(selectFigura.value));

  // ── INICIO ─────────────────────────────────────────────────────────────────
  renderInputs(selectFigura.value);

});
// ==================== CALCULADORA DE PORCENTAJES ====================

const isEn = window.location.pathname.includes('/en/');

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector('.btn-percent');
  const totalInput = document.getElementById('total');
  const percentInput = document.getElementById('percent');
  const resultDiv = document.querySelector('.result-percent');

  if (!btn || !resultDiv) return;

  const labels = resultDiv.dataset;
  const bCopy = labels.btnCopy || (isEn ? "Copy Result" : "Copiar Resultado");

  const calcular = () => {
    if (!validarNumeros([totalInput, percentInput])) {
      resultDiv.textContent = isEn ? 'Enter valid values' : 'Introduce valores válidos';
      return;
    }

    const total = parseFloat(totalInput.value);
    const pct = parseFloat(percentInput.value);
    const result = (total * pct) / 100;

    const f = (n) => n.toLocaleString(isEn ? 'en-US' : 'es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    const textoCopia = isEn
      ? `${pct}% of ${total} = ${f(result)}`
      : `${pct}% de ${total} = ${f(result)}`;

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <ul>
          <li>
            <span>${isEn ? 'Amount' : 'Cantidad'}:</span>
            <strong>${f(total)}</strong>
          </li>
          <li>
            <span>${isEn ? 'Percentage' : 'Porcentaje'}:</span>
            <strong>${f(pct)}%</strong>
          </li>
          <li class="total-destacado">
            <span>${isEn ? 'Result' : 'Resultado'}:</span>
            <strong>${f(result)}</strong>
          </li>
        </ul>
        <button class="btn-copy" data-copy-text="${textoCopia}">
          ${bCopy}
        </button>
      </div>
    `;

    resultDiv.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = '✅';
        setTimeout(() => this.innerText = original, 2000);
      });
    });
  };

  btn.addEventListener('click', calcular);

  [totalInput, percentInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') calcular();
    });
  });
});
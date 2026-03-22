/**
 * CALCULADORA DE PRÉSTAMOS E HIPOTECAS
 */

const isEn = window.location.pathname.includes('/en/');

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector('.btn-mortgage');
  const resultDiv = document.querySelector('.result-mortgage');

  if (!btn || !resultDiv) return;

  const capInput = document.querySelector('.capital');
  const intInput = document.querySelector('.interes');
  const plaInput = document.querySelector('.plazo');

  const format = (num) => num.toLocaleString(isEn ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: isEn ? 'USD' : 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const calcular = () => {
    const P = parseFloat(capInput.value);
    const anualInterest = parseFloat(intInput.value);
    const years = parseInt(plaInput.value);

    if (isNaN(P) || isNaN(anualInterest) || isNaN(years) || P <= 0 || anualInterest <= 0 || years <= 0) {
      resultDiv.innerHTML = `<p class="result-error">${isEn ? 'Please fill all fields with positive values.' : 'Por favor, rellena todos los campos con valores positivos.'}</p>`;
      return;
    }

    const r = (anualInterest / 100) / 12;
    const n = years * 12;
    const cuota = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPagado = cuota * n;
    const totalIntereses = totalPagado - P;

    const labels = resultDiv.dataset;
    const tRes = isEn ? "Feasibility Summary" : "Resumen de Viabilidad";
    const tCuo = isEn ? "Monthly Payment" : "Cuota Mensual";
    const tPre = isEn ? "Loan Amount" : "Préstamo solicitado";
    const tInt = isEn ? "Total Interest" : "Intereses totales";
    const tDev = isEn ? "Total Repayment" : "Total a devolver";
    const tNote = isEn ? '* Calculation based on the French amortization system.' : '* Basado en el sistema de amortización francés.';
    const bCopy = labels.btnCopy || (isEn ? "Copy Summary" : "Copiar Resumen");

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${tRes}</p>
        <ul>
          <li class="total-destacado"><span>${tCuo}:</span> <strong>${format(cuota)}</strong></li>
          <li><span>${tPre}:</span> <span>${format(P)}</span></li>
          <li><span>${tInt}:</span> <span class="prestamo-intereses">${format(totalIntereses)}</span></li>
          <li><span>${tDev}:</span> <strong>${format(totalPagado)}</strong></li>
        </ul>
        <p class="prestamo-nota">${tNote}</p>
        <button class="btn-copy" data-copy-text="${tRes}\n---------------------------\n${tCuo}: ${format(cuota)}\n${tPre}: ${format(P)}\n${tInt}: ${format(totalIntereses)}\n${tDev}: ${format(totalPagado)}">
          ${bCopy}
        </button>
      </div>
    `;

    resultDiv.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const old = this.innerText;
        this.innerText = "✅";
        setTimeout(() => this.innerText = old, 2000);
      });
    });
  };

  btn.addEventListener('click', calcular);

  [capInput, intInput, plaInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') calcular();
    });
  });
});
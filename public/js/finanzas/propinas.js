/**
 * CALCULADORA DE PROPINAS Y REPARTO DE CUENTA
 */

const isEn = window.location.pathname.includes('/en/');

document.addEventListener("DOMContentLoaded", () => {
  const totalInput = document.querySelector('.cuenta-total');
  const pctInput = document.querySelector('.propina-pct');
  const personasInput = document.querySelector('.personas');
  const resultDiv = document.querySelector('.result-tip');
  const btn = document.querySelector('.btn-tip');

  if (!btn || !resultDiv) return;

  const format = (num) => num.toLocaleString(isEn ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: isEn ? 'USD' : 'EUR'
  });

  const calcular = () => {
    const total = parseFloat(totalInput.value) || 0;
    const pct = parseFloat(pctInput.value) || 0;
    const numPersonas = parseInt(personasInput.value) || 1;

    if (total <= 0) {
      resultDiv.innerHTML = `<p class="result-error">${isEn ? 'Please enter the total bill.' : 'Introduce el total de la cuenta.'}</p>`;
      return;
    }
    if (numPersonas <= 0) {
      resultDiv.innerHTML = `<p class="result-error">${isEn ? 'Minimum 1 person.' : 'Mínimo 1 persona.'}</p>`;
      return;
    }

    const propinaTotal = total * (pct / 100);
    const granTotal = total + propinaTotal;
    const porPersona = granTotal / numPersonas;

    const tTitle = isEn ? "Payment Breakdown:" : "Desglose del pago:";
    const tOriginal = isEn ? "Original Bill" : "Cuenta original";
    const tTip = isEn ? `Tip (${pct}%)` : `Propina (${pct}%)`;
    const tTotal = isEn ? "Total with Tip" : "Total con propina";
    const tEach = isEn ? "Each person pays" : "Cada persona paga";
    const bCopy = isEn ? "Copy Result" : "Copiar Resultado";

    const textoCopia = `${tTitle}\n---------------------------\n${tOriginal}: ${format(total)}\n${tTip}: ${format(propinaTotal)}\n${tTotal}: ${format(granTotal)}\n${tEach}: ${format(porPersona)}`;

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${tTitle}</p>
        <ul>
          <li><span>${tOriginal}:</span> <span>${format(total)}</span></li>
          <li><span>${tTip}:</span> <span>${format(propinaTotal)}</span></li>
          <li><span>${tTotal}:</span> <span>${format(granTotal)}</span></li>
          <li class="total-destacado">
            <span>${tEach}:</span>
            <strong>${format(porPersona)}</strong>
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
        this.innerText = "✅";
        setTimeout(() => this.innerText = original, 2000);
      });
    });
  };

  btn.addEventListener('click', calcular);

  [totalInput, pctInput, personasInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') calcular();
    });
  });
});
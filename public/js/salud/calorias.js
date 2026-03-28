document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector('.btn-tmb');
  const resultDiv = document.querySelector('.result-tmb');

  if (!btn || !resultDiv) return;

  const labels = resultDiv.dataset;

  btn.addEventListener('click', () => {
    const genero = document.querySelector('.genero').value;
    const peso = parseFloat(document.querySelector('.peso').value);
    const altura = parseFloat(document.querySelector('.altura').value);
    const edad = parseInt(document.querySelector('.edad').value);
    const factorActividad = parseFloat(document.querySelector('.actividad').value);

    const esValido = (
      peso >= 20 && peso <= 400 &&
      altura >= 50 && altura <= 260 &&
      edad >= 15 && edad <= 110
    );

    if (!esValido) {
      resultDiv.innerHTML = `<p class="result-error">${labels.msError}</p>`;
      return;
    }

    let tmb = genero === 'hombre'
      ? (10 * peso) + (6.25 * altura) - (5 * edad) + 5
      : (10 * peso) + (6.25 * altura) - (5 * edad) - 161;

    const mantenimiento = tmb * factorActividad;
    const perder = mantenimiento * 0.85;
    const ganar = mantenimiento * 1.10;
    const unidad = labels.unit || 'kcal';

    const textoCopia = `${labels.labelBmr}: ${Math.round(tmb)} ${unidad}\n${labels.labelTdee}: ${Math.round(mantenimiento)} ${unidad}\n${labels.labelLose}: ${Math.round(perder)} ${unidad}\n${labels.labelGain}: ${Math.round(ganar)} ${unidad}`;

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <p class="resumen-titulo">${labels.header}</p>
        <ul>
          <li>
            <span>${labels.labelBmr}:</span>
            <strong>${Math.round(tmb)} ${unidad}</strong>
          </li>
          <li class="total-destacado">
            <span>${labels.labelTdee}:</span>
            <span class="calorias-tdee">${Math.round(mantenimiento)} ${unidad}</span>
          </li>
        </ul>

        <div class="calorias-objetivos">
          <p class="calorias-objetivos-titulo">${labels.labelObjective}</p>
          <div class="calorias-objetivo-row">
            <span>${labels.labelLose}:</span>
            <strong>${Math.round(perder)} ${unidad}</strong>
          </div>
          <div class="calorias-objetivo-row">
            <span>${labels.labelGain}:</span>
            <strong>${Math.round(ganar)} ${unidad}</strong>
          </div>
        </div>

        <button class="btn-copy" data-copy-text="${textoCopia}">
          ${labels.btnCopy || 'Copiar'}
        </button>

        <p class="calorias-footer">${labels.labelFooter}</p>
      </div>
    `;

    resultDiv.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = "✅";
        setTimeout(() => this.innerText = original, 2000);
      });
    });
  });
});
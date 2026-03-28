document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-calcular-agua');
  const resultDiv = document.querySelector('.result-hidratacion');

  if (!btn || !resultDiv) return;

  const labels = resultDiv.dataset;

  const calcularAgua = () => {
    const peso = parseFloat(document.getElementById('peso').value);
    const actividadMinutos = parseFloat(document.getElementById('actividad').value) || 0;

    if (!peso || peso < 20 || peso > 350) {
      resultDiv.innerHTML = "";
      return;
    }

    const totalMl = (peso * 35) + ((actividadMinutos / 60) * 700);
    const totalLitros = (totalMl / 1000).toFixed(2);
    const vasos = Math.round(totalMl / 250);

    const textoCopia = `${labels.labelGoal} ${totalLitros} ${labels.unitLiters}\n${labels.labelEquiv} ${vasos} ${labels.unitGlasses}`;

    resultDiv.innerHTML = `
      <div class="resumen-calculo">
        <ul>
          <li class="hidratacion-row-border">
            <span>${labels.labelGoal}</span>
            <strong>${totalLitros} ${labels.unitLiters}</strong>
          </li>
          <li class="hidratacion-row">
            <span>${labels.labelEquiv}</span>
            <strong>~${vasos} ${labels.unitGlasses}</strong>
          </li>
        </ul>
        <button class="btn-copy" data-copy-text="${textoCopia}">
          ${labels.btnCopy}
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

  btn.addEventListener('click', calcularAgua);
});
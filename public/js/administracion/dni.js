document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector('.documento');
  const btn = document.querySelector('.btn-dni');
  const resultDiv = document.querySelector('.result-dni');

  if (!btn || !resultDiv) return;

  const validar = () => {
    let value = input.value.toUpperCase().trim();
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";

    if (value.length < 2) {
      resultDiv.innerHTML = `<p class="result-error">Introduce un formato válido.</p>`;
      return;
    }

    let tempValue = value
      .replace('X', '0')
      .replace('Y', '1')
      .replace('Z', '2');

    const num = parseInt(tempValue.substring(0, tempValue.length - (isNaN(value.slice(-1)) ? 1 : 0)));
    const letraProporcionada = isNaN(value.slice(-1)) ? value.slice(-1) : null;

    if (isNaN(num)) {
      resultDiv.innerHTML = `<p class="result-error">Formato de número incorrecto.</p>`;
      return;
    }

    const letraCorrecta = letras.charAt(num % 23);

    if (!letraProporcionada) {
      resultDiv.innerHTML = `
        <div class="resumen-calculo">
          <p>La letra correspondiente es:</p>
          <p class="dni-letra">${letraCorrecta}</p>
          <p>Documento completo: <strong>${value}${letraCorrecta}</strong></p>
        </div>`;
    } else if (letraProporcionada === letraCorrecta) {
      resultDiv.innerHTML = `
        <div class="resumen-calculo dni-valido">
          <p class="dni-valido-texto">✓ Documento Válido</p>
          <p>La letra <strong>${letraProporcionada}</strong> es correcta para el número ${value.substring(0, value.length - 1)}.</p>
        </div>`;
    } else {
      resultDiv.innerHTML = `
        <div class="resumen-calculo dni-invalido">
          <p class="dni-invalido-texto">✗ Documento Inválido</p>
          <p>La letra <strong>${letraProporcionada}</strong> no es correcta.</p>
          <p>La letra correcta debería ser: <strong>${letraCorrecta}</strong></p>
        </div>`;
    }
  };

  btn.addEventListener('click', validar);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') validar();
  });
});
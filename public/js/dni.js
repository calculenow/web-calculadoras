document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector('.documento');
    const btn = document.querySelector('.btn-dni');
    const resultDiv = document.querySelector('.result-dni');

    if (btn) {
        btn.addEventListener('click', () => {
            let value = input.value.toUpperCase().trim();
            const letras = "TRWAGMYFPDXBNJZSQVHLCKE";

            if (value.length < 2) {
                resultDiv.innerHTML = '<p style="color:red;">Introduce un formato válido.</p>';
                return;
            }

            // Lógica para NIE (X, Y, Z)
            let tempValue = value;
            tempValue = tempValue.replace('X', '0').replace('Y', '1').replace('Z', '2');

            // Extraer el número y la letra proporcionada
            const num = parseInt(tempValue.substring(0, tempValue.length - (isNaN(value.slice(-1)) ? 1 : 0)));
            const letraProporcionada = isNaN(value.slice(-1)) ? value.slice(-1) : null;

            if (isNaN(num)) {
                resultDiv.innerHTML = '<p style="color:red;">Formato de número incorrecto.</p>';
                return;
            }

            // Calcular letra correcta
            const letraCorrecta = letras.charAt(num % 23);

            if (!letraProporcionada) {
                // Si el usuario no puso letra, se la damos
                resultDiv.innerHTML = `
                    <div class="resumen-calculo">
                        <p>La letra correspondiente es:</p>
                        <p class="total-destacado" style="font-size: 2rem;">${letraCorrecta}</p>
                        <p>Documento completo: <strong>${value}${letraCorrecta}</strong></p>
                    </div>`;
            } else if (letraProporcionada === letraCorrecta) {
                resultDiv.innerHTML = `
                    <div class="resumen-calculo" style="border-color: #22c55e;">
                        <p style="color: #16a34a; font-weight: bold;">✓ Documento Válido</p>
                        <p>La letra <strong>${letraProporcionada}</strong> es correcta para el número ${value.substring(0, value.length-1)}.</p>
                    </div>`;
            } else {
                resultDiv.innerHTML = `
                    <div class="resumen-calculo" style="border-color: #ef4444;">
                        <p style="color: #dc2626; font-weight: bold;">✗ Documento Inválido</p>
                        <p>La letra <strong>${letraProporcionada}</strong> no es correcta.</p>
                        <p>La letra correcta debería ser: <strong>${letraCorrecta}</strong></p>
                    </div>`;
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.btn-imc');
    const pesoInput = document.getElementById('peso');
    const alturaInput = document.getElementById('altura');

    // Función principal de cálculo
    const calcularIMC = () => {
        const resultadoDiv = document.querySelector('.result');
        const indicador = document.querySelector('.imc-indicator');

        let peso = parseFloat(pesoInput.value);
        let altura = parseFloat(alturaInput.value);

        // 1. Validación
        if (!peso || !altura) {
            resultadoDiv.innerHTML = "⚠️ Por favor, completa ambos campos.";
            return;
        }

        // 2. Autocorrección Metros/Cm
        if (altura < 3) altura = altura * 100;

        // 3. Validación de coherencia
        if (peso < 20 || peso > 300 || altura < 50 || altura > 270) {
            resultadoDiv.innerHTML = "⚠️ Los datos parecen incorrectos.";
            return;
        }

        // 4. Cálculo
        const alturaMetros = altura / 100;
        const imc = (peso / (alturaMetros * alturaMetros)).toFixed(1);

        // 5. Diagnóstico
        let mensaje = "";
        let categoriaIndex = 0;

        if (imc < 18.5) { mensaje = "Bajo peso"; categoriaIndex = 0; }
        else if (imc < 25) { mensaje = "Peso normal"; categoriaIndex = 1; }
        else if (imc < 30) { mensaje = "Sobrepeso"; categoriaIndex = 2; }
        else { mensaje = "Obesidad"; categoriaIndex = 3; }

        resultadoDiv.innerHTML = `Tu IMC es <strong>${imc}</strong> (${mensaje})`;

        // 6. Barra y Tabla
        let porcentaje = ((imc - 15) / (40 - 15)) * 100;
        porcentaje = Math.max(0, Math.min(100, porcentaje));
        indicador.style.left = `${porcentaje}%`;

        document.querySelectorAll('table tbody tr').forEach(row => row.classList.remove('highlight-active'));
        const filas = document.querySelectorAll('table tbody tr');
        if (filas[categoriaIndex]) filas[categoriaIndex].classList.add('highlight-active');
    };

    // EVENTO 1: Clic en el botón
    btn.addEventListener('click', calcularIMC);

    // EVENTO 2: Tecla Enter en los inputs
    [pesoInput, alturaInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calcularIMC();
            }
        });
    });
});
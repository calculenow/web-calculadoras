document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector('.btn-imc');
    const pesoInput = document.getElementById('peso');
    const alturaInput = document.getElementById('altura');
    const resultDiv = document.querySelector('.result-imc');
    const indicador = document.querySelector('.imc-indicator');

    if (!btn || !resultDiv) return;
    const labels = resultDiv.dataset;

    const calcularIMC = () => {
        let peso = parseFloat(pesoInput.value);
        let altura = parseFloat(alturaInput.value);

        if (!peso || !altura) {
            resultDiv.innerHTML = labels.msEmpty;
            return;
        }

        if (altura < 3) altura = altura * 100;

        if (peso < 20 || peso > 300 || altura < 50 || altura > 270) {
            resultDiv.innerHTML = labels.msError;
            return;
        }

        const alturaMetros = altura / 100;
        const imc = (peso / (alturaMetros * alturaMetros)).toFixed(1);

        let mensaje = "";
        let categoriaIndex = 0;

        if (imc < 18.5) { mensaje = labels.statusLow; categoriaIndex = 0; }
        else if (imc < 25) { mensaje = labels.statusNormal; categoriaIndex = 1; }
        else if (imc < 30) { mensaje = labels.statusOver; categoriaIndex = 2; }
        else { mensaje = labels.statusObese; categoriaIndex = 3; }

        // Renderizado del resultado + Botón de copiar pequeño y útil
        const textoResultado = `${labels.labelRes} ${imc} (${mensaje})`;
        
        resultDiv.innerHTML = `
            ${labels.labelRes} <strong>${imc}</strong> (${mensaje})
            <button class="minimal-copy" title="${labels.btnCopy}">
                📋
            </button>
            `;

        // Lógica de copiar (SOLO el texto del resultado)
        resultDiv.querySelector('.minimal-copy').addEventListener('click', function() {
            navigator.clipboard.writeText(textoResultado);
            const originalEmoji = this.innerText;
            this.innerText = "✅";
            setTimeout(() => this.innerText = originalEmoji, 2000);
        });

        // Barra e indicador
        let porcentaje = ((imc - 15) / (40 - 15)) * 100;
        porcentaje = Math.max(0, Math.min(100, porcentaje));
        if (indicador) indicador.style.left = `${porcentaje}%`;

        // Resaltado de tabla
        document.querySelectorAll('table tbody tr').forEach(row => row.classList.remove('highlight-active'));
        const filas = document.querySelectorAll('table tbody tr');
        if (filas[categoriaIndex]) filas[categoriaIndex].classList.add('highlight-active');
    };

    btn.addEventListener('click', calcularIMC);
    [pesoInput, alturaInput].forEach(input => {
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') calcularIMC(); });
    });
});
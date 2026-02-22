document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-calcular-agua');
    const resultDiv = document.querySelector('.result-hidratacion');
    
    if (!btn || !resultDiv) return;

    const labels = resultDiv.dataset;

    const calcularAgua = () => {
        const peso = parseFloat(document.getElementById('peso').value);
        const actividadMinutos = parseFloat(document.getElementById('actividad').value) || 0;

        // Validación: No mostramos nada si el peso no es lógico
        if (!peso || peso < 20 || peso > 350) {
            resultDiv.innerHTML = ""; 
            return;
        }

        // Cálculo: 35ml/kg + proporcional de ejercicio (700ml/hora)
        const totalMl = (peso * 35) + ((actividadMinutos / 60) * 700);
        const totalLitros = (totalMl / 1000).toFixed(2);
        const vasos = Math.round(totalMl / 250);

        // Renderizado (Estructura idéntica a Calorías)
        resultDiv.innerHTML = `
            <div class="resumen-calculo">
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed var(--border); padding-bottom: 5px;">
                        <span>${labels.labelGoal}</span> 
                        <strong>${totalLitros} ${labels.unitLiters}</strong>
                    </li>
                    <li style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span>${labels.labelEquiv}</span> 
                        <strong>~${vasos} ${labels.unitGlasses}</strong>
                    </li>
                </ul>
                <button class="btn-copy" style="width: 100%; padding: 10px; cursor: pointer; border: 1px solid var(--border); border-radius: 6px; background: var(--card-bg); color: var(--text-main); font-weight: bold;">
                    ${labels.btnCopy}
                </button>
            </div>
        `;

        // Lógica de copiar (Limpia: solo datos)
        resultDiv.querySelector('.btn-copy').addEventListener('click', function() {
            const textToCopy = `${labels.labelGoal} ${totalLitros} ${labels.unitLiters}\n${labels.labelEquiv} ${vasos} ${labels.unitGlasses}`;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.innerText;
                this.innerText = "✅";
                setTimeout(() => {
                    this.innerText = originalText;
                }, 2000);
            });
        });
    };

    // Solo se dispara al hacer clic
    btn.addEventListener('click', calcularAgua);
});
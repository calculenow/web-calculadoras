/**
 * CALCULADORA DE CONVERSIÓN DE UNIDADES
 * Incluye: Longitud, Peso, Volumen, Temperatura y función Copiar.
 */

document.addEventListener('DOMContentLoaded', () => {
    const categoriaSelect = document.getElementById('categoria');
    const desdeSelect = document.getElementById('desde');
    const haciaSelect = document.getElementById('hacia');
    const btnConvertir = document.getElementById('btn-convertir');
    const btnSwap = document.getElementById('btn-swap');

    // Diccionario de unidades y sus factores (respecto a una base)
    const unidades = {
        longitud: {
            "Metros (m)": 1,
            "Kilómetros (km)": 1000,
            "Centímetros (cm)": 0.01,
            "Milímetros (mm)": 0.001,
            "Pulgadas (in)": 0.0254,
            "Pies (ft)": 0.3048,
            "Yardas (yd)": 0.9144,
            "Millas (mi)": 1609.34
        },
        peso: {
            "Kilogramos (kg)": 1,
            "Gramos (g)": 0.001,
            "Libras (lb)": 0.453592,
            "Onzas (oz)": 0.0283495,
            "Toneladas (t)": 1000
        },
        volumen: {
            "Litros (l)": 1,
            "Mililitros (ml)": 0.001,
            "Galones (gal)": 3.78541,
            "Pintas (pt)": 0.473176
        },
        temperatura: {
            "Celsius (°C)": "C",
            "Fahrenheit (°F)": "F",
            "Kelvin (K)": "K"
        },
        datos: {
            "Bits (b)": 0.000000125,
            "Bytes (B)": 0.000001,
            "Kilobytes (KB)": 0.001,
            "Megabytes (MB)": 1,
            "Gigabytes (GB)": 1000,
            "Terabytes (TB)": 1000000
        }
    };

    function poblarSelects() {
        const cat = categoriaSelect.value;
        const opciones = Object.keys(unidades[cat]);
        
        desdeSelect.innerHTML = opciones.map(o => `<option value="${o}">${o}</option>`).join('');
        haciaSelect.innerHTML = opciones.map(o => `<option value="${o}">${o}</option>`).join('');
        
        if(haciaSelect.options[1]) haciaSelect.selectedIndex = 1;
    }

    function convertir() {
        const cat = categoriaSelect.value;
        const cant = parseFloat(document.getElementById('cantidad').value);
        const de = desdeSelect.value;
        const a = haciaSelect.value;
        const resultDiv = document.querySelector('.result-conversion');

        if (isNaN(cant)) return;

        let resultado;
        if (cat === 'temperatura') {
            resultado = convertirTemperatura(cant, de, a);
        } else {
            const factorDe = unidades[cat][de];
            const factorA = unidades[cat][a];
            resultado = (cant * factorDe) / factorA;
        }

        const resFormateado = resultado.toLocaleString(undefined, { maximumFractionDigits: 4 });
        const unidadA = a.split(' ')[0]; // Para mostrar solo "Centímetros" por ejemplo

        resultDiv.innerHTML = `
            <div class="resumen-calculo">
                <div class="resumen-flex" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                    <p style="font-size: 1.5rem; font-weight: bold; color: var(--primary); margin: 0;">
                        ${cant} ${de.split(' ')[0]} = ${resFormateado} ${unidadA}
                    </p>
                    <button class="btn-copy" onclick="copiarConversion('${resFormateado}', '${unidadA}')" title="Copiar resultado" style="background: var(--input-bg); border: 1px solid var(--border); border-radius: 8px; padding: 8px; cursor: pointer; font-size: 1.2rem;">
                        📋
                    </button>
                </div>
            </div>
        `;
    }

    function convertirTemperatura(v, de, a) {
        let c;
        if (de.includes("Celsius")) c = v;
        else if (de.includes("Fahrenheit")) c = (v - 32) * 5 / 9;
        else if (de.includes("Kelvin")) c = v - 273.15;

        if (a.includes("Celsius")) return c;
        if (a.includes("Fahrenheit")) return (c * 9 / 5) + 32;
        if (a.includes("Kelvin")) return c + 273.15;
    }

    // --- EVENTOS ---
    categoriaSelect.addEventListener('change', poblarSelects);
    btnConvertir.addEventListener('click', convertir);
    
    btnSwap.addEventListener('click', () => {
        const temp = desdeSelect.value;
        desdeSelect.value = haciaSelect.value;
        haciaSelect.value = temp;
        convertir();
    });

    poblarSelects();
});

/**
 * Función global para copiar el resultado con su unidad
 */
window.copiarConversion = function(valor, unidad) {
    const textoACopiar = `${valor} ${unidad}`;
    
    navigator.clipboard.writeText(textoACopiar).then(() => {
        const btn = document.querySelector('.btn-copy');
        const originalIcon = btn.innerHTML;
        
        btn.innerHTML = '✅';
        btn.style.borderColor = '#10b981';
        
        setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.style.borderColor = '';
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
};
/**
 * CALCULADORA DE CONVERSIÓN DE UNIDADES
 */

document.addEventListener('DOMContentLoaded', () => {
    const categoriaSelect = document.getElementById('categoria');
    const desdeSelect = document.getElementById('desde');
    const haciaSelect = document.getElementById('hacia');
    const btnConvertir = document.getElementById('btn-convertir');
    const btnSwap = document.getElementById('btn-swap');
    const resultDiv = document.querySelector('.result-conversion');

    const isEn = window.location.pathname.includes('/en/');
    const lang = isEn ? 'en' : 'es';

    // Obtenemos los textos desde el HTML (hidratación)
    const labels = resultDiv.dataset;

    const diccionario = {
        es: {
            categorias: {
                longitud: "Longitud (Metros, Pulgadas, Pies...)",
                peso: "Peso (Kilos, Libras, Onzas...)",
                temperatura: "Temperatura (Celsius, Fahrenheit...)",
                volumen: "Volumen (Litros, Galones...)",
                datos: "Datos (GB, MB, TB, Bytes...)"
            },
            unidades: {
                longitud: { m: "Metros (m)", km: "Kilómetros (km)", cm: "Centímetros (cm)", mm: "Milímetros (mm)", in: "Pulgadas (in)", ft: "Pies (ft)", yd: "Yardas (yd)", mi: "Millas (mi)" },
                peso: { kg: "Kilogramos (kg)", g: "Gramos (g)", lb: "Libras (lb)", oz: "Onzas (oz)", t: "Toneladas (t)" },
                volumen: { l: "Litros (l)", ml: "Mililitros (ml)", gal: "Galones (gal)", pt: "Pintas (pt)" },
                temperatura: { c: "Celsius (°C)", f: "Fahrenheit (°F)", k: "Kelvin (K)" },
                datos: { b: "Bits (b)", B: "Bytes (B)", KB: "Kilobytes (KB)", MB: "Megabytes (MB)", GB: "Gigabytes (GB)", TB: "Terabytes (TB)" }
            }
        },
        en: {
            categorias: {
                longitud: "Length (Meters, Inches, Feet...)",
                peso: "Weight (Kilos, Pounds, Ounces...)",
                temperatura: "Temperature (Celsius, Fahrenheit...)",
                volumen: "Volume (Liters, Gallons...)",
                datos: "Data (GB, MB, TB, Bytes...)"
            },
            unidades: {
                longitud: { m: "Meters (m)", km: "Kilometers (km)", cm: "Centimeters (cm)", mm: "Millimeters (mm)", in: "Inches (in)", ft: "Feet (ft)", yd: "Yards (yd)", mi: "Miles (mi)" },
                peso: { kg: "Kilograms (kg)", g: "Grams (g)", lb: "Pounds (lb)", oz: "Ounces (oz)", t: "Tons (t)" },
                temperatura: { c: "Celsius (°C)", f: "Fahrenheit (°F)", k: "Kelvin (K)" },
                volumen: { l: "Liters (l)", ml: "Milliliters (ml)", gal: "Gallons (gal)", pt: "Pints (pt)" },
                datos: { b: "Bits (b)", B: "Bytes (B)", KB: "Kilobytes (KB)", MB: "Megabytes (MB)", GB: "Gigabytes (GB)", TB: "Terabytes (TB)" }
            }
        }
    };

    const factores = {
        longitud: { m: 1, km: 1000, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.34 },
        peso: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495, t: 1000 },
        volumen: { l: 1, ml: 0.001, gal: 3.78541, pt: 0.473176 },
        datos: { b: 0.000000125, B: 0.000001, KB: 0.001, MB: 1, GB: 1000, TB: 1000000 }
    };

    function poblarSelectores() {
        const cat = categoriaSelect.value;
        Array.from(categoriaSelect.options).forEach(opt => {
            opt.text = diccionario[lang].categorias[opt.value];
        });
        const unidadesHtml = Object.entries(diccionario[lang].unidades[cat])
            .map(([val, texto]) => `<option value="${val}">${texto}</option>`)
            .join('');
        desdeSelect.innerHTML = unidadesHtml;
        haciaSelect.innerHTML = unidadesHtml;
        if(haciaSelect.options[1]) haciaSelect.selectedIndex = 1;
    }

    function convertir() {
        const cat = categoriaSelect.value;
        const cant = parseFloat(document.getElementById('cantidad').value);
        const de = desdeSelect.value;
        const a = haciaSelect.value;
        if (isNaN(cant)) return;

        let resultado;
        if (cat === 'temperatura') {
            let c = (de === 'c') ? cant : (de === 'f') ? (cant - 32) * 5/9 : cant - 273.15;
            resultado = (a === 'c') ? c : (a === 'f') ? (c * 9/5) + 32 : c + 273.15;
        } else {
            resultado = (cant * factores[cat][de]) / factores[cat][a];
        }

        const resF = resultado.toLocaleString(undefined, { maximumFractionDigits: 4 });
        const unidadTextoDe = diccionario[lang].unidades[cat][de].split(' (')[0];
        const unidadTextoA = diccionario[lang].unidades[cat][a].split(' (')[0];

        resultDiv.innerHTML = `
            <div class="resumen-calculo">
                <div class="resumen-flex" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                    <p style="font-size: 1.5rem; font-weight: bold; color: var(--primary); margin: 0;">
                        ${cant} ${unidadTextoDe} ${labels.msgEqual} ${resF} ${unidadTextoA}
                    </p>
                    <button 
                        class="btn-copy" 
                        onclick="copiarConversion('${resF}', '${unidadTextoA}')" 
                        data-btn-copy="${labels.btnCopy}" 
                        style="background: var(--input-bg); border: 1px solid var(--border); border-radius: 8px; padding: 8px; cursor: pointer; font-size: 1.2rem;"
                    >
                        📋
                    </button>
                </div>
            </div>
        `;
    }

    categoriaSelect.addEventListener('change', poblarSelectores);
    btnConvertir.addEventListener('click', convertir);
    btnSwap.addEventListener('click', () => {
        const temp = desdeSelect.value;
        desdeSelect.value = haciaSelect.value;
        haciaSelect.value = temp;
        if (resultDiv.innerHTML !== "") convertir();
    });
    poblarSelectores();
});

window.copiarConversion = function(valor, unidad) {
    const texto = `${valor} ${unidad}`;
    navigator.clipboard.writeText(texto).then(() => {
        const btn = document.querySelector('.btn-copy');
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '✅';
        setTimeout(() => btn.innerHTML = originalIcon, 2000);
    });
};
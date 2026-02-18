document.addEventListener("DOMContentLoaded", async () => {
    const btn = document.querySelector('.btn-divisas');
    const btnSwap = document.getElementById('btn-swap');
    const selectDesde = document.querySelector('.desde');
    const selectHacia = document.querySelector('.hacia');
    const resumenContenedor = document.getElementById('resumen-contenedor');
    
    const API_URL = "https://api.frankfurter.app";

    // Mapeo de siglas a nombres descriptivos
    const nombresMonedas = {
        "AUD": "Dólar Australiano", "BGN": "Lev Búlgaro", "BRL": "Real Brasileño",
        "CAD": "Dólar Canadiense", "CHF": "Franco Suizo", "CNY": "Yuan Chino",
        "CZK": "Corona Checa", "DKK": "Corona Danesa", "EUR": "Euro",
        "GBP": "Libra Esterlina", "HKD": "Dólar de Hong Kong", "HUF": "Forint Húngaro",
        "IDR": "Rupia Indonesia", "ILS": "Shekel Israelí", "INR": "Rupia India",
        "ISK": "Corona Islandesa", "JPY": "Yen Japonés", "KRW": "Won Surcoreano",
        "MXN": "Peso Mexicano", "MYR": "Ringgit Malayo", "NOK": "Corona Noruega",
        "NZD": "Dólar Neozelandés", "PHP": "Peso Filipino", "PLN": "Zloty Polaco",
        "RON": "Leu Rumano", "SEK": "Corona Sueca", "SGD": "Dólar Singapur",
        "THB": "Baht Tailandés", "TRY": "Lira Turca", "USD": "Dólar Estadounidense",
        "ZAR": "Rand Sudafricano"
    };

    async function inicializarApp() {
        const hoy = new Date().toLocaleDateString();
        let cache = JSON.parse(localStorage.getItem('divisas_global'));

        if (!cache || cache.fecha !== hoy) {
            try {
                const res = await fetch(`${API_URL}/latest?from=EUR`);
                const data = await res.json();
                data.rates["EUR"] = 1;
                cache = { fecha: hoy, rates: data.rates };
                localStorage.setItem('divisas_global', JSON.stringify(cache));
            } catch (e) {
                if (!cache) return;
            }
        }
        rellenarSelects(cache.rates);
    }

    function rellenarSelects(rates) {
        const siglas = Object.keys(rates).sort();
        const fragmento = document.createDocumentFragment();

        siglas.forEach(sigla => {
            const option = document.createElement('option');
            option.value = sigla;
            // Aquí es donde sucede la magia: Sigla + Nombre si existe
            const nombreCompleto = nombresMonedas[sigla] ? ` (${nombresMonedas[sigla]})` : "";
            option.textContent = `${sigla}${nombreCompleto}`;
            fragmento.appendChild(option);
        });

        selectDesde.appendChild(fragmento.cloneNode(true));
        selectHacia.appendChild(fragmento);

        selectDesde.value = "EUR";
        selectHacia.value = "USD";
    }

    btnSwap.addEventListener('click', () => {
        const temp = selectDesde.value;
        selectDesde.value = selectHacia.value;
        selectHacia.value = temp;
    });

    btn.addEventListener('click', () => {
        const cantidad = parseFloat(document.querySelector('.cantidad').value);
        const desde = selectDesde.value;
        const hacia = selectHacia.value;
        const cache = JSON.parse(localStorage.getItem('divisas_global'));

        if (!cache || isNaN(cantidad)) return;

        const tasas = cache.rates;
        const resultado = (cantidad / tasas[desde]) * tasas[hacia];
        const tasaIndividual = tasas[hacia] / tasas[desde];

        resumenContenedor.innerHTML = `
            <div class="resumen-calculo">
                <ul>
                    <li><span>Cambio:</span> <span>1 ${desde} = ${tasaIndividual.toFixed(4)} ${hacia}</span></li>
                    <li class="total-destacado"><span>Total:</span> <span>${resultado.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${hacia}</span></li>
                </ul>
            </div>
        `;
    });

    inicializarApp();
});
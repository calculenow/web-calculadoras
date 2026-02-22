document.addEventListener("DOMContentLoaded", async () => {
    const btn = document.querySelector('.btn-divisas');
    const btnSwap = document.getElementById('btn-swap');
    const selectDesde = document.querySelector('.desde');
    const selectHacia = document.querySelector('.hacia');
    const resumenContenedor = document.getElementById('resumen-contenedor');
    const resultDiv = document.querySelector('.result-divisas');
    const cantidadInput = document.querySelector('.cantidad');
    
    if (!resultDiv || !btn) return;

    const API_URL = "https://api.frankfurter.app/latest?from=EUR";
    const isEn = window.location.pathname.includes('/en/');
    const lang = isEn ? 'en' : 'es';
    
    // Leemos los datos del HTML
    const labels = resultDiv.dataset;

    const nombresMonedas = {
        es: { 
            "AUD": "Dólar Australiano", "BGN": "Lev Búlgaro", "BRL": "Real Brasileño", "CAD": "Dólar Canadiense", 
            "CHF": "Franco Suizo", "CNY": "Yuan Chino", "CZK": "Corona Checa", "DKK": "Corona Danesa", 
            "EUR": "Euro", "GBP": "Libra Esterlina", "HKD": "Dólar de Hong Kong", "HUF": "Forint Húngaro", 
            "IDR": "Rupia Indonesia", "ILS": "Shekel Israelí", "INR": "Rupia India", "ISK": "Corona Islandesa", 
            "JPY": "Yen Japonés", "KRW": "Won Surcoreano", "MXN": "Peso Mexicano", "MYR": "Ringgit Malayo", 
            "NOK": "Corona Noruega", "NZD": "Dólar Neozelandés", "PHP": "Peso Filipino", "PLN": "Zloty Polaco", 
            "RON": "Leu Rumano", "SEK": "Corona Sueca", "SGD": "Dólar Singapur", "THB": "Baht Tailandés", 
            "TRY": "Lira Turca", "USD": "Dólar Estadounidense", "ZAR": "Rand Sudafricano" 
        },
        en: { 
            "AUD": "Australian Dollar", "BGN": "Bulgarian Lev", "BRL": "Brazilian Real", "CAD": "Canadian Dollar", 
            "CHF": "Swiss Franc", "CNY": "Chinese Yuan", "CZK": "Czech Koruna", "DKK": "Danish Krone", 
            "EUR": "Euro", "GBP": "British Pound", "HKD": "Hong Kong Dollar", "HUF": "Hungarian Forint", 
            "IDR": "Indonesian Rupiah", "ILS": "Israeli Shekel", "INR": "Indian Rupee", "ISK": "Icelandic Króna", 
            "JPY": "Japanese Yen", "KRW": "South Korean Won", "MXN": "Mexican Peso", "MYR": "Malaysian Ringgit", 
            "NOK": "Norwegian Krone", "NZD": "New Zealand Dollar", "PHP": "Philippine Peso", "PLN": "Polish Zloty", 
            "RON": "Romanian Leu", "SEK": "Swedish Krona", "SGD": "Singapore Dollar", "THB": "Thai Baht", 
            "TRY": "Turkish Lira", "USD": "US Dollar", "ZAR": "South African Rand" 
        }
    };

    async function cargarTasas() {
        const hoy = new Date().toISOString().split('T')[0];
        let cache = JSON.parse(localStorage.getItem('divisas_cache'));

        // Si ya tenemos los datos de hoy en el navegador, los usamos
        if (cache && cache.fecha === hoy) {
            return cache.rates;
        }

        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            const rates = data.rates;
            rates["EUR"] = 1; // Añadimos la base que Frankfurter no incluye en rates

            localStorage.setItem('divisas_cache', JSON.stringify({ fecha: hoy, rates }));
            return rates;
        } catch (e) {
            console.error("Error cargando divisas:", e);
            return cache ? cache.rates : null;
        }
    }

    function rellenarSelects(rates) {
        if (!rates) return;

        const defaultFrom = labels.from || "EUR";
        const defaultTo = labels.to || "USD";

        const fragmento = document.createDocumentFragment();
        Object.keys(rates).sort().forEach(sigla => {
            const option = document.createElement('option');
            option.value = sigla;
            const nombre = nombresMonedas[lang][sigla] || sigla;
            option.textContent = `${sigla} (${nombre})`;
            fragmento.appendChild(option);
        });

        selectDesde.appendChild(fragmento.cloneNode(true));
        selectHacia.appendChild(fragmento);

        selectDesde.value = defaultFrom;
        selectHacia.value = defaultTo;
    }

    btn.addEventListener('click', () => {
        const cantidad = parseFloat(cantidadInput.value);
        const cache = JSON.parse(localStorage.getItem('divisas_cache'));

        if (!cache || isNaN(cantidad)) {
            resultDiv.textContent = labels.error;
            return;
        }

        const tasas = cache.rates;
        const desde = selectDesde.value;
        const hacia = selectHacia.value;

        const resultado = (cantidad / tasas[desde]) * tasas[hacia];
        const tasaIndiv = tasas[hacia] / tasas[desde];

        const resFinal = resultado.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        const textoCopia = `${cantidad} ${desde} = ${resFinal} ${hacia}`;

        resumenContenedor.innerHTML = `
            <div class="resumen-calculo">
                <p style="text-align:center; font-size: 0.9rem; opacity: 0.8; margin-bottom: 5px;">
                    1 ${desde} = ${tasaIndiv.toFixed(4)} ${hacia}
                </p>
                <p style="text-align:center; font-size: 1.6rem; font-weight: bold; color: var(--primary); margin-bottom: 15px;">
                    ${resFinal} ${hacia}
                </p>
                <button class="btn-copy" 
                        style="width: 100%; padding: 10px; cursor: pointer; border: 1px solid var(--border); border-radius: 6px; background: var(--card-bg); color: var(--text-main); font-weight: bold;">
                    ${labels.btnCopy}
                </button>
            </div>
        `;

        resumenContenedor.querySelector('.btn-copy').addEventListener('click', function() {
            navigator.clipboard.writeText(textoCopia).then(() => {
                const originalText = this.innerText;
                this.innerText = "✅";
                setTimeout(() => { this.innerText = originalText; }, 2000);
            });
        });
    });

    btnSwap.addEventListener('click', () => {
        const temp = selectDesde.value;
        selectDesde.value = selectHacia.value;
        selectHacia.value = temp;
    });

    // Inicialización
    const tasasActuales = await cargarTasas();
    rellenarSelects(tasasActuales);
});
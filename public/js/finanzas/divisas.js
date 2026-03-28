/**
 * CALCULADORA DE DIVISAS
 */

const isEn = window.location.pathname.includes('/en/');
const lang = isEn ? 'en' : 'es';

document.addEventListener("DOMContentLoaded", async () => {
  const btn = document.querySelector('.btn-divisas');
  const btnSwap = document.getElementById('btn-swap');
  const selectDesde = document.querySelector('.desde');
  const selectHacia = document.querySelector('.hacia');
  const resumenContenedor = document.getElementById('resumen-contenedor');
  const resultDiv = document.querySelector('.result-divisas');
  const cantidadInput = document.querySelector('.cantidad');
  const fechaEl = document.getElementById('fecha-actualizacion');

  if (!resultDiv || !btn) return;

  const API_URL = "https://api.frankfurter.app/latest?from=EUR";
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

    if (cache && cache.fecha === hoy) {
      actualizarFecha(cache.fecha);
      return cache.rates;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(API_URL, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await response.json();
      const rates = data.rates;
      rates["EUR"] = 1;

      localStorage.setItem('divisas_cache', JSON.stringify({ fecha: hoy, rates }));
      actualizarFecha(hoy);
      return rates;
    } catch (e) {
      console.error("Error cargando divisas:", e);
      if (cache) actualizarFecha(cache.fecha);
      return cache ? cache.rates : null;
    }
  }

  function actualizarFecha(fecha) {
    if (fechaEl) fechaEl.textContent = isEn
      ? `Exchange rates updated: ${fecha}`
      : `Tipos de cambio actualizados: ${fecha}`;
  }

  function rellenarSelects(rates) {
    if (!rates) return;

    const defaultFrom = labels.from || "EUR";
    const defaultTo = labels.to || "USD";

    const fragmento = document.createDocumentFragment();
    Object.keys(rates).sort().forEach(sigla => {
      const option = document.createElement('option');
      option.value = sigla;
      option.textContent = `${sigla} (${nombresMonedas[lang][sigla] || sigla})`;
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

    if (!cache || isNaN(cantidad) || cantidad <= 0) {
      resultDiv.textContent = labels.error;
      return;
    }

    const tasas = cache.rates;
    const desde = selectDesde.value;
    const hacia = selectHacia.value;

    const resultado = (cantidad / tasas[desde]) * tasas[hacia];
    const tasaIndiv = tasas[hacia] / tasas[desde];

    const resFinal = resultado.toLocaleString(isEn ? 'en-US' : 'es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const textoCopia = `${cantidad} ${desde} = ${resFinal} ${hacia}`;

    resumenContenedor.innerHTML = `
      <div class="resumen-calculo">
        <p class="divisas-tasa">1 ${desde} = ${tasaIndiv.toFixed(4)} ${hacia}</p>
        <p class="divisas-resultado">${resFinal} ${hacia}</p>
        <button class="btn-copy" data-copy-text="${textoCopia}">
          ${labels.btnCopy}
        </button>
      </div>
    `;

    resumenContenedor.querySelector('.btn-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = "✅";
        setTimeout(() => this.innerText = original, 2000);
      });
    });
  });

  btnSwap?.addEventListener('click', () => {
    const temp = selectDesde.value;
    selectDesde.value = selectHacia.value;
    selectHacia.value = temp;
  });

  const tasasActuales = await cargarTasas();
  rellenarSelects(tasasActuales);
});
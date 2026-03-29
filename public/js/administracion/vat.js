/**
 * vat.js
 * Validador de números VAT (IVA) europeos.
 * Valida el formato de cada país según las reglas oficiales de la UE.
 * Todos los textos visibles se leen desde data-* de div#vat-i18n (i18n via HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

  const i18n = document.getElementById('vat-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

  const btn       = document.getElementById('btn-validar');
  const input     = document.getElementById('vat-input');
  const resultDiv = document.getElementById('vat-result');

  // ── FORMATOS VAT POR PAÍS ──────────────────────────────────────────────────
  // Regex oficiales de formato según la Comisión Europea
  const vatFormats = {
    AT: { regex: /^ATU\d{8}$/,                      ejemplo: 'ATU12345678' },
    BE: { regex: /^BE[01]\d{9}$/,                   ejemplo: 'BE0123456789' },
    BG: { regex: /^BG\d{9,10}$/,                    ejemplo: 'BG123456789' },
    CY: { regex: /^CY\d{8}[A-Z]$/,                  ejemplo: 'CY12345678A' },
    CZ: { regex: /^CZ\d{8,10}$/,                    ejemplo: 'CZ12345678' },
    DE: { regex: /^DE\d{9}$/,                        ejemplo: 'DE123456789' },
    DK: { regex: /^DK\d{8}$/,                        ejemplo: 'DK12345678' },
    EE: { regex: /^EE\d{9}$/,                        ejemplo: 'EE123456789' },
    ES: { regex: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,       ejemplo: 'ESA12345678' },
    FI: { regex: /^FI\d{8}$/,                        ejemplo: 'FI12345678' },
    FR: { regex: /^FR[A-Z0-9]{2}\d{9}$/,             ejemplo: 'FRXX123456789' },
    GB: { regex: /^GB(\d{9}|\d{12}|GD\d{3}|HA\d{3})$/, ejemplo: 'GB123456789' },
    GR: { regex: /^EL\d{9}$/,                        ejemplo: 'EL123456789' },
    HR: { regex: /^HR\d{11}$/,                       ejemplo: 'HR12345678901' },
    HU: { regex: /^HU\d{8}$/,                        ejemplo: 'HU12345678' },
    IE: { regex: /^IE\d[A-Z0-9+*]\d{5}[A-Z]{1,2}$/, ejemplo: 'IE1A23456B' },
    IT: { regex: /^IT\d{11}$/,                       ejemplo: 'IT12345678901' },
    LT: { regex: /^LT(\d{9}|\d{12})$/,               ejemplo: 'LT123456789' },
    LU: { regex: /^LU\d{8}$/,                        ejemplo: 'LU12345678' },
    LV: { regex: /^LV\d{11}$/,                       ejemplo: 'LV12345678901' },
    MT: { regex: /^MT\d{8}$/,                        ejemplo: 'MT12345678' },
    NL: { regex: /^NL\d{9}B\d{2}$/,                  ejemplo: 'NL123456789B01' },
    PL: { regex: /^PL\d{10}$/,                       ejemplo: 'PL1234567890' },
    PT: { regex: /^PT\d{9}$/,                        ejemplo: 'PT123456789' },
    RO: { regex: /^RO\d{2,10}$/,                     ejemplo: 'RO12345678' },
    SE: { regex: /^SE\d{12}$/,                       ejemplo: 'SE123456789012' },
    SI: { regex: /^SI\d{8}$/,                        ejemplo: 'SI12345678' },
    SK: { regex: /^SK\d{10}$/,                       ejemplo: 'SK1234567890' },
  };

  function getNombrePais(code) {
    return d[`country${code}`] || `${d.labelUnknownCountry} (${code})`;
  }

  // ── VALIDAR ────────────────────────────────────────────────────────────────
  const validar = () => {
    const raw = input.value.replace(/[\s\.\-]/g, '').toUpperCase();

    if (!raw) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorEmpty}</p>`;
      return;
    }

    if (raw.length < 4) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorTooShort}</p>`;
      return;
    }

    // Detectar código de país — Grecia usa EL en VAT, no GR
    const prefijo = raw.slice(0, 2);
    const codigoPaisInterno = prefijo === 'EL' ? 'GR' : prefijo;

    const formatoPais = vatFormats[prefijo] || vatFormats[codigoPaisInterno];

    if (!formatoPais) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorCountry.replace('{code}', prefijo)}</p>`;
      return;
    }

    const nombrePais = getNombrePais(codigoPaisInterno);
    const esValido   = formatoPais.regex.test(raw);

    if (esValido) {
      resultDiv.innerHTML = `
        <div class="resumen-calculo result-valid">
          <p class="resumen-titulo">✅ ${d.labelValid}</p>
          <ul>
            <li><span>${d.labelVat}</span><span class="validator-code">${raw}</span></li>
            <li><span>${d.labelCountry}</span><span>${nombrePais} (${prefijo})</span></li>
            <li><span>${d.labelNumber}</span><span>${raw.slice(2)}</span></li>
          </ul>
          <button class="btn-copy" data-copy-text="${raw}">📋 ${d.btnCopy}</button>
        </div>
      `;
    } else {
      resultDiv.innerHTML = `
        <div class="resumen-calculo result-invalid">
          <p class="resumen-titulo">❌ ${d.labelInvalid}</p>
          <ul>
            <li><span>${d.labelVat}</span><span class="validator-code">${raw}</span></li>
            <li><span>${d.labelCountry}</span><span>${nombrePais}</span></li>
            <li><span>${d.labelExpectedFormat}</span><span>${formatoPais.ejemplo}</span></li>
            <li><span>${d.labelReason}</span><span>${d.labelWrongFormat}</span></li>
          </ul>
          <p class="validator-hint">${d.hintError}</p>
        </div>
      `;
    }

    resultDiv.querySelector('.btn-copy')?.addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.copyText).then(() => {
        const original = this.innerText;
        this.innerText = '✅';
        this.classList.add('copied');
        setTimeout(() => { this.innerText = original; this.classList.remove('copied'); }, 2000);
      });
    });
  };

  btn?.addEventListener('click', validar);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') validar(); });
  input?.addEventListener('input', () => { input.value = input.value.toUpperCase(); });

});
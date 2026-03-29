/**
 * iban.js
 * Validador de IBAN usando el algoritmo MOD-97 (ISO 13616).
 * Soporta IBANs de cualquier país.
 * Todos los textos visibles se leen desde data-* de div#iban-i18n (i18n via HTML).
 * Los nombres de país se leen desde data-country-{code} del mismo div.
 */

document.addEventListener('DOMContentLoaded', () => {

  const i18n = document.getElementById('iban-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

  const btn       = document.getElementById('btn-validar');
  const input     = document.getElementById('iban-input');
  const resultDiv = document.getElementById('validator-result');

  // ── DATOS DE PAÍSES ────────────────────────────────────────────────────────
  // Longitudes fijas por código de país (ISO 13616)
  const ibanLengths = {
    AD:24, AT:20, BE:16, BG:22, CH:21, CY:28, CZ:24, DE:22, DK:18,
    EE:20, ES:24, FI:18, FR:27, GB:22, GR:27, HR:21, HU:28, IE:22,
    IS:26, IT:27, LI:21, LT:20, LU:20, LV:21, MC:27, MT:31, NL:18,
    NO:15, PL:28, PT:25, RO:24, SE:24, SI:19, SK:24, SM:27, TR:26,
  };

  // Nombre del país — leído del HTML via data-country-{code}
  function getNombrePais(code) {
    return d[`country${code}`] || `${d.labelUnknownCountry} (${code})`;
  }

  // ── ALGORITMO MOD-97 ───────────────────────────────────────────────────────
  function validarMod97(iban) {
    const reordenado = iban.slice(4) + iban.slice(0, 4);
    const numerico = reordenado.split('').map(c => {
      const code = c.charCodeAt(0);
      return code >= 65 && code <= 90 ? code - 55 : c;
    }).join('');
    let resto = 0;
    for (let i = 0; i < numerico.length; i += 9) {
      resto = parseInt(resto + numerico.slice(i, i + 9)) % 97;
    }
    return resto === 1;
  }

  // ── FORMATEAR IBAN EN GRUPOS DE 4 ─────────────────────────────────────────
  function formatearIban(iban) {
    return iban.match(/.{1,4}/g)?.join(' ') || iban;
  }

  // ── VALIDAR ────────────────────────────────────────────────────────────────
  const validar = () => {
    const raw = input.value.replace(/\s/g, '').toUpperCase();

    if (!raw) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorEmpty}</p>`;
      return;
    }

    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(raw)) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorFormat}</p>`;
      return;
    }

    const codigoPais     = raw.slice(0, 2);
    const digitosControl = raw.slice(2, 4);
    const bban           = raw.slice(4);
    const longitudEsperada = ibanLengths[codigoPais];
    const nombrePais     = getNombrePais(codigoPais);

    if (longitudEsperada && raw.length !== longitudEsperada) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorLength.replace('{pais}', nombrePais).replace('{esperada}', longitudEsperada).replace('{actual}', raw.length)}</p>`;
      return;
    }

    const esValido       = validarMod97(raw);
    const ibanFormateado = formatearIban(raw);

    if (esValido) {
      resultDiv.innerHTML = `
        <div class="resumen-calculo result-valid">
          <p class="resumen-titulo">✅ ${d.labelValid}</p>
          <ul>
            <li><span>${d.labelFormatted}</span><span class="validator-code">${ibanFormateado}</span></li>
            <li><span>${d.labelCountry}</span><span>${nombrePais}</span></li>
            <li><span>${d.labelCheckDigits}</span><span>${digitosControl}</span></li>
            <li><span>${d.labelBban}</span><span>${bban}</span></li>
            <li><span>${d.labelLength}</span><span>${raw.length} ${d.labelChars}</span></li>
          </ul>
          <button class="btn-copy" data-copy-text="${ibanFormateado}">📋 ${d.btnCopy}</button>
        </div>
      `;
    } else {
      resultDiv.innerHTML = `
        <div class="resumen-calculo result-invalid">
          <p class="resumen-titulo">❌ ${d.labelInvalid}</p>
          <ul>
            <li><span>${d.labelFormatted}</span><span class="validator-code">${ibanFormateado}</span></li>
            <li><span>${d.labelCountry}</span><span>${nombrePais}</span></li>
            <li><span>${d.labelReason}</span><span>${d.labelWrongCheckDigits}</span></li>
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

  input?.addEventListener('input', () => {
    const raw       = input.value.replace(/\s/g, '').toUpperCase();
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    if (input.value !== formatted) input.value = formatted;
  });

});
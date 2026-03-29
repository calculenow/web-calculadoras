/**
 * bic.js
 * Validador de códigos BIC/SWIFT (ISO 9362).
 * Formato: 4 letras banco + 2 letras país + 2 alfanumérico localidad + 3 alfanumérico rama (opcional)
 * Todos los textos visibles se leen desde data-* de div#bic-i18n (i18n via HTML).
 */

document.addEventListener('DOMContentLoaded', () => {

  const i18n = document.getElementById('bic-i18n');
  if (!i18n) return;
  const d = i18n.dataset;

  const btn       = document.getElementById('btn-validar');
  const input     = document.getElementById('bic-input');
  const resultDiv = document.getElementById('bic-result');

  // Nombre del país desde data-country-{code}
  function getNombrePais(code) {
    return d[`country${code}`] || `${d.labelUnknownCountry} (${code})`;
  }

  // ── VALIDAR BIC ────────────────────────────────────────────────────────────
  const validar = () => {
    const raw = input.value.replace(/\s/g, '').toUpperCase();

    if (!raw) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorEmpty}</p>`;
      return;
    }

    // BIC: 8 u 11 caracteres
    if (raw.length !== 8 && raw.length !== 11) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorLength}</p>`;
      return;
    }

    // Formato: 4 letras + 2 letras + 2 alfanum + (3 alfanum opcional)
    if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(raw)) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ ${d.msErrorFormat}</p>`;
      return;
    }

    const codigoBanco    = raw.slice(0, 4);
    const codigoPais     = raw.slice(4, 6);
    const codigoLocal    = raw.slice(6, 8);
    const codigoRama     = raw.length === 11 ? raw.slice(8, 11) : null;
    const esPrimario     = codigoRama === 'XXX' || codigoRama === null;
    const nombrePais     = getNombrePais(codigoPais);

    resultDiv.innerHTML = `
      <div class="resumen-calculo result-valid">
        <p class="resumen-titulo">✅ ${d.labelValid}</p>
        <ul>
          <li><span>${d.labelBic}</span><span class="validator-code">${raw}</span></li>
          <li><span>${d.labelBankCode}</span><span>${codigoBanco}</span></li>
          <li><span>${d.labelCountry}</span><span>${nombrePais} (${codigoPais})</span></li>
          <li><span>${d.labelLocation}</span><span>${codigoLocal}</span></li>
          ${codigoRama ? `<li><span>${d.labelBranch}</span><span>${codigoRama}${esPrimario ? ` — ${d.labelPrimary}` : ''}</span></li>` : `<li><span>${d.labelBranch}</span><span>${d.labelPrimary}</span></li>`}
          <li><span>${d.labelLength}</span><span>${raw.length === 11 ? d.label11 : d.label8}</span></li>
        </ul>
        <button class="btn-copy" data-copy-text="${raw}">📋 ${d.btnCopy}</button>
      </div>
    `;

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
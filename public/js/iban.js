/**
 * iban.js
 * Validador de IBAN usando el algoritmo MOD-97 (ISO 13616).
 * Soporta IBANs de cualquier país.
 */

document.addEventListener('DOMContentLoaded', () => {

  const btn       = document.getElementById('btn-validar');
  const input     = document.getElementById('iban-input');
  const resultDiv = document.getElementById('iban-result');

  // ── DATOS DE PAÍSES ────────────────────────────────────────────────────────
  const paises = {
    AD: { nombre: 'Andorra',          len: 24 },
    AT: { nombre: 'Austria',          len: 20 },
    BE: { nombre: 'Bélgica',          len: 16 },
    BG: { nombre: 'Bulgaria',         len: 22 },
    CH: { nombre: 'Suiza',            len: 21 },
    CY: { nombre: 'Chipre',           len: 28 },
    CZ: { nombre: 'República Checa',  len: 24 },
    DE: { nombre: 'Alemania',         len: 22 },
    DK: { nombre: 'Dinamarca',        len: 18 },
    EE: { nombre: 'Estonia',          len: 20 },
    ES: { nombre: 'España',           len: 24 },
    FI: { nombre: 'Finlandia',        len: 18 },
    FR: { nombre: 'Francia',          len: 27 },
    GB: { nombre: 'Reino Unido',      len: 22 },
    GR: { nombre: 'Grecia',           len: 27 },
    HR: { nombre: 'Croacia',          len: 21 },
    HU: { nombre: 'Hungría',          len: 28 },
    IE: { nombre: 'Irlanda',          len: 22 },
    IS: { nombre: 'Islandia',         len: 26 },
    IT: { nombre: 'Italia',           len: 27 },
    LI: { nombre: 'Liechtenstein',    len: 21 },
    LT: { nombre: 'Lituania',         len: 20 },
    LU: { nombre: 'Luxemburgo',       len: 20 },
    LV: { nombre: 'Letonia',          len: 21 },
    MC: { nombre: 'Mónaco',           len: 27 },
    MT: { nombre: 'Malta',            len: 31 },
    NL: { nombre: 'Países Bajos',     len: 18 },
    NO: { nombre: 'Noruega',          len: 15 },
    PL: { nombre: 'Polonia',          len: 28 },
    PT: { nombre: 'Portugal',         len: 25 },
    RO: { nombre: 'Rumanía',          len: 24 },
    SE: { nombre: 'Suecia',           len: 24 },
    SI: { nombre: 'Eslovenia',        len: 19 },
    SK: { nombre: 'Eslovaquia',       len: 24 },
    SM: { nombre: 'San Marino',       len: 27 },
    TR: { nombre: 'Turquía',          len: 26 },
  };

  // ── ALGORITMO MOD-97 ───────────────────────────────────────────────────────
  function validarMod97(iban) {
    // Mover los 4 primeros caracteres al final
    const reordenado = iban.slice(4) + iban.slice(0, 4);
    // Convertir letras a números (A=10, B=11, ..., Z=35)
    const numerico = reordenado.split('').map(c => {
      const code = c.charCodeAt(0);
      return code >= 65 && code <= 90 ? code - 55 : c;
    }).join('');
    // Calcular MOD-97 en bloques para evitar overflow
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
    const raw  = input.value.replace(/\s/g, '').toUpperCase();

    if (!raw) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce un número IBAN.</p>';
      return;
    }

    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(raw)) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Formato incorrecto. El IBAN debe empezar por dos letras de país seguidas de dos dígitos.</p>';
      return;
    }

    const codigoPais = raw.slice(0, 2);
    const digitosControl = raw.slice(2, 4);
    const bban = raw.slice(4);
    const pais = paises[codigoPais];

    // Verificar longitud si conocemos el país
    if (pais && raw.length !== pais.len) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ Un IBAN de ${pais.nombre} debe tener ${pais.len} caracteres. Este tiene ${raw.length}.</p>`;
      return;
    }

    const esValido = validarMod97(raw);
    const ibanFormateado = formatearIban(raw);
    const nombrePais = pais ? pais.nombre : `País desconocido (${codigoPais})`;

    if (esValido) {
      resultDiv.innerHTML = `
        <div class="resumen-calculo iban-valido">
          <p class="resumen-titulo">✅ IBAN válido</p>
          <ul>
            <li><span>IBAN formateado</span><span class="iban-formateado">${ibanFormateado}</span></li>
            <li><span>País</span><span>${nombrePais}</span></li>
            <li><span>Dígitos de control</span><span>${digitosControl}</span></li>
            <li><span>BBAN (cuenta nacional)</span><span>${bban}</span></li>
            <li><span>Longitud</span><span>${raw.length} caracteres</span></li>
          </ul>
          <button class="btn-copy" data-copy-text="${ibanFormateado}">📋 Copiar IBAN</button>
        </div>
      `;
    } else {
      resultDiv.innerHTML = `
        <div class="resumen-calculo iban-invalido">
          <p class="resumen-titulo">❌ IBAN no válido</p>
          <ul>
            <li><span>IBAN introducido</span><span class="iban-formateado">${ibanFormateado}</span></li>
            <li><span>País detectado</span><span>${nombrePais}</span></li>
            <li><span>Motivo</span><span>Los dígitos de control no son correctos</span></li>
          </ul>
          <p class="iban-error-hint">Comprueba que has copiado el IBAN correctamente. Un solo dígito incorrecto invalida el código de control.</p>
        </div>
      `;
    }

    // Botón copiar solo si es válido
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

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') validar();
  });

  // Autoformatear con espacios mientras escribe
  input?.addEventListener('input', () => {
    const cursor = input.selectionStart;
    const raw    = input.value.replace(/\s/g, '').toUpperCase();
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    if (input.value !== formatted) {
      input.value = formatted;
    }
  });

});
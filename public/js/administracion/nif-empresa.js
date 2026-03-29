/**
 * nif-empresa.js
 * Validador de NIF de empresa español (antiguo CIF).
 * Algoritmo oficial de dígito de control según el RD 1065/2007.
 */

document.addEventListener('DOMContentLoaded', () => {

  const btn       = document.getElementById('btn-validar');
  const input     = document.getElementById('nif-input');
  const resultDiv = document.getElementById('nif-result');

  // ── TIPOS DE SOCIEDAD ──────────────────────────────────────────────────────
  const tiposSociedad = {
    A: 'Sociedad Anónima (S.A.)',
    B: 'Sociedad de Responsabilidad Limitada (S.L.)',
    C: 'Sociedad Colectiva',
    D: 'Sociedad Comanditaria',
    E: 'Comunidad de Bienes',
    F: 'Sociedad Cooperativa',
    G: 'Asociación o Fundación',
    H: 'Comunidad de Propietarios',
    J: 'Sociedad Civil',
    N: 'Entidad extranjera',
    P: 'Corporación Local',
    Q: 'Organismo público',
    R: 'Congregación o institución religiosa',
    S: 'Órgano de la Administración del Estado',
    U: 'Unión Temporal de Empresas (UTE)',
    V: 'Fondo de pensiones u otras entidades',
    W: 'Establecimiento permanente de entidad no residente',
  };

  // Letras cuyo control es siempre letra
  const controLetra  = ['P', 'Q', 'R', 'S', 'W'];
  // Letras cuyo control es siempre número
  const controNumero = ['A', 'B', 'E', 'H'];
  // Tabla de letras de control
  const letrasControl = 'JABCDEFGHI';

  // ── ALGORITMO DE CONTROL ───────────────────────────────────────────────────
  function calcularControl(digitos) {
    let sumaPares   = 0;
    let sumaImpares = 0;

    for (let i = 0; i < 7; i++) {
      const d = parseInt(digitos[i]);
      if ((i + 1) % 2 === 0) {
        sumaPares += d;
      } else {
        const doble = d * 2;
        sumaImpares += doble > 9 ? doble - 9 : doble;
      }
    }

    const sumaTotal = sumaPares + sumaImpares;
    const unidades  = sumaTotal % 10;
    const control   = unidades === 0 ? 0 : 10 - unidades;

    return {
      numero: control,
      letra:  letrasControl[control],
    };
  }

  // ── VALIDAR ────────────────────────────────────────────────────────────────
  const validar = () => {
    const raw = input.value.replace(/[\s\-]/g, '').toUpperCase();

    if (!raw) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Introduce un NIF de empresa.</p>';
      return;
    }

    if (raw.length !== 9) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ El NIF debe tener exactamente 9 caracteres. Este tiene ${raw.length}.</p>`;
      return;
    }

    if (!/^[A-Z]\d{7}[A-Z0-9]$/.test(raw)) {
      resultDiv.innerHTML = '<p class="error-msg">⚠️ Formato incorrecto. El NIF debe tener 1 letra + 7 dígitos + 1 carácter de control.</p>';
      return;
    }

    const letraInicial        = raw[0];
    const digitos             = raw.slice(1, 8);
    const controlIntroducido  = raw[8];

    if (!tiposSociedad[letraInicial]) {
      resultDiv.innerHTML = `<p class="error-msg">⚠️ La letra "${letraInicial}" no corresponde a ningún tipo de sociedad válido.</p>`;
      return;
    }

    const tipoSociedad      = tiposSociedad[letraInicial];
    const { numero, letra } = calcularControl(digitos);

    let controlEsperado;
    let esValido;

    if (controLetra.includes(letraInicial)) {
      controlEsperado = letra;
      esValido = controlIntroducido === letra;
    } else if (controNumero.includes(letraInicial)) {
      controlEsperado = String(numero);
      esValido = controlIntroducido === String(numero);
    } else {
      esValido = controlIntroducido === letra || controlIntroducido === String(numero);
      controlEsperado = `${letra} o ${numero}`;
    }

    if (esValido) {
      resultDiv.innerHTML = `
        <div class="resumen-calculo result-valid">
          <p class="resumen-titulo">✅ NIF válido</p>
          <ul>
            <li><span>NIF</span><span class="validator-code">${raw}</span></li>
            <li><span>Tipo de sociedad</span><span>${tipoSociedad}</span></li>
            <li><span>Dígitos centrales</span><span>${digitos}</span></li>
            <li><span>Carácter de control</span><span>${controlIntroducido} ✓</span></li>
          </ul>
          <button class="btn-copy" data-copy-text="${raw}">📋 Copiar NIF</button>
        </div>
      `;
    } else {
      resultDiv.innerHTML = `
        <div class="resumen-calculo result-invalid">
          <p class="resumen-titulo">❌ NIF no válido</p>
          <ul>
            <li><span>NIF introducido</span><span class="validator-code">${raw}</span></li>
            <li><span>Tipo de sociedad</span><span>${tipoSociedad}</span></li>
            <li><span>Control introducido</span><span>${controlIntroducido}</span></li>
            <li><span>Control esperado</span><span>${controlEsperado}</span></li>
          </ul>
          <p class="validator-hint">El carácter de control no coincide. Comprueba que el NIF está escrito correctamente.</p>
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

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') validar();
  });

  // Forzar mayúsculas sin manipular el cursor (evita bugs)
  input?.addEventListener('blur', () => {
    input.value = input.value.toUpperCase();
  });

});
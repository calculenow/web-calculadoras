export default async (request, context) => {
  const response = await context.next();
  const html = await response.text();
  
  const navHTML = `
        <button class="menu-toggle">Menu</button>
        
        <nav class="main-nav">
        <div class="search-box">
            <input type="text" 
                   id="calc-search" 
                   placeholder="Buscar..." 
                   autocomplete="off" 
                   class="search-input">
            <ul id="search-results" class="search-dropdown"></ul>
        </div>
            <a href="/">Inicio</a>
            <div class="dropdown">
                <button class="dropbtn" aria-haspopup="true">Herramientas ▼</button>
                <div class="dropdown-content">
                    <a href="/calculadora-porcentajes">📊 Porcentajes</a>
                    <a href="/calculadora-descuentos">🏷️ Descuentos</a>
                    <a href="/calculadora-propinas">☕ Propinas</a>
                    <a href="/calculadora-iva">💶 IVA</a>
                    <a href="/calculadora-prestamos">🏦 Préstamos e Hipotecas</a>
                    <a href="/calculadora-divisas">💱 Cambio de Divisas</a>
                    <a href="/calculadora-interes-compuesto">📈 Interés Compuesto</a>
                    <a href="/calculadora-imc">⚖️ IMC</a>
                    <a href="/calculadora-calorias">🔥 Calorías (TMB)</a>
                    <a href="/calculadora-hidratacion">💧 Hidratación Diaria</a>
                    <a href="/validador-dni">🪪 Validador DNI/NIE</a>
                    <a href="/calculadora-conversion">📐 Conversor de Unidades</a>
                </div>
            </div>
            <a href="/contacto">Contacto</a>
            <button class="toggle-dark-inline" id="theme-toggle" aria-label="Cambiar modo de color">
                🌙 Modo Oscuro
            </button>
        </nav>
    `;

  // IMPORTANTE: Aquí decimos que busque el comentario // y lo cambie por la variable navHTML
  const nuevoHtml = html.replace(/<header>([\s\S]*?)<\/header>/i, `<header>${navHTML}</header>`);
  return new Response(nuevoHtml, response);
};

export const config = { path: "/*" };
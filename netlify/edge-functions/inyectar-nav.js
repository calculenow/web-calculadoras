export default async (request, context) => {
  const response = await context.next();
  const html = await response.text();
  
  const navHTML = `
        <button class="menu-toggle">Menu</button>
        
        <nav class="main-nav">
            <button class="menu-close-btn">✕ Cerrar</button>
            
            <div class="nav-center-group">
                <div class="nav-links">
                    <a href="/">Inicio</a>
                    <div class="dropdown">
                        <button class="dropbtn">Herramientas ▼</button>
                        <div class="dropdown-content">
                            <div class="dropdown-column">
                                <h3>Finanzas</h3>
                                <ul>
                        <li><a href="/calculadora-iva">💶 IVA</a></li>
                        <li><a href="/calculadora-descuentos">🏷️ Descuentos</a></li>
                        <li><a href="/calculadora-propinas">☕ Propinas</a></li>
                        <li><a href="/calculadora-prestamos">🏦 Préstamos</a></li>
                        <li><a href="/calculadora-divisas">💱 Divisas</a></li>
                        <li><a href="/calculadora-interes-compuesto">📈 Interés</a></li>
                    </ul>
                            </div>
                            <div class="dropdown-column">
                                <h3>Salud y Mates</h3>
                                <ul>
                        <li><a href="/calculadora-imc">⚖️ IMC</a></li>
                        <li><a href="/calculadora-calorias">🔥 Calorías (TMB)</a></li>
                        <li><a href="/calculadora-hidratacion">💧 Hidratación</a></li>
                        <li><a href="/calculadora-porcentajes">📊 Porcentajes</a></li>
                    </ul>
                            </div>
                            <div class="dropdown-column">
                                <h3>Administración</h3>
                                <ul><li><a href="/validador-dni">🪪 DNI</a></li></ul>
                            </div>
                            <div class="dropdown-column">
                                <h3>Utilidades</h3>
                                <ul><li><a href="/calculadora-conversion">📐 Conversor</a></li></ul>
                            </div>
                        </div>
                    </div>
                    <a href="/contacto">Contacto</a>
                </div>

                <div class="search-box">
                    <input type="text" id="calc-search" placeholder="Buscar..." autocomplete="off" class="search-input">
                    <ul id="search-results" class="search-dropdown"></ul>
                </div>
            </div>

            <button class="toggle-dark-inline" id="theme-toggle">☀️</button>
        </nav>
    `;

  // IMPORTANTE: Aquí decimos que busque el comentario // y lo cambie por la variable navHTML
  const nuevoHtml = html.replace(/<header>([\s\S]*?)<\/header>/i, `<header>${navHTML}</header>`);
  return new Response(nuevoHtml, response);
};

export const config = { path: "/*" };
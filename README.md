# Calculenow — Guía de desarrollo

Documentación interna para mantener y escalar el proyecto.

---

## Índice

1. [Estructura del proyecto](#estructura-del-proyecto)
2. [Añadir una calculadora nueva](#añadir-una-calculadora-nueva)
3. [Añadir una categoría nueva en el nav](#añadir-una-categoría-nueva-en-el-nav)
4. [Arquitectura del nav (cómo funciona)](#arquitectura-del-nav)
5. [Arquitectura CSS (ITCSS)](#arquitectura-css-itcss)
6. [Checklist de SEO por página](#checklist-de-seo-por-página)
7. [Despliegue](#despliegue)

---

## Estructura del proyecto

```
calculenow/
├── public/
│   ├── es/                        ← Páginas en español
│   ├── en/                        ← Páginas en inglés
│   ├── js/
│   │   ├── layout.js              ← Nav, modo oscuro, tabs, acordeón
│   │   ├── core.js                ← Lógica común (adblock, etc.)
│   │   ├── buscador.js            ← Buscador del nav
│   │   └── [calculadora].js      ← JS específico de cada calculadora
│   ├── css/
│   │   └── styles.css             ← CSS compilado (NO editar directamente)
│   ├── _redirects                 ← Redirecciones de Netlify
│   └── sitemap.xml
├── sass/
│   ├── main.scss                  ← Punto de entrada; importa todo
│   ├── 1-settings/                ← Variables y colores
│   ├── 6-components/
│   │   ├── _dropdown.scss         ← Nav desktop (tabs) y móvil (acordeón)
│   │   └── _[calculadora].scss   ← Estilos propios de cada calculadora
│   └── ...
├── netlify/
│   └── edge-functions/
│       ├── inyectar-nav.js        ← Inyecta el nav/footer en runtime
│       └── data/
│           └── translations.js   ← ⭐ FUENTE DE VERDAD del nav
└── netlify.toml
```

---

## Añadir una calculadora nueva

Son **5 pasos**. Todos son necesarios para que la calculadora aparezca bien en el nav, el buscador y el sitemap.

### Paso 1 — Crear el HTML

Copia una página existente como plantilla (ej: `es/calculadora-descuentos.html`) y modifica:

- `<title>`, `<meta name="description">`, `<link rel="canonical">`
- `hreflang` ES y EN apuntando a las URLs correctas
- `og:title`, `og:description`, `og:url`
- Schema `WebApplication` con el nombre y descripción corrects
- Schema `FAQPage` si tienes preguntas frecuentes
- El contenido `<main>` con el formulario y la lógica HTML

**Reglas de naming:**

| Idioma | URL de página | Archivo |
|--------|--------------|---------|
| ES | `/es/calculadora-[nombre]` | `public/es/calculadora-[nombre].html` |
| EN | `/en/[name]-calculator` | `public/en/[name]-calculator.html` |

### Paso 2 — Crear el JS

Crea `public/js/[nombre].js`. Sigue el patrón de los existentes:

```js
// [nombre].js
const isEn = window.location.pathname.startsWith('/en');

document.addEventListener('DOMContentLoaded', () => {
  // tu lógica aquí
  // usa clases CSS para mensajes de error/éxito (evita estilos inline)
});
```

Carga el script en el HTML con `defer`:
```html
<script src="/js/[nombre].js" defer></script>
```

### Paso 3 — Crear el SCSS (si necesitas estilos propios)

Crea `sass/6-components/_[nombre].scss` y añade el import en `sass/main.scss`:

```scss
// En main.scss, dentro del bloque "Calculadoras con estilos propios":
@import '6-components/[nombre]';
```

Luego compila:
```bash
sass sass/main.scss public/css/styles.css --style compressed
```

### Paso 4 — Registrar en el nav (`translations.js`)

Abre `netlify/edge-functions/data/translations.js` y añade la entrada en la categoría correcta, **en ambos idiomas**:

```js
// En es > links > [categoria]:
{ id: "nuevo", url: "/es/calculadora-nuevo", name: "🔢 Nuevo" },

// En en > links > [categoria]:
{ id: "nuevo", url: "/en/new-calculator", name: "🔢 New" },
```

Si la versión EN aún no existe, puedes omitirla del array EN por ahora. El nav solo muestra lo que tiene URL real.

### Paso 5 — Registrar en el buscador (`buscador.js`)

Abre `public/js/buscador.js` y añade la entrada en `db.es` y `db.en`:

```js
// En db.es:
{ nombre: "Nuevo", url: "/es/calculadora-nuevo", tags: ["etiqueta1", "etiqueta2"] },

// En db.en:
{ nombre: "New", url: "/en/new-calculator", tags: ["tag1", "tag2"] },
```

### Paso 6 — Añadir la redirección (`_redirects`)

```
/es/calculadora-nuevo    /es/calculadora-nuevo.html    200
/en/new-calculator       /en/new-calculator.html       200
```

### Paso 7 — Actualizar el sitemap (`sitemap.xml`)

Añade el bloque para ES y EN:

```xml
<url>
  <loc>https://calculenow.com/es/calculadora-nuevo</loc>
  <xhtml:link rel="alternate" hreflang="es" href="https://calculenow.com/es/calculadora-nuevo"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://calculenow.com/en/new-calculator"/>
  <lastmod>YYYY-MM-DD</lastmod>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://calculenow.com/en/new-calculator</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://calculenow.com/en/new-calculator"/>
  <xhtml:link rel="alternate" hreflang="es" href="https://calculenow.com/es/calculadora-nuevo"/>
  <lastmod>YYYY-MM-DD</lastmod>
  <priority>0.8</priority>
</url>
```

---

## Añadir una categoría nueva en el nav

El nav se genera automáticamente desde `translations.js`. Solo hay que tocar ese archivo.

### 1. Añadir la categoría en `translations.js`

```js
// En es > categories:
nuevaCat: { label: "Nueva categoría", icon: "🆕" },

// En es > links:
nuevaCat: [
  { id: "herramienta1", url: "/es/herramienta-1", name: "🔧 Herramienta 1" },
],
```

Repite lo mismo en `en > categories` y `en > links`.

### 2. ¿Qué pasa si una categoría solo existe en ES?

No pasa nada. En EN simplemente no la incluyas en `categories` ni en `links`. El nav en inglés no la mostrará.

### 3. El orden de las tabs

El orden de las tabs en el nav sigue el orden de las claves en `categories`. Si quieres reordenar, basta con reordenar el objeto.

---

## Arquitectura del nav

El nav funciona en dos capas:

**En servidor (Edge Function):** `inyectar-nav.js` lee `translations.js` y genera el HTML del nav en runtime para cada petición. Esto significa:
- No hay HTML del nav en los archivos `.html` — está en el `<header>` vacío.
- Cualquier cambio en `translations.js` se refleja en todas las páginas automáticamente.

**En cliente:** `layout.js` añade la interactividad:
- **Desktop (≥993px):** tabs horizontales. Clicar una tab activa el panel correspondiente mediante `data-tab` / `data-cat`.
- **Móvil (<993px):** acordeón. Clicar el `h3` de una categoría despliega sus links. Solo una categoría abierta a la vez.

El mismo HTML sirve para los dos comportamientos — el CSS oculta las tabs en móvil y el JS detecta `isDesktop()` para saber qué lógica aplicar.

---

## Arquitectura CSS (ITCSS)

```
sass/
├── 1-settings/     Variables CSS y colores (claro/oscuro)
├── 2-tools/        Mixins y animaciones (sin output CSS)
├── 3-generic/      Reset universal
├── 4-elements/     Estilos base HTML (body, a, header…)
├── 5-objects/      Layout agnóstico (grid)
├── 6-components/   Componentes UI — uno por archivo
└── 7-trumps/       Responsive y utilidades (mayor especificidad)
```

**Reglas:**
- Nunca editar `public/css/styles.css` directamente — se genera al compilar.
- Usar variables CSS (`var(--primary)`, `var(--border)`…) en vez de colores hardcodeados.
- Prohibido `!important` salvo casos absolutamente justificados.
- Un archivo SCSS por calculadora que tenga estilos propios.

**Compilar:**
```bash
sass sass/main.scss public/css/styles.css --style compressed
```

O en modo watch durante desarrollo:
```bash
sass --watch sass/main.scss:public/css/styles.css --style compressed
```

---

## Checklist de SEO por página

Cada página nueva debe tener:

- [ ] `<title>` único y descriptivo
- [ ] `<meta name="description">` entre 140-160 caracteres
- [ ] `<link rel="canonical">` con la URL absoluta correcta (sin `.html`)
- [ ] `hreflang` ES, EN y `x-default` (apuntando a `/es/`)
- [ ] `og:title`, `og:description`, `og:url`, `og:image`
- [ ] `twitter:card`, `twitter:title`, `twitter:description`
- [ ] `<meta name="theme-color">`
- [ ] Schema `WebApplication` (tipo de schema para calculadoras)
- [ ] Schema `FAQPage` si tiene preguntas frecuentes
- [ ] `noindex` solo en páginas legales y de contacto
- [ ] Script de tema oscuro inline antes de cualquier CSS (evita parpadeo)
- [ ] Scripts con `defer`
- [ ] Entrada en `sitemap.xml`
- [ ] Entrada en `_redirects`

---

## Despliegue

El proyecto se despliega en Netlify automáticamente al hacer push a `main`.

- Las Edge Functions se despliegan desde `netlify/edge-functions/`.
- El CSS **debe compilarse antes del commit** — Netlify no ejecuta Sass.
- Tras añadir páginas nuevas, notificar a Search Console vía "Solicitar indexación".

### Variables de entorno (Netlify)

No hay variables secretas actualmente. Si se añaden APIs con clave, configurarlas en el panel de Netlify y nunca commitearlas al repo.
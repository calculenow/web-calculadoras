#!/usr/bin/env node
/**
 * check-urls.mjs
 * Dos modos:
 *   1. LOCAL  — revisa todos los HTML del repo y comprueba que los links internos,
 *               hreflang y URLs de translations.js existen como archivo en /public.
 *   2. REMOTE — descarga el sitemap.xml de producción y comprueba que todas las
 *               URLs devuelven 200.
 *
 * Uso:
 *   node check-urls.mjs          → modo local + remote
 *   node check-urls.mjs --local  → solo local
 *   node check-urls.mjs --remote → solo remote
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve, join, extname } from 'path';

// ── CONFIG ─────────────────────────────────────────────────────────────────────
const BASE_URL    = 'https://calculenow.com';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const PUBLIC_DIR  = resolve('./public');
const CONCURRENCY = 5;
const TIMEOUT_MS  = 10000;

const args       = process.argv.slice(2);
const MODE_LOCAL  = args.includes('--local')  || !args.includes('--remote');
const MODE_REMOTE = args.includes('--remote') || !args.includes('--local');

// ── COLORES ────────────────────────────────────────────────────────────────────
const c = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
};

// ── HELPERS ────────────────────────────────────────────────────────────────────
function getAllFiles(dir, ext, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      getAllFiles(full, ext, files);
    } else if (full.endsWith(ext)) {
      files.push(full);
    }
  }
  return files;
}

// Convierte una ruta URL interna a ruta de archivo en /public
function urlToFilePath(url) {
  // Quitar query string y hash
  const clean = url.split('?')[0].split('#')[0];
  // Si termina en / buscar index.html
  if (clean.endsWith('/')) return join(PUBLIC_DIR, clean, 'index.html');
  // Si no tiene extensión asumir .html
  if (!extname(clean)) return join(PUBLIC_DIR, clean + '.html');
  return join(PUBLIC_DIR, clean);
}

function isInternal(href) {
  if (!href) return false;
  if (href.startsWith('http') || href.startsWith('//')) return false;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  if (href.startsWith('#')) return false;
  return true;
}

// ── MODO LOCAL ─────────────────────────────────────────────────────────────────
async function checkLocal() {
  console.log(c.bold('\n📁 MODO LOCAL — revisando links en HTML y translations.js'));
  console.log(c.dim('─'.repeat(60)));

  if (!existsSync(PUBLIC_DIR)) {
    console.log(c.red(`  No se encontró el directorio: ${PUBLIC_DIR}`));
    console.log(c.dim('  Asegúrate de ejecutar el script desde la raíz del repo.\n'));
    return { errors: [] };
  }

  const htmlFiles = getAllFiles(PUBLIC_DIR, '.html');
  console.log(c.dim(`  HTML encontrados: ${htmlFiles.length}`));

  const errors  = [];
  const checked = new Set();

  // ── 1. Links en HTML (<a href>, <link href>) ──────────────────────────────
  const hrefRegex  = /href=["']([^"']+)["']/g;

  for (const file of htmlFiles) {
    const content  = readFileSync(file, 'utf-8');
    const relative = file.replace(PUBLIC_DIR, '');
    let match;

    while ((match = hrefRegex.exec(content)) !== null) {
      const href = match[1];
      if (!isInternal(href)) continue;

      const filePath = urlToFilePath(href);
      if (checked.has(filePath)) continue;
      checked.add(filePath);

      if (!existsSync(filePath)) {
        errors.push({ type: 'link', source: relative, url: href, file: filePath });
      }
    }
  }

  // ── 2. URLs en translations.js ────────────────────────────────────────────
  const translationsPath = join(PUBLIC_DIR, 'js', 'translations.js')
    || resolve('./netlify/edge-functions/data/translations.js');

  const altPaths = [
    join(PUBLIC_DIR, 'js', 'translations.js'),
    resolve('./netlify/edge-functions/data/translations.js'),
    resolve('./public/js/translations.js'),
  ];

  for (const tPath of altPaths) {
    if (!existsSync(tPath)) continue;

    const content = readFileSync(tPath, 'utf-8');
    const urlRegex = /url:\s*["']([^"']+)["']/g;
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      const url = match[1];
      if (!isInternal(url)) continue;

      const filePath = urlToFilePath(url);
      if (checked.has(filePath)) continue;
      checked.add(filePath);

      if (!existsSync(filePath)) {
        errors.push({ type: 'translations', source: 'translations.js', url, file: filePath });
      }
    }
    console.log(c.dim(`  translations.js encontrado: ${tPath}`));
    break;
  }

  // ── 3. hreflang ──────────────────────────────────────────────────────────
  const hreflangRegex = /hreflang[^>]+href=["']([^"']+)["']/g;

  for (const file of htmlFiles) {
    const content  = readFileSync(file, 'utf-8');
    const relative = file.replace(PUBLIC_DIR, '');
    let match;

    while ((match = hreflangRegex.exec(content)) !== null) {
      const url = match[1].replace(BASE_URL, '');
      if (!isInternal(url)) continue;

      const filePath = urlToFilePath(url);
      if (checked.has(filePath)) continue;
      checked.add(filePath);

      if (!existsSync(filePath)) {
        errors.push({ type: 'hreflang', source: relative, url, file: filePath });
      }
    }
  }

  // ── RESULTADO LOCAL ───────────────────────────────────────────────────────
  console.log(c.dim(`  URLs únicas comprobadas: ${checked.size}\n`));

  if (errors.length === 0) {
    console.log(c.green('  ✅ Ningún link interno roto.\n'));
  } else {
    // Agrupar por tipo
    const byType = {};
    for (const e of errors) {
      if (!byType[e.type]) byType[e.type] = [];
      byType[e.type].push(e);
    }

    for (const [type, list] of Object.entries(byType)) {
      const label = { link: '🔗 Links rotos en HTML', translations: '📋 URLs rotas en translations.js', hreflang: '🌐 hreflang rotos' }[type];
      console.log(c.red(`\n  ${label} (${list.length}):`));
      for (const e of list) {
        console.log(`    ${c.red('✗')} ${c.dim(e.source)}`);
        console.log(`      URL:    ${e.url}`);
        console.log(`      Busqué: ${e.file.replace(PUBLIC_DIR, '')}`);
      }
    }
    console.log();
  }

  return { errors };
}

// ── MODO REMOTE ────────────────────────────────────────────────────────────────
async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Calculenow-URL-Checker/1.0' },
    });
    clearTimeout(timer);
    return { status: res.status, finalUrl: res.url };
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') return { status: 'TIMEOUT', finalUrl: url };
    return { status: 'ERROR', finalUrl: url, error: err.message };
  }
}

async function checkRemote() {
  console.log(c.bold('\n🌐 MODO REMOTE — comprobando URLs de producción'));
  console.log(c.dim('─'.repeat(60)));
  console.log(c.cyan(`  Sitemap: ${SITEMAP_URL}\n`));

  let urls;
  try {
    const res = await fetch(SITEMAP_URL);
    const xml = await res.text();
    urls = [...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim()))];
  } catch (err) {
    console.error(c.red(`  No se pudo descargar el sitemap: ${err.message}\n`));
    return { errors: [] };
  }

  console.log(`  URLs en sitemap: ${c.bold(urls.length)}\n`);

  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const done  = await Promise.all(batch.map(async url => {
      const { status, finalUrl, error } = await fetchWithTimeout(url);
      return { url, status, finalUrl, error };
    }));
    results.push(...done);
    process.stdout.write(`\r  Comprobando: ${Math.min(i + CONCURRENCY, urls.length)}/${urls.length}`);
  }
  console.log('\n');

  const ok       = results.filter(r => r.status === 200);
  const redirect = results.filter(r => r.status >= 300 && r.status < 400);
  const errors   = results.filter(r => r.status === 404 || r.status === 500);
  const other    = results.filter(r => r.status === 'TIMEOUT' || r.status === 'ERROR');

  console.log(`  ${c.green('✅ OK (200)')}            ${ok.length}`);
  console.log(`  ${c.yellow('↩️  Redirección (3xx)')}   ${redirect.length}`);
  console.log(`  ${c.red('❌ Error (404/500)')}     ${errors.length}`);
  console.log(`  ${c.red('⏱  Timeout/Error')}       ${other.length}`);

  if (redirect.length) {
    console.log(c.yellow('\n  ↩️  REDIRECCIONES (deberían ser 200 en sitemap):'));
    redirect.forEach(r => {
      console.log(`    ${c.yellow(r.status)}  ${r.url}`);
      if (r.finalUrl !== r.url) console.log(c.dim(`         → ${r.finalUrl}`));
    });
  }

  if (errors.length) {
    console.log(c.red('\n  ❌ ERRORES:'));
    errors.forEach(r => console.log(`    ${c.red(r.status)}  ${r.url}`));
  }

  if (other.length) {
    console.log(c.red('\n  ⏱  TIMEOUTS / ERRORES DE RED:'));
    other.forEach(r => console.log(`    ${c.red(r.status)}  ${r.url}${r.error ? ` — ${r.error}` : ''}`));
  }

  if (!errors.length && !other.length) {
    console.log(c.green('\n  🎉 Todo correcto en producción.\n'));
  } else {
    console.log(c.red(`\n  ⚠️  ${errors.length + other.length} URL(s) con problemas.\n`));
  }

  return { errors: [...errors, ...other] };
}

// ── MAIN ───────────────────────────────────────────────────────────────────────
(async () => {
  console.log(c.bold('\n🔍 Calculenow — URL Checker'));
  console.log(c.dim('═'.repeat(60)));

  const localErrors  = MODE_LOCAL  ? (await checkLocal()).errors  : [];
  const remoteErrors = MODE_REMOTE ? (await checkRemote()).errors : [];

  const total = localErrors.length + remoteErrors.length;

  console.log(c.dim('═'.repeat(60)));
  if (total === 0) {
    console.log(c.green(c.bold('\n✅ Todo en orden. Ningún error encontrado.\n')));
  } else {
    console.log(c.red(c.bold(`\n⚠️  ${total} problema(s) encontrado(s). Revisa los detalles arriba.\n`)));
    process.exit(1);
  }
})();

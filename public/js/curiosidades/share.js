/**
 * share.js
 * Genera los botones de compartir para las calculadoras de curiosidades.
 * Uso: importar y llamar a renderShareButtons(container, text, url)
 * Los iconos son SVG inline para no depender de librerías externas.
 */

const SHARE_ICONS = {
  whatsapp: {
    label: 'WhatsApp',
    color: '#25d366',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5.003L2.016 21.99l5.101-1.335A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.521 2 11.998 2zm.002 18a7.964 7.964 0 01-4.072-1.117l-.292-.173-3.027.793.808-2.955-.19-.303A7.944 7.944 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>`,
    getUrl: (text, url) => `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
  },
  twitter: {
    label: 'Twitter/X',
    color: '#000000',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    getUrl: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  bluesky: {
    label: 'Bluesky',
    color: '#0085ff',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/></svg>`,
    getUrl: (text, url) => `https://bsky.app/intent/compose?text=${encodeURIComponent(text + ' ' + url)}`,
  },
  telegram: {
    label: 'Telegram',
    color: '#2aabee',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
    getUrl: (text, url) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  facebook: {
    label: 'Facebook',
    color: '#1877f2',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    getUrl: (text, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
  },
};

/**
 * Renderiza los botones de compartir dentro del contenedor dado.
 * @param {HTMLElement} container - El div donde insertar los botones
 * @param {string} shareText - El texto a compartir (frase llamativa)
 * @param {string} shareUrl - La URL de la página
 */
export function renderShareButtons(container, shareText, shareUrl) {
  const btns = Object.entries(SHARE_ICONS).map(([key, red]) => `
    <a
      href="${red.getUrl(shareText, shareUrl)}"
      target="_blank"
      rel="noopener noreferrer"
      class="share-btn share-btn--${key}"
      title="${red.label}"
      aria-label="Compartir en ${red.label}">
      ${red.svg}
    </a>
  `).join('');

  // Botón nativo (Web Share API) — solo en móvil si está disponible
  const nativeBtn = navigator.share ? `
    <button class="share-btn share-btn--native" id="share-native" title="Compartir" aria-label="Compartir">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
    </button>
  ` : '';

  container.innerHTML = `
    <div class="share-actions">
      <p class="share-label">Compartir</p>
      <div class="share-btns">
        ${btns}
        ${nativeBtn}
      </div>
    </div>
  `;

  container.querySelector('#share-native')?.addEventListener('click', async () => {
    try {
      await navigator.share({ text: shareText, url: shareUrl });
    } catch {}
  });
}
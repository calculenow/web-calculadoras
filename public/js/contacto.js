// ==================== FORMULARIO DE CONTACTO ====================

const isEn = window.location.pathname.includes('/en/');

(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: "ZaG9iF5eQ1j7txAUR" });
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (!contactForm || !formStatus) return;

  const btnEnviar = contactForm.querySelector('button[type="submit"]');

  const validarFormulario = (campos) => {
    return campos.every(campo => campo && campo.value.trim() !== '');
  };

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    formStatus.textContent = '';
    formStatus.className = 'form-status';

    const campos = [
      document.getElementById('nombre'),
      document.getElementById('email'),
      document.getElementById('mensaje')
    ];

    if (!validarFormulario(campos)) {
      formStatus.textContent = isEn
        ? 'Please fill in all fields correctly.'
        : 'Por favor, rellena los campos correctamente.';
      formStatus.classList.add('error-text');
      return;
    }

    const originalText = btnEnviar.textContent;
    btnEnviar.textContent = isEn ? 'Sending...' : 'Enviando...';
    btnEnviar.disabled = true;

    emailjs.sendForm('service_a49ave5', 'template_w1oi5ir', this)
      .then(() => {
        formStatus.textContent = isEn
          ? 'Message sent successfully!'
          : '¡Mensaje enviado con éxito!';
        formStatus.classList.add('success-text');
        contactForm.reset();
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        formStatus.textContent = isEn
          ? 'Error sending message. Please try again.'
          : 'Error al enviar. Inténtalo de nuevo.';
        formStatus.classList.add('error-text');
      })
      .finally(() => {
        btnEnviar.textContent = originalText;
        btnEnviar.disabled = false;
      });
  });
});
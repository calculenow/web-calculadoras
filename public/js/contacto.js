// ==================== FORMULARIO DE CONTACTO ====================
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: "ZaG9iF5eQ1j7txAUR" });
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        const btnEnviar = contactForm.querySelector('button[type="submit"]');

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Limpieza de estados previos
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const campos = [
                document.getElementById('nombre'),
                document.getElementById('email'),
                document.getElementById('mensaje')
            ];

            // Validación de texto/email del core.js
            if (!validarFormulario(campos)) {
                formStatus.textContent = 'Por favor, rellena los campos correctamente.';
                formStatus.classList.add('error-text');
                return;
            }

            const originalText = btnEnviar.textContent;
            btnEnviar.textContent = 'Enviando...';
            btnEnviar.disabled = true;

            emailjs.sendForm('service_a49ave5', 'template_w1oi5ir', this)
                .then(() => {
                    formStatus.textContent = '¡Mensaje enviado con éxito!';
                    formStatus.classList.add('success-text');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    formStatus.textContent = 'Error al enviar. Inténtalo de nuevo.';
                    formStatus.classList.add('error-text');
                })
                .finally(() => {
                    btnEnviar.textContent = originalText;
                    btnEnviar.disabled = false;
                });
        });
    }
});
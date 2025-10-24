// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded',
        navToggle.classList.contains('active') ? 'true' : 'false'
    );
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(element => {
    observer.observe(element);
});

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// FORM VALIDATION
// ===================================

const form = document.getElementById('reservasForm');
const formMessage = document.getElementById('formMessage');

const validators = {
    nombre: (value) => {
        if (!value.trim()) return 'Por favor, introduce tu nombre';
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
        return '';
    },
    email: (value) => {
        if (!value.trim()) return 'Por favor, introduce tu email';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Por favor, introduce un email válido';
        return '';
    },
    telefono: (value) => {
        if (!value.trim()) return 'Por favor, introduce tu teléfono';
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Por favor, introduce un teléfono válido';
        return '';
    },
    personas: (value) => {
        if (!value) return 'Por favor, selecciona el número de personas';
        return '';
    },
    fecha: (value) => {
        if (!value) return 'Por favor, selecciona una fecha';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Por favor, selecciona una fecha futura';
        return '';
    },
    hora: (value) => {
        if (!value) return 'Por favor, selecciona una hora';
        return '';
    }
};

function validateField(fieldName, value) {
    const error = validators[fieldName] ? validators[fieldName](value) : '';
    const errorElement = document.getElementById(`${fieldName}Error`);

    if (errorElement) {
        errorElement.textContent = error;
    }

    return error === '';
}

Object.keys(validators).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
        field.addEventListener('blur', (e) => {
            validateField(fieldName, e.target.value);
        });

        field.addEventListener('input', (e) => {
            if (e.target.classList.contains('error')) {
                validateField(fieldName, e.target.value);
            }
        });
    }
});

// ===================================
// FORM SUBMISSION WITH EMAILJS
// ===================================

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const formData = new FormData(form);

    Object.keys(validators).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field && !validateField(fieldName, field.value)) {
            isValid = false;
            field.classList.add('error');
        } else if (field) {
            field.classList.remove('error');
        }
    });

    if (!isValid) {
        showMessage('Por favor, corrige los errores en el formulario', 'error');
        return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
        // EMAILJS CONFIGURATION
        // Uncomment and configure when ready to use EmailJS
        /*
        emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key

        const templateParams = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            personas: formData.get('personas'),
            fecha: formData.get('fecha'),
            hora: formData.get('hora'),
            comentarios: formData.get('comentarios') || 'Sin comentarios'
        };

        await emailjs.send(
            'YOUR_SERVICE_ID',      // Replace with your EmailJS service ID
            'YOUR_TEMPLATE_ID',     // Replace with your EmailJS template ID
            templateParams
        );
        */

        // SIMULATE SUCCESS (Remove this when using real EmailJS)
        await new Promise(resolve => setTimeout(resolve, 1500));

        showMessage('¡Reserva enviada con éxito! Te contactaremos pronto para confirmar.', 'success');
        form.reset();

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        showMessage('Ha ocurrido un error. Por favor, intenta de nuevo o contáctanos directamente.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// ===================================
// SET MINIMUM DATE FOR RESERVATIONS
// ===================================

const fechaInput = document.getElementById('fecha');
if (fechaInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate = tomorrow.toISOString().split('T')[0];
    fechaInput.setAttribute('min', minDate);
}

// ===================================
// LAZY LOADING IMAGES
// ===================================

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// ACTIVE LINK HIGHLIGHT ON SCROLL
// ===================================

const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%cSabor & Alma 🍽️', 'font-size: 24px; color: #c9a86a; font-weight: bold;');
console.log('%cDesarrollado con amor y pasión por la gastronomía', 'font-size: 14px; color: #666;');

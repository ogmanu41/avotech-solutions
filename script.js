/* ============================================
   AVOTECH SOLUTIONS — JAVASCRIPT
   Handles: hero slideshow, nav, mobile menu,
   FAQ accordion, portfolio modals, back to top,
   contact form.
   ============================================ */

// ---- Hero slideshow ----
// Cycles through 4 background slides every 5 seconds.
// Clicking a dot jumps to that slide and resets the timer.
(function () {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots   = Array.from(document.querySelectorAll('.hero-dot'));
    if (slides.length < 2) return;

    let current = 0;
    let timer   = null;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function next() { goTo(current + 1); }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(next, 5000);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goTo(i);
            startTimer();
        });
    });

    startTimer();
}());

// Back to top
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('mobile-open');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Nav active state: highlight the link matching the current section
const sectionEls = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sectionEls.forEach(section => {
        if (window.scrollY >= section.offsetTop - 90) {
            current = section.id;
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === '#' + current);
    });
}, { passive: true });

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-faq');
        const answer   = document.getElementById(targetId);
        const isOpen   = answer.classList.contains('open');

        // Collapse all
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
        document.querySelectorAll('.faq-question').forEach(b => {
            b.classList.remove('open');
            b.setAttribute('aria-expanded', 'false');
        });

        // Expand clicked (if it was closed)
        if (!isOpen) {
            answer.classList.add('open');
            btn.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// Portfolio modals
document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modal = document.getElementById(trigger.getAttribute('data-modal'));
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Move focus into the modal dialog
        const dialog = modal.querySelector('.modal-dialog');
        if (dialog) dialog.focus();
    });
});

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => closeModal(el.getAttribute('data-close')));
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(m => {
            m.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// Contact form — submits to contact.php via fetch.
// Previously the server call was commented out; this was the primary functional defect.
const contactForm  = document.getElementById('contactForm');
const formMessage  = document.getElementById('formMessage');
const submitBtn    = document.getElementById('submitBtn');

function validateEmail(email) {
    // Standard format check — server also validates with filter_var
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(text, type) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className   = 'form-message ' + type;
    formMessage.hidden      = false;
}

function clearFormMessage() {
    if (!formMessage) return;
    formMessage.hidden    = true;
    formMessage.textContent = '';
    formMessage.className   = 'form-message';
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearFormMessage();

        const fullName = document.getElementById('fullName').value.trim();
        const email    = document.getElementById('email').value.trim();
        const subject  = document.getElementById('subject').value.trim();
        const message  = document.getElementById('message').value.trim();

        // Client-side validation
        if (!fullName || !email || !subject || !message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Disable submit while in flight
        submitBtn.disabled     = true;
        submitBtn.textContent  = 'Sending...';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('contact.php', {
                method: 'POST',
                body:   formData
            });

            // contact.php always returns JSON
            const data = await response.json();

            if (data.success) {
                showFormMessage(data.message, 'success');
                contactForm.reset();
            } else {
                const errorText = (data.errors && data.errors.length)
                    ? data.errors.join('. ')
                    : 'Something went wrong. Please try again.';
                showFormMessage(errorText, 'error');
            }
        } catch (err) {
            // [Form] submit failed: network error or non-JSON response
            showFormMessage('[Form] submit failed: could not reach the server. Please call us directly.', 'error');
        } finally {
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Send Inquiry \u2192';
        }
    });
}
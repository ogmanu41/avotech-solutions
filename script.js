/* ============================================
   AVOTECH SOLUTIONS - JAVASCRIPT
   ============================================ */

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'flex';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Counter Animation for Statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
 
        const updateCount = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target;
            }
        };
 
        updateCount();
    });
}

// Trigger counter animation when stats section is in view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsSection = document.querySelector('.bg-dark');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(statsSection);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Validation and Submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validation
        if (!fullName || !email || !subject || !message) {
            showFormMessage('Please fill in all required fields.', 'danger');
            return;
        }

        if (!validateEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'danger');
            return;
        }

        // If validation passes
        showFormMessage('Thank you for your inquiry! We will get back to you soon.', 'success');
        contactForm.reset();
        
        // Optional: Send data to server
        // await sendFormData(fullName, email, phone, subject, message);
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `alert alert-${type} show`;
    formMessage.classList.remove('d-none');

    setTimeout(() => {
        formMessage.classList.add('d-none');
    }, 5000);
}

// Navbar Active Link Tracking
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Fade in elements on scroll
function fadeInOnScroll() {
    const elements = document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card');
    
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, options);

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize fade-in on page load
document.addEventListener('DOMContentLoaded', fadeInOnScroll);

// Mobile menu close on link click
const navbarCollapse = document.querySelector('.navbar-collapse');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
        bsCollapse.hide();
    });
});

// Parallax scroll effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    }
});

// Add animation delay to service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Portfolio modal enhancement
const portfolioModals = document.querySelectorAll('.modal');
portfolioModals.forEach(modal => {
    modal.addEventListener('show.bs.modal', function() {
        document.body.style.overflow = 'hidden';
    });
    modal.addEventListener('hide.bs.modal', function() {
        document.body.style.overflow = 'auto';
    });
});

// Hover effect for stat boxes
const statBoxes = document.querySelectorAll('.stat-box');
statBoxes.forEach(box => {
    box.addEventListener('mouseenter', () => {
        box.style.transform = 'scale(1.05)';
        box.style.transition = 'transform 0.3s ease';
    });
    box.addEventListener('mouseleave', () => {
        box.style.transform = 'scale(1)';
    });
});

// Enhanced form input focus effect
const formInputs = document.querySelectorAll('.form-control');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.transition = 'opacity 0.5s ease';
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Prevent multiple form submissions
let isFormSubmitting = false;

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        if (isFormSubmitting) {
            e.preventDefault();
            return;
        }
        isFormSubmitting = true;
        
        setTimeout(() => {
            isFormSubmitting = false;
        }, 2000);
    });
}

// Log page load time for optimization
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Accessibility: Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
        });
    }
});
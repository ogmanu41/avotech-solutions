/**
 * AVOTECH SOLUTIONS - API CLIENT
 * Handles all API requests to backend
 */

class APIClient {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.timeout = 30000;
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/${endpoint}`;
        const config = {
            method: options.method || 'GET',
            headers: {
                ...this.headers,
                ...options.headers
            },
            timeout: options.timeout || this.timeout
        };

        if (options.data) {
            config.body = JSON.stringify(options.data);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     */
    post(endpoint, data, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', data });
    }

    /**
     * PUT request
     */
    put(endpoint, data, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', data });
    }

    /**
     * DELETE request
     */
    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    /**
     * Set Authorization header
     */
    setAuthToken(token) {
        this.headers['Authorization'] = `Bearer ${token}`;
    }

    /**
     * Remove Authorization header
     */
    removeAuthToken() {
        delete this.headers['Authorization'];
    }
}

/**
 * CONTACT FORM API HANDLER
 */
class ContactFormHandler {
    constructor(formSelector = '#contactForm') {
        this.form = document.querySelector(formSelector);
        this.formMessage = document.getElementById('formMessage');
        this.api = new APIClient();
        
        if (this.form) {
            this.init();
        }
    }

    /**
     * Initialize form handler
     */
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupInputValidation();
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            const formData = this.getFormData();
            
            // Submit form via contact.php
            const response = await fetch('contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage(result.message, 'success');
                this.form.reset();
            } else {
                this.showMessage(
                    result.message || 'An error occurred. Please try again.',
                    'danger'
                );
                if (result.errors && result.errors.length > 0) {
                    this.displayErrors(result.errors);
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('An error occurred. Please try again later.', 'danger');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Get form data
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        return data;
    }

    /**
     * Validate form
     */
    validateForm() {
        const fullName = this.form.fullName.value.trim();
        const email = this.form.email.value.trim();
        const subject = this.form.subject.value.trim();
        const message = this.form.message.value.trim();

        const errors = [];

        if (!fullName || fullName.length < 2) {
            errors.push('Full Name must be at least 2 characters');
        }

        if (!email || !this.isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        }

        if (!subject || subject.length < 3) {
            errors.push('Subject must be at least 3 characters');
        }

        if (!message || message.length < 10) {
            errors.push('Message must be at least 10 characters');
        }

        if (errors.length > 0) {
            this.displayErrors(errors);
            return false;
        }

        return true;
    }

    /**
     * Setup real-time input validation
     */
    setupInputValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });

            input.addEventListener('input', (e) => {
                this.validateField(e.target);
            });
        });
    }

    /**
     * Validate single field
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        if (field.name === 'fullName') {
            isValid = value.length >= 2;
            message = isValid ? '' : 'Name must be at least 2 characters';
        } else if (field.name === 'email') {
            isValid = this.isValidEmail(value);
            message = isValid ? '' : 'Invalid email address';
        } else if (field.name === 'phone') {
            isValid = value === '' || this.isValidPhone(value);
            message = isValid ? '' : 'Invalid phone number';
        } else if (field.name === 'subject') {
            isValid = value.length >= 3;
            message = isValid ? '' : 'Subject must be at least 3 characters';
        } else if (field.name === 'message') {
            isValid = value.length >= 10;
            message = isValid ? '' : 'Message must be at least 10 characters';
        }

        this.updateFieldStatus(field, isValid, message);
    }

    /**
     * Update field validation status
     */
    updateFieldStatus(field, isValid, message) {
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else if (field.value.trim() !== '') {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }

        const feedback = field.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }

    /**
     * Check if email is valid
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Check if phone is valid
     */
    isValidPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
    }

    /**
     * Display form errors
     */
    displayErrors(errors) {
        this.showMessage(errors.join(', '), 'danger');
    }

    /**
     * Show message
     */
    showMessage(message, type = 'info') {
        this.formMessage.textContent = message;
        this.formMessage.className = `alert alert-${type} show`;
        this.formMessage.classList.remove('d-none');

        setTimeout(() => {
            this.formMessage.classList.add('d-none');
        }, 5000);
    }

    /**
     * Set loading state
     */
    setLoadingState(loading) {
        const button = this.form.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = loading;
            button.innerHTML = loading 
                ? '<span class="spinner-border spinner-border-sm me-2"></span>Sending...' 
                : '<i class="fas fa-paper-plane me-2"></i>Send Inquiry';
        }
    }
}

/**
 * Initialize contact form when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler('#contactForm');
});

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APIClient,
        ContactFormHandler
    };
}
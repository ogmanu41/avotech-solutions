/**
 * AVOTECH SOLUTIONS - HELPER UTILITIES
 * Common JavaScript functions and utilities
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format date to readable string
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'KES') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Debounce function - prevents function from firing too often
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle function - limits function execution frequency
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Deep clone object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if email is valid
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Check if phone is valid (10-15 digits)
 */
function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
}

/**
 * Get URL parameters
 */
function getUrlParameter(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy', 'error');
    });
}

/**
 * Generate random ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Sleep/delay promise
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Show notification/toast
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x m-3`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, duration);
}

// ============================================
// API REQUEST FUNCTIONS
// ============================================

/**
 * Fetch data with error handling
 */
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        showNotification('An error occurred. Please try again.', 'danger');
        throw error;
    }
}

/**
 * POST request
 */
async function postData(url, data = {}) {
    return fetchData(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * PUT request
 */
async function putData(url, data = {}) {
    return fetchData(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * DELETE request
 */
async function deleteData(url) {
    return fetchData(url, {
        method: 'DELETE'
    });
}

// ============================================
// DOM MANIPULATION
// ============================================

/**
 * Add event listener to multiple elements
 */
function addEventToMultiple(selector, event, callback) {
    document.querySelectorAll(selector).forEach(element => {
        element.addEventListener(event, callback);
    });
}

/**
 * Toggle class
 */
function toggleClass(selector, className) {
    document.querySelectorAll(selector).forEach(element => {
        element.classList.toggle(className);
    });
}

/**
 * Add class to elements
 */
function addClass(selector, className) {
    document.querySelectorAll(selector).forEach(element => {
        element.classList.add(className);
    });
}

/**
 * Remove class from elements
 */
function removeClass(selector, className) {
    document.querySelectorAll(selector).forEach(element => {
        element.classList.remove(className);
    });
}

/**
 * Show element
 */
function showElement(selector) {
    document.querySelectorAll(selector).forEach(element => {
        element.style.display = '';
    });
}

/**
 * Hide element
 */
function hideElement(selector) {
    document.querySelectorAll(selector).forEach(element => {
        element.style.display = 'none';
    });
}

/**
 * Get form data as object
 */
function getFormData(formSelector) {
    const form = document.querySelector(formSelector);
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    return data;
}

/**
 * Clear form
 */
function clearForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (form) {
        form.reset();
    }
}

// ============================================
// STORAGE FUNCTIONS
// ============================================

/**
 * Set local storage
 */
function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Storage error:', error);
    }
}

/**
 * Get local storage
 */
function getStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Storage error:', error);
        return null;
    }
}

/**
 * Remove from storage
 */
function removeStorage(key) {
    localStorage.removeItem(key);
}

/**
 * Clear all storage
 */
function clearStorage() {
    localStorage.clear();
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate form fields
 */
function validateForm(formSelector, rules) {
    const form = document.querySelector(formSelector);
    const formData = getFormData(formSelector);
    const errors = {};

    for (const field in rules) {
        const value = formData[field];
        const fieldRules = rules[field];

        for (const rule of fieldRules) {
            if (!validateField(value, rule)) {
                if (!errors[field]) {
                    errors[field] = [];
                }
                errors[field].push(rule.message);
            }
        }
    }

    return errors;
}

/**
 * Validate single field
 */
function validateField(value, rule) {
    switch (rule.type) {
        case 'required':
            return value && value.trim() !== '';
        case 'email':
            return isValidEmail(value);
        case 'phone':
            return isValidPhone(value);
        case 'minLength':
            return value.length >= rule.value;
        case 'maxLength':
            return value.length <= rule.value;
        case 'pattern':
            return rule.value.test(value);
        default:
            return true;
    }
}

/**
 * Display form errors
 */
function displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.invalid-feedback').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });

    // Display new errors
    for (const field in errors) {
        const errorElement = document.querySelector(`#${field}Error`);
        if (errorElement) {
            errorElement.textContent = errors[field][0];
            errorElement.style.display = 'block';
        }
    }
}

// ============================================
// ANIMATION FUNCTIONS
// ============================================

/**
 * Animate element
 */
function animateElement(selector, animationClass, duration = 1000) {
    const element = document.querySelector(selector);
    if (!element) return;

    element.classList.add(animationClass);
    
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, duration);
}

/**
 * Scroll to element smoothly
 */
function scrollToElement(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

/**
 * Fade in element
 */
function fadeIn(selector, duration = 500) {
    const element = document.querySelector(selector);
    if (!element) return;

    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms`;
    
    setTimeout(() => {
        element.style.opacity = '1';
    }, 10);
}

/**
 * Fade out element
 */
function fadeOut(selector, duration = 500) {
    const element = document.querySelector(selector);
    if (!element) return;

    element.style.opacity = '1';
    element.style.transition = `opacity ${duration}ms`;
    
    setTimeout(() => {
        element.style.opacity = '0';
    }, 10);
}

// ============================================
// DEVICE DETECTION
// ============================================

/**
 * Check if device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device is tablet
 */
function isTabletDevice() {
    return /iPad|Android(?!.*Mobile)/.test(navigator.userAgent);
}

/**
 * Get device type
 */
function getDeviceType() {
    if (isTabletDevice()) return 'tablet';
    if (isMobileDevice()) return 'mobile';
    return 'desktop';
}

// ============================================
// PERFORMANCE FUNCTIONS
// ============================================

/**
 * Measure function execution time
 */
function measureTime(func, funcName = 'Function') {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    console.log(`${funcName} execution time: ${(end - start).toFixed(2)}ms`);
    return result;
}

/**
 * Log to console with timestamp
 */
function logWithTime(message, type = 'log') {
    const timestamp = new Date().toLocaleTimeString();
    console[type](`[${timestamp}] ${message}`);
}

// ============================================
// EXPORT FOR MODULE USE
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatCurrency,
        isInViewport,
        debounce,
        throttle,
        deepClone,
        capitalize,
        isValidEmail,
        isValidPhone,
        getUrlParameter,
        copyToClipboard,
        generateId,
        sleep,
        showNotification,
        fetchData,
        postData,
        putData,
        deleteData,
        addEventToMultiple,
        toggleClass,
        addClass,
        removeClass,
        showElement,
        hideElement,
        getFormData,
        clearForm,
        setStorage,
        getStorage,
        removeStorage,
        clearStorage,
        validateForm,
        validateField,
        displayFormErrors,
        animateElement,
        scrollToElement,
        fadeIn,
        fadeOut,
        isMobileDevice,
        isTabletDevice,
        getDeviceType,
        measureTime,
        logWithTime
    };
}
<?php
/**
 * AVOTECH SOLUTIONS - Configuration File
 * Central configuration for all backend operations
 */

// ============================================
// DATABASE CONFIGURATION
// ============================================
define('DB_HOST', 'localhost');
define('DB_USER', 'avotech_user');
define('DB_PASSWORD', 'your_secure_password_here');
define('DB_NAME', 'avotech_solutions');
define('DB_PORT', 3306);

// ============================================
// SITE CONFIGURATION
// ============================================
define('SITE_URL', 'https://avotechsolutions.com');
define('SITE_NAME', 'Avotech Solutions');
define('ADMIN_EMAIL', 'admin@avotechsolutions.com');
define('SUPPORT_EMAIL', 'avotechsolutions@yahoo.com');
define('SUPPORT_PHONE', '+254 703 178 385');

// ============================================
// SECURITY CONFIGURATION
// ============================================
define('SECRET_KEY', 'your_secret_key_here_change_this');
define('JWT_SECRET', 'your_jwt_secret_here_change_this');
define('SESSION_TIMEOUT', 3600); // 1 hour
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOCKOUT_TIME', 900); // 15 minutes

// ============================================
// EMAIL CONFIGURATION
// ============================================
define('MAIL_FROM_NAME', 'Avotech Solutions');
define('MAIL_FROM_EMAIL', 'noreply@avotechsolutions.com');
define('MAIL_SMTP_HOST', 'smtp.gmail.com');
define('MAIL_SMTP_PORT', 587);
define('MAIL_SMTP_USER', 'your_email@gmail.com');
define('MAIL_SMTP_PASSWORD', 'your_app_password');
define('MAIL_SMTP_SECURE', 'tls');

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']);

// ============================================
// LOGGING CONFIGURATION
// ============================================
define('LOG_DIR', __DIR__ . '/logs/');
define('LOG_LEVEL', 'info'); // debug, info, warning, error

// ============================================
// API CONFIGURATION
// ============================================
define('API_VERSION', 'v1');
define('API_RATE_LIMIT', 100); // requests per hour
define('API_TIMEOUT', 30); // seconds

// ============================================
// FEATURE FLAGS
// ============================================
define('ENABLE_REGISTRATION', true);
define('ENABLE_CONTACT_FORM', true);
define('ENABLE_NEWSLETTER', true);
define('MAINTENANCE_MODE', false);

// ============================================
// TIMEZONE
// ============================================
date_default_timezone_set('Africa/Nairobi');

// ============================================
// ERROR REPORTING
// ============================================
if (defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
}

// Ensure directories exist
if (!is_dir(LOG_DIR)) {
    mkdir(LOG_DIR, 0755, true);
}
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// ============================================
// AUTO-LOADING
// ============================================
require_once __DIR__ . '/includes/helpers.php';
require_once __DIR__ . '/includes/database.php';
require_once __DIR__ . '/includes/logger.php';
require_once __DIR__ . '/includes/auth.php';
?>
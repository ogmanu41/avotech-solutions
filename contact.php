<?php
// AVOTECH SOLUTIONS - Contact Form Handler
// Security and Best Practices Implementation

// Enable error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set proper headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// CORS handling
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit(json_encode(['status' => 'ok']));
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

try {
    // Sanitize and validate form inputs
    $fullName = isset($_POST['fullName']) ? sanitizeInput($_POST['fullName']) : '';
    $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
    $subject = isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '';
    $message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

    // Validation
    if (empty($fullName)) {
        $response['errors'][] = 'Full Name is required';
    } elseif (strlen($fullName) < 2 || strlen($fullName) > 100) {
        $response['errors'][] = 'Full Name must be between 2 and 100 characters';
    }

    if (empty($email)) {
        $response['errors'][] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors'][] = 'Please provide a valid email address';
    }

    if (!empty($phone) && !validatePhone($phone)) {
        $response['errors'][] = 'Please provide a valid phone number';
    }

    if (empty($subject)) {
        $response['errors'][] = 'Subject is required';
    } elseif (strlen($subject) < 3 || strlen($subject) > 200) {
        $response['errors'][] = 'Subject must be between 3 and 200 characters';
    }

    if (empty($message)) {
        $response['errors'][] = 'Message is required';
    } elseif (strlen($message) < 10 || strlen($message) > 5000) {
        $response['errors'][] = 'Message must be between 10 and 5000 characters';
    }

    // Check for spam
    if (containsSpam($message)) {
        $response['errors'][] = 'Message contains suspicious content';
    }

    // Return validation errors if any
    if (!empty($response['errors'])) {
        http_response_code(400);
        exit(json_encode($response));
    }

    // Prepare email
    $to = 'avotechsolutions@yahoo.com';
    $emailSubject = "New Contact Form Submission: " . htmlspecialchars($subject);
    
    // Create email headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . filter_var($email, FILTER_SANITIZE_EMAIL) . "\r\n";
    $headers .= "Reply-To: " . filter_var($email, FILTER_SANITIZE_EMAIL) . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // Create HTML email body
    $emailBody = createEmailBody($fullName, $email, $phone, $subject, $message);

    // Send email
    if (mail($to, $emailSubject, $emailBody, $headers)) {
        $response['success'] = true;
        $response['message'] = 'Thank you for your inquiry! We will get back to you shortly.';
        http_response_code(200);
        
        // Optional: Log successful submissions
        logSubmission($fullName, $email, $subject);
        
        // Optional: Send confirmation email to user
        sendConfirmationEmail($email, $fullName);
    } else {
        throw new Exception('Failed to send email. Please try again later.');
    }

} catch (Exception $e) {
    http_response_code(500);
    $response['success'] = false;
    $response['message'] = 'An error occurred while processing your request.';
    $response['errors'][] = $e->getMessage();
}

exit(json_encode($response));

// ==================================================
// HELPER FUNCTIONS
// ==================================================

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

/**
 * Validate phone number format
 */
function validatePhone($phone) {
    // Remove all non-digit characters
    $phone = preg_replace('/\D/', '', $phone);
    // Check if length is between 10 and 15 digits
    return strlen($phone) >= 10 && strlen($phone) <= 15;
}

/**
 * Check for common spam patterns
 */
function containsSpam($text) {
    $spamPatterns = [
        '/viagra/i',
        '/cialis/i',
        '/casino/i',
        '/lottery/i',
        '/click here/i',
        '/http:\/\/|https:\/\//i', // Links in message
        '/\b(?:XXX|xxx)\b/', // Adult content
    ];

    foreach ($spamPatterns as $pattern) {
        if (preg_match($pattern, $text)) {
            return true;
        }
    }
    return false;
}

/**
 * Create formatted HTML email body
 */
function createEmailBody($fullName, $email, $phone, $subject, $message) {
    $timestamp = date('Y-m-d H:i:s');
    
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0f172a; color: white; padding: 20px; border-radius: 5px; }
            .content { padding: 20px; background-color: #f9f9f9; margin: 20px 0; border-left: 4px solid #fbbf24; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
            .label { font-weight: bold; color: #0f172a; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
            </div>
            
            <div class='content'>
                <p><span class='label'>Name:</span> " . $fullName . "</p>
                <p><span class='label'>Email:</span> " . $email . "</p>
                <p><span class='label'>Phone:</span> " . (!empty($phone) ? $phone : 'Not provided') . "</p>
                <p><span class='label'>Subject:</span> " . $subject . "</p>
                <p><span class='label'>Message:</span></p>
                <p>" . nl2br($message) . "</p>
            </div>
            
            <div class='footer'>
                <p>Submitted on: " . $timestamp . "</p>
                <p>IP Address: " . sanitizeIp($_SERVER['REMOTE_ADDR']) . "</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return $emailBody;
}

/**
 * Sanitize IP address
 */
function sanitizeIp($ip) {
    if (filter_var($ip, FILTER_VALIDATE_IP)) {
        return htmlspecialchars($ip, ENT_QUOTES, 'UTF-8');
    }
    return 'Unknown';
}

/**
 * Log form submissions (optional)
 */
function logSubmission($name, $email, $subject) {
    $logDir = __DIR__ . '/logs';
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logFile = $logDir . '/submissions_' . date('Y-m-d') . '.log';
    $logEntry = date('Y-m-d H:i:s') . " | Name: " . $name . " | Email: " . $email . " | Subject: " . $subject . " | IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

/**
 * Send confirmation email to user
 */
function sendConfirmationEmail($userEmail, $userName) {
    $subject = 'We received your inquiry - Avotech Solutions';
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: avotechsolutions@yahoo.com\r\n";
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0f172a; color: white; padding: 20px; border-radius: 5px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Thank You for Contacting Us!</h2>
            </div>
            
            <div class='content'>
                <p>Hi " . htmlspecialchars($userName) . ",</p>
                <p>We have received your inquiry and appreciate you reaching out to Avotech Solutions.</p>
                <p>Our team will review your message and get back to you as soon as possible, typically within 24-48 business hours.</p>
                <p>If your inquiry is urgent, feel free to call us at +254 703 178 385.</p>
                <p><strong>Best regards,</strong><br>Avotech Solutions Team</p>
            </div>
            
            <div style='text-align: center; color: #666; font-size: 12px; margin-top: 20px;'>
                <p>&copy; 2026 Avotech Solutions. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    @mail($userEmail, $subject, $message, $headers);
}
?>
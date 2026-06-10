<?php
/**
 * AVOTECH SOLUTIONS - Helpers Configuration
 * Basic utility functions
 */

if (!function_exists('safe_redirect')) {
    function safe_redirect($url) {
        header("Location: " . filter_var($url, FILTER_SANITIZE_URL));
        exit;
    }
}

if (!function_exists('sanitize_output')) {
    function sanitize_output($data) {
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }
}
?>

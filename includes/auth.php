<?php
/**
 * AVOTECH SOLUTIONS - Authentication and Session Management
 */

class Auth {
    public static function checkSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        return isset($_SESSION['user_id']);
    }

    public static function requireLogin() {
        if (!self::checkSession()) {
            header("HTTP/1.1 401 Unauthorized");
            exit(json_encode(['error' => 'Unauthorized access']));
        }
    }
}
?>

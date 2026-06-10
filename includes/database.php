<?php
/**
 * AVOTECH SOLUTIONS - Database Connection Helper
 */

class Database {
    private static $conn = null;
    
    public static function getConnection() {
        if (self::$conn === null) {
            try {
                $host = defined('DB_HOST') ? DB_HOST : 'localhost';
                $db   = defined('DB_NAME') ? DB_NAME : '';
                $user = defined('DB_USER') ? DB_USER : '';
                $pass = defined('DB_PASSWORD') ? DB_PASSWORD : '';
                $port = defined('DB_PORT') ? DB_PORT : 3306;
                
                self::$conn = new PDO("mysql:host=$host;dbname=$db;port=$port;charset=utf8mb4", $user, $pass, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false
                ]);
            } catch (PDOException $e) {
                // Log error securely and fail gracefully
                error_log("[DB] connection failed: " . $e->getMessage());
                return null;
            }
        }
        return self::$conn;
    }
}
?>

<?php
/**
 * AVOTECH SOLUTIONS - App Logging Helper
 */

class Logger {
    public static function log($message, $level = 'info') {
        $logDir = defined('LOG_DIR') ? LOG_DIR : __DIR__ . '/../logs/';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        $logFile = $logDir . '/app_' . date('Y-m-d') . '.log';
        $logEntry = date('Y-m-d H:i:s') . " [" . strtoupper($level) . "] " . $message . "\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
}
?>

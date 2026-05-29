<?php

// Load .env variables into the process environment
$envPath = __DIR__ . "/../.env";

if (file_exists($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);

        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");

        if (getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

// Unified Database connection using the team's standard Database class
require_once(__DIR__ . "/database.php");

try {
    $pdo = Database::getInstance();
} catch (Throwable $e) {
    die("Database connection failed: " . $e->getMessage());
}

<?php

class Database
{
    private static ?PDO $pdo = null;

    public static function connect(): PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        // Load .env variables if not already loaded in the environment
        if (getenv('DB_NAME') === false) {
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
        }

        $config = self::loadConfig();
        self::validateConfig($config);

        try {
            $dsn = self::buildDsn($config);

            self::$pdo = new PDO(
                $dsn,
                $config['username'],
                $config['YOUR_DB_PASSWORD'],
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );

            return self::$pdo;

        } catch (PDOException $e) {
            throw new RuntimeException(
                "Database connection failed: " . $e->getMessage()
            );
        }
    }

    public static function getInstance(): PDO
    {
        return self::connect();
    }

    private static function loadConfig(): array
    {
        return [
            'host' => getenv('DB_HOST') ?: 'localhost',
            'dbname' => getenv('DB_NAME'),
            'username' => getenv('DB_USER'),
            'YOUR_DB_PASSWORD' => getenv('DB_PASS'),
            'charset' => 'utf8mb4',
        ];
    }

    private static function validateConfig(array $config): void
    {
        $required = ['dbname', 'username'];

        foreach ($required as $key) {
            if (empty($config[$key])) {
                throw new InvalidArgumentException(
                    "Missing required database config: $key"
                );
            }
        }
    }

    private static function buildDsn(array $config): string
    {
        return sprintf(
            "mysql:host=%s;dbname=%s;charset=%s",
            $config['host'],
            $config['dbname'],
            $config['charset']
        );
    }

    public static function reset(): void
    {
        self::$pdo = null;
    }
}
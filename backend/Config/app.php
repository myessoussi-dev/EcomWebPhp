<?php

class Config
{
    private static array $data = [];
    private static bool $loaded = false;

    public static function load(): void
    {
        if (self::$loaded) {
            return;
        }

        $configPath = __DIR__ . '/../config/app.php';

        if (!file_exists($configPath)) {
            throw new RuntimeException("Config file not found: $configPath");
        }

        $data = require $configPath;

        if (!is_array($data)) {
            throw new RuntimeException("Config file must return an array");
        }

        self::$data = $data;
        self::$loaded = true;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        self::load();

        $value = self::$data;

        foreach (explode('.', $key) as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }

            $value = $value[$segment];
        }

        return $value;
    }
}

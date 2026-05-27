<?php

class JwtConfig
{
    private static ?string $secretKey = null;
    private static bool $initialized = false;

    public static function init(): void
    {
        if (self::$initialized) {
            return;
        }

        $secret = getenv('JWT_SECRET');

        if (!$secret || strlen($secret) < 32) {
            throw new RuntimeException(
                'JWT_SECRET must be set in environment and at least 32 characters'
            );
        }

        self::$secretKey = $secret;
        self::$initialized = true;
    }

    public static function getSecret(): string
    {
        if (!self::$initialized) {
            self::init();
        }

        return self::$secretKey;
    }

    public static function clear(): void
    {
        self::$secretKey = null;
        self::$initialized = false;
    }
}
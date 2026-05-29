<?php

class JwtConfig
{
    private static ?string $secretKey = null;
    private static ?string $adminsecret = null;
    private static bool $initialized = false;

    public static function init(): void
    {
        if (self::$initialized) {
            return;
        }

        $secret = getenv('JWT_SECRET');
        $adminsecret = getenv('JWT_ADMIN_SECRET');

        if (!$secret || strlen($secret) < 32) {
            throw new RuntimeException(
                'JWT_SECRET must be set in environment and at least 32 characters'
            );
        }
        if(!$adminsecret || strlen($adminsecret) < 32) {
            throw new RuntimeException(
                'JSWT_ADMIN_SECRET must be set in environment and at least 32 characters'
            );
        }

        self::$secretKey = $secret;
        self::$adminsecret = $adminsecret;
        self::$initialized = true;
    }

    public static function getSecret(): string
    {
        if (!self::$initialized) {
            self::init();
        }

        return self::$secretKey;
    }
    public static function getAdminSecret(): string
    {
        if (!self::$initialized) {
            self::init();
        }
        return self::$adminsecret;
    }

    public static function clear(): void
    {
        self::$secretKey = null;
        self::$initialized = false;
    }
}
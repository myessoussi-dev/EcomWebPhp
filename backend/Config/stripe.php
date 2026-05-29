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

$appUrl = rtrim(getenv('APP_URL') ?: 'http://localhost:5173', '/');

$stripeConfig = [
    'secret_key' => getenv('STRIPE_SECRET_KEY') ?: '',
    'currency' => getenv('STRIPE_CURRENCY') ?: 'eur',
    'success_url' => $appUrl . '/payment-success?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => $appUrl . '/payment-cancel'
];

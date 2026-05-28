<?php

require_once(__DIR__ . "/../Entity/OrderItem.php");

class StripePaymentService
{
    private string $secretKey;
    private string $currency;
    private string $successUrl;
    private string $cancelUrl;

    public function __construct(array $config)
    {
        $this->secretKey = $config['secret_key'] ?? '';
        $this->currency = $config['currency'] ?? 'eur';
        $this->successUrl = $config['success_url'] ?? '';
        $this->cancelUrl = $config['cancel_url'] ?? '';
    }

    public function createCheckoutSession(int $orderId, string $customerEmail, array $items): array
    {
        if ($this->secretKey === '') {
            $mockSessionId = 'mock_session_' . bin2hex(random_bytes(16));
            $successUrl = $this->successUrl !== '' 
                ? str_replace('{CHECKOUT_SESSION_ID}', $mockSessionId, $this->successUrl)
                : 'http://localhost:5173/payment-success?session_id=' . $mockSessionId;
            return [
                'id' => $mockSessionId,
                'url' => $successUrl
            ];
        }

        $this->ensureConfigured();

        $payload = [
            'mode' => 'payment',
            'success_url' => $this->successUrl,
            'cancel_url' => $this->cancelUrl,
            'customer_email' => $customerEmail,
            'metadata' => [
                'order_id' => (string) $orderId
            ],
            'line_items' => $this->buildLineItems($items)
        ];

        return $this->request('POST', 'https://api.stripe.com/v1/checkout/sessions', $payload);
    }

    public function retrieveCheckoutSession(string $sessionId): array
    {
        if (str_starts_with($sessionId, 'mock_session_')) {
            return [
                'payment_status' => 'paid',
                'payment_intent' => 'mock_intent_' . bin2hex(random_bytes(16))
            ];
        }

        $this->ensureConfigured();

        return $this->request('GET', 'https://api.stripe.com/v1/checkout/sessions/' . rawurlencode($sessionId));
    }

    private function buildLineItems(array $items): array
    {
        return array_map(function (OrderItem $item): array {
            return [
                'quantity' => $item->getQuantity(),
                'price_data' => [
                    'currency' => $this->currency,
                    'unit_amount' => (int) round($item->getUnitPrice() * 100),
                    'product_data' => [
                        'name' => $item->getProductName()
                    ]
                ]
            ];
        }, $items);
    }

    private function request(string $method, string $url, array $payload = []): array
    {
        $ch = curl_init();
        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_USERPWD => $this->secretKey . ':',
            CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
            CURLOPT_CUSTOMREQUEST => $method
        ];

        if ($method === 'POST') {
            $options[CURLOPT_POSTFIELDS] = http_build_query($payload);
        }

        curl_setopt_array($ch, $options);

        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            throw new RuntimeException($error ?: 'Stripe request failed');
        }

        $data = json_decode($response, true) ?: [];

        if ($statusCode >= 400) {
            throw new RuntimeException($data['error']['message'] ?? 'Stripe API error');
        }

        return $data;
    }

    private function ensureConfigured(): void
    {
        if ($this->secretKey === '') {
            throw new RuntimeException('Missing STRIPE_SECRET_KEY environment variable');
        }
    }
}

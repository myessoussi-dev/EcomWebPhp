<?php

class CustomerOrder
{
    private ?int $id;
    private int $userId;
    private float $total;
    private string $status;
    private string $paymentStatus;
    private ?string $stripeCheckoutSessionId;

    public function __construct(?int $id, int $userId, float $total, string $status = 'pending_payment', string $paymentStatus = 'unpaid', ?string $stripeCheckoutSessionId = null)
    {
        $this->id = $id;
        $this->userId = $userId;
        $this->total = $total;
        $this->status = $status;
        $this->paymentStatus = $paymentStatus;
        $this->stripeCheckoutSessionId = $stripeCheckoutSessionId;
    }

    public static function fromArray(array $row): self
    {
        return new self(
            isset($row['id']) ? (int) $row['id'] : null,
            isset($row['user_id']) ? (int) $row['user_id'] : 0,
            isset($row['total']) ? (float) $row['total'] : 0,
            $row['status'] ?? 'pending_payment',
            $row['payment_status'] ?? 'unpaid',
            $row['stripe_checkout_session_id'] ?? null
        );
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getTotal(): float
    {
        return $this->total;
    }

    public function getPaymentStatus(): string
    {
        return $this->paymentStatus;
    }
}

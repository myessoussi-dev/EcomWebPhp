<?php

class OrderItem
{
    private ?int $orderId;
    private int $productId;
    private string $productName;
    private int $quantity;
    private float $unitPrice;

    public function __construct(?int $orderId, int $productId, string $productName, int $quantity, float $unitPrice)
    {
        $this->orderId = $orderId;
        $this->productId = $productId;
        $this->productName = $productName;
        $this->quantity = $quantity;
        $this->unitPrice = $unitPrice;
    }

    public static function fromArray(array $row): self
    {
        return new self(
            isset($row['order_id']) ? (int) $row['order_id'] : null,
            (int) $row['product_id'],
            $row['product_name'] ?? '',
            (int) $row['quantity'],
            (float) $row['unit_price']
        );
    }

    public function withOrderId(int $orderId): self
    {
        return new self($orderId, $this->productId, $this->productName, $this->quantity, $this->unitPrice);
    }

    public function getOrderId(): ?int
    {
        return $this->orderId;
    }

    public function getProductId(): int
    {
        return $this->productId;
    }

    public function getProductName(): string
    {
        return $this->productName;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    public function getUnitPrice(): float
    {
        return $this->unitPrice;
    }
}

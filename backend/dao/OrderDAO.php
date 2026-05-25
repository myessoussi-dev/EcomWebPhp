<?php

require_once(__DIR__ . "/../models/CustomerOrder.php");
require_once(__DIR__ . "/../models/OrderItem.php");

class OrderDAO
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function create(CustomerOrder $order): int
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO customer_order (user_id, total)
            VALUES (?, ?)
        ");
        $stmt->execute([$order->getUserId(), $order->getTotal()]);

        return (int) $this->pdo->lastInsertId();
    }

    public function saveStripeSession(int $orderId, string $sessionId): void
    {
        $stmt = $this->pdo->prepare("
            UPDATE customer_order
            SET stripe_checkout_session_id = ?
            WHERE id = ?
        ");
        $stmt->execute([$sessionId, $orderId]);
    }

    public function findByStripeSession(string $sessionId): ?CustomerOrder
    {
        $stmt = $this->pdo->prepare("
            SELECT id, user_id, total, status, payment_status, stripe_checkout_session_id
            FROM customer_order
            WHERE stripe_checkout_session_id = ?
        ");
        $stmt->execute([$sessionId]);
        $order = $stmt->fetch();

        return $order ? CustomerOrder::fromArray($order) : null;
    }

    public function addItem(OrderItem $item): void
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO order_item (order_id, product_id, quantity, unit_price)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            $item->getOrderId(),
            $item->getProductId(),
            $item->getQuantity(),
            $item->getUnitPrice()
        ]);
    }

    public function findItems(int $orderId): array
    {
        $stmt = $this->pdo->prepare("
            SELECT order_id, product_id, quantity, unit_price
            FROM order_item
            WHERE order_id = ?
        ");
        $stmt->execute([$orderId]);

        return array_map(fn(array $row) => OrderItem::fromArray($row), $stmt->fetchAll());
    }

    public function markPaid(int $orderId, ?string $paymentIntentId): void
    {
        $stmt = $this->pdo->prepare("
            UPDATE customer_order
            SET status = 'paid',
                payment_status = 'paid',
                stripe_payment_intent_id = ?,
                paid_at = NOW()
            WHERE id = ?
        ");
        $stmt->execute([$paymentIntentId, $orderId]);
    }
}

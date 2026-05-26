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
            SELECT oi.order_id, oi.product_id, p.name AS product_name, oi.quantity, oi.unit_price
            FROM order_item oi
            INNER JOIN product p ON p.id = oi.product_id
            WHERE oi.order_id = ?
        ");
        $stmt->execute([$orderId]);

        return array_map(fn(array $row) => OrderItem::fromArray($row), $stmt->fetchAll());
    }

    public function findHistoryByEmail(string $email): array
    {
        $stmt = $this->pdo->prepare("
            SELECT co.id, co.total, co.status, co.payment_status, co.created_at, co.paid_at
            FROM customer_order co
            INNER JOIN user u ON u.id = co.user_id
            WHERE u.email = ?
            ORDER BY co.created_at DESC
        ");
        $stmt->execute([$email]);
        $orders = $stmt->fetchAll();

        return array_map(function (array $order): array {
            $items = array_map(function (OrderItem $item): array {
                return [
                    'product_id' => $item->getProductId(),
                    'product_name' => $item->getProductName(),
                    'quantity' => $item->getQuantity(),
                    'unit_price' => number_format($item->getUnitPrice(), 2, '.', ''),
                    'line_total' => number_format($item->getUnitPrice() * $item->getQuantity(), 2, '.', '')
                ];
            }, $this->findItems((int) $order['id']));

            return [
                'id' => (int) $order['id'],
                'total' => number_format((float) $order['total'], 2, '.', ''),
                'status' => $order['status'],
                'payment_status' => $order['payment_status'],
                'created_at' => $order['created_at'],
                'paid_at' => $order['paid_at'],
                'items' => $items
            ];
        }, $orders);
    }

    public function findInvoice(int $orderId, string $email): ?array
    {
        $stmt = $this->pdo->prepare("
            SELECT
                co.id,
                co.total,
                co.status,
                co.payment_status,
                co.created_at,
                co.paid_at,
                u.full_name,
                u.email,
                u.phone,
                u.address
            FROM customer_order co
            INNER JOIN user u ON u.id = co.user_id
            WHERE co.id = ? AND u.email = ?
        ");
        $stmt->execute([$orderId, $email]);
        $order = $stmt->fetch();

        if (!$order) {
            return null;
        }

        $items = array_map(function (OrderItem $item): array {
            return [
                'product_name' => $item->getProductName(),
                'quantity' => $item->getQuantity(),
                'unit_price' => $item->getUnitPrice(),
                'line_total' => $item->getUnitPrice() * $item->getQuantity()
            ];
        }, $this->findItems($orderId));

        return [
            'order' => [
                'id' => (int) $order['id'],
                'total' => (float) $order['total'],
                'status' => $order['status'],
                'payment_status' => $order['payment_status'],
                'created_at' => $order['created_at'],
                'paid_at' => $order['paid_at']
            ],
            'customer' => [
                'full_name' => $order['full_name'],
                'email' => $order['email'],
                'phone' => $order['phone'],
                'address' => $order['address']
            ],
            'items' => $items
        ];
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

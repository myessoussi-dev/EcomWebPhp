<?php

class InvoiceDAO
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Persist an invoice record for an order (upsert).
     */
    public function saveForOrder(int $orderId, string $fileName, string $filePath): void
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO invoice (order_id, file_name, file_path)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE file_name = VALUES(file_name), file_path = VALUES(file_path)
        ");
        $stmt->execute([$orderId, $fileName, $filePath]);
    }

    /**
     * Find an invoice by order ID.
     */
    public function findByOrderId(int $orderId): ?array
    {
        $stmt = $this->pdo->prepare("
            SELECT id, order_id, file_name, file_path, generated_at
            FROM invoice
            WHERE order_id = ?
        ");
        $stmt->execute([$orderId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}

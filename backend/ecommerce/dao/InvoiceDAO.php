<?php

require_once(__DIR__ . "/../models/Invoice.php");

class InvoiceDAO
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
        $this->ensureTable();
    }

    public function saveForOrder(int $orderId, string $fileName, string $filePath): Invoice
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO invoice (order_id, file_name, file_path)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                file_name = VALUES(file_name),
                file_path = VALUES(file_path),
                generated_at = CURRENT_TIMESTAMP
        ");
        $stmt->execute([$orderId, $fileName, $filePath]);

        return $this->findByOrderId($orderId);
    }

    public function findByOrderId(int $orderId): ?Invoice
    {
        $stmt = $this->pdo->prepare("
            SELECT id, order_id, file_name, file_path, generated_at
            FROM invoice
            WHERE order_id = ?
        ");
        $stmt->execute([$orderId]);
        $invoice = $stmt->fetch();

        return $invoice ? Invoice::fromArray($invoice) : null;
    }

    private function ensureTable(): void
    {
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS invoice (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL UNIQUE,
                file_name VARCHAR(180) NOT NULL,
                file_path VARCHAR(255) NOT NULL,
                generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_invoice_order
                    FOREIGN KEY (order_id)
                    REFERENCES customer_order(id)
                    ON DELETE CASCADE
            )
        ");
    }
}

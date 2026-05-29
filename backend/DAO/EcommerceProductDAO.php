<?php

require_once(__DIR__ . "/../Entity/EcommerceProduct.php");

class EcommerceProductDAO
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query("
            SELECT id, name, category, description, price, stock, image_color
            FROM product
            ORDER BY id"
            );

        return array_map(fn(array $row) => EcommerceProduct::fromArray($row), $stmt->fetchAll());
    }

    public function findForUpdate(int $id): ?EcommerceProduct
    {
        $stmt = $this->pdo->prepare("
            SELECT id, name, price, stock
            FROM product
            WHERE id = ? FOR UPDATE"
            );
        $stmt->execute([$id]);
        $product = $stmt->fetch();

        return $product ? EcommerceProduct::fromArray($product) : null;
    }

    public function decreaseStock(int $id, int $quantity): void
    {
        $stmt = $this->pdo->prepare("
            UPDATE product
            SET stock = stock - ?
            WHERE id = ? AND stock >= ?"
            );
        $stmt->execute([$quantity, $id, $quantity]);

        if ($stmt->rowCount() === 0) {
            throw new RuntimeException("Unable to decrease stock");
        }
    }
}

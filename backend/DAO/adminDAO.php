<?php

require_once __DIR__ . "/../Config/database.php";

class AdminDAO
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance();
    }


    public function getTotalRevenue(): float
    {
        $sql = "SELECT COALESCE(SUM(total), 0) AS revenue FROM customer_order";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return (float) $stmt->fetch(PDO::FETCH_ASSOC)['revenue'];
    }

    public function getOrdersCount(): int
    {
        $sql = "SELECT COUNT(*) AS orders FROM customer_order";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return (int) $stmt->fetch(PDO::FETCH_ASSOC)['orders'];
    }

    public function getAllOrders(): array
    {
        $sql = "
            SELECT 
                o.id,
                o.total,
                o.status,
                o.payment_status,
                o.created_at,
                u.username,
                u.email
            FROM customer_order o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getProductsCount(): int
    {
        $sql = "SELECT COUNT(*) AS products FROM product";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return (int) $stmt->fetch(PDO::FETCH_ASSOC)['products'];
    }
    public function getAllProducts(): array
    {
        $sql = "SELECT * FROM product ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllUsers(): array
    {
        $sql = "SELECT id, username, email, is_admin FROM users ORDER BY id DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

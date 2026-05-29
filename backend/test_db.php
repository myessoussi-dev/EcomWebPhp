<?php
require_once __DIR__ . '/Config/database.php';
try {
    $pdo = Database::connect();
    echo "Connected successfully\n";
    $stmt = $pdo->query("SELECT * FROM product");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Products in DB:\n";
    print_r($products);
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

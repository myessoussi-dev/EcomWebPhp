<?php
require_once __DIR__ . '/Config/database.php';
$pdo = Database::connect();
echo "Testing FOR UPDATE query...\n";
try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare("SELECT id, name, price, stock FROM product WHERE id = ? FOR UPDATE");
    $stmt->execute([1]);
    $product = $stmt->fetch();
    var_dump($product);
    $pdo->rollBack();
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
    if ($pdo->inTransaction()) $pdo->rollBack();
}

echo "\n--- Simulating full prepareOrderItems ---\n";
$items = [['product_id' => 1, 'quantity' => 1]];
try {
    $pdo->beginTransaction();
    foreach ($items as $item) {
        $productId = (int) ($item['product_id'] ?? 0);
        $quantity  = (int) ($item['quantity'] ?? 0);
        echo "product_id=$productId, quantity=$quantity\n";

        $stmt = $pdo->prepare("SELECT id, name, price, stock FROM product WHERE id = ? FOR UPDATE");
        $stmt->execute([$productId]);
        $p = $stmt->fetch();
        echo "Fetch result: "; var_dump($p);
        if (!$p) { echo "PRODUCT IS NULL\n"; } 
        else {
            $stock = (int) $p['stock'];
            echo "Stock=$stock, requested=$quantity\n";
            if ($stock < $quantity) echo "STOCK INSUFFICIENT\n";
            else echo "OK - product available\n";
        }
    }
    $pdo->rollBack();
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
    if ($pdo->inTransaction()) $pdo->rollBack();
}

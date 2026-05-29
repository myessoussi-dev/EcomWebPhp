<?php

require_once(__DIR__ . "/../core/Response.php");
require_once(__DIR__ . "/../DAO/OrderDAO.php");
require_once(__DIR__ . "/../DAO/EcommerceProductDAO.php");
require_once(__DIR__ . "/../Entity/CustomerOrder.php");
require_once(__DIR__ . "/../Entity/OrderItem.php");
require_once(__DIR__ . "/../Service/StripePaymentService.php");
require_once(__DIR__ . "/../middleware/AuthMiddleware.php");

class CheckoutController
{
    private PDO $pdo;
    private OrderDAO $orderDAO;
    private EcommerceProductDAO $productDAO;
    private StripePaymentService $paymentService;

    public function __construct(PDO $pdo, OrderDAO $orderDAO, EcommerceProductDAO $productDAO, StripePaymentService $paymentService)
    {
        $this->pdo = $pdo;
        $this->orderDAO = $orderDAO;
        $this->productDAO = $productDAO;
        $this->paymentService = $paymentService;
    }

    public function store(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::json(["error" => "Method not allowed"], 405);
            return;
        }

        // Enforce Authentication: user must be logged in to order
        $decoded = AuthMiddleware::authenticate();
        $userId = (int) $decoded->id;
        $email = $decoded->email;

        $payload = json_decode(file_get_contents('php://input'), true) ?: [];
        $customer = $payload['customer'] ?? [];
        $items = $payload['items'] ?? [];

        $fullName = trim($customer['full_name'] ?? $decoded->username ?? '');
        $phone = trim($customer['phone'] ?? '');
        $address = trim($customer['address'] ?? '');

        if ($phone === '' || $address === '' || empty($items)) {
            Response::json(["error" => "Phone, address and cart items are required"], 422);
            return;
        }

        try {
            $this->pdo->beginTransaction();

            // Update user profile info directly in the unified users table
            $stmt = $this->pdo->prepare("UPDATE users SET phone = ?, address = ? WHERE id = ?");
            $stmt->execute([$phone, $address, $userId]);

            [$orderItems, $total] = $this->prepareOrderItems($items);
            $orderId = $this->orderDAO->create(new CustomerOrder(null, $userId, $total));

            foreach ($orderItems as $item) {
                $this->orderDAO->addItem($item->withOrderId($orderId));
            }

            $session = $this->paymentService->createCheckoutSession($orderId, $email, $orderItems);
            $this->orderDAO->saveStripeSession($orderId, $session['id']);

            $this->pdo->commit();

            Response::json([
                "success" => true,
                "order_id" => $orderId,
                "total" => number_format($total, 2, '.', ''),
                "checkout_url" => $session['url']
            ]);
        } catch (Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            if (str_contains($e->getMessage(), 'STRIPE_SECRET_KEY')) {
                Response::json(["error" => "Stripe secret key is not configured"], 503);
                return;
            }

            Response::json(["error" => "Unable to confirm order: " . $e->getMessage()], 400);
        }
    }

    private function isValidCheckout(string $fullName, string $email, string $address, array $items): bool
    {
        return $fullName !== ''
            && filter_var($email, FILTER_VALIDATE_EMAIL)
            && $address !== ''
            && !empty($items);
    }

    private function prepareOrderItems(array $items): array
    {
        $orderItems = [];
        $total = 0;

        foreach ($items as $item) {
            $productId = (int) ($item['product_id'] ?? 0);
            $quantity = (int) ($item['quantity'] ?? 0);

            if ($productId <= 0 || $quantity <= 0) {
                throw new RuntimeException("Invalid cart item");
            }

            $product = $this->productDAO->findForUpdate($productId);

            if (!$product || $product->getStock() < $quantity) {
                throw new RuntimeException("Product unavailable");
            }

            $unitPrice = $product->getPrice();
            $total += $unitPrice * $quantity;
            $orderItems[] = new OrderItem(null, $productId, $product->getName(), $quantity, $unitPrice);
        }

        return [$orderItems, $total];
    }
}

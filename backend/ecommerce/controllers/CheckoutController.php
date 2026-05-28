<?php

require_once(__DIR__ . "/../core/Response.php");
require_once(__DIR__ . "/../dao/OrderDAO.php");
require_once(__DIR__ . "/../dao/ProductDAO.php");
require_once(__DIR__ . "/../dao/UserDAO.php");
require_once(__DIR__ . "/../models/CustomerOrder.php");
require_once(__DIR__ . "/../models/OrderItem.php");
require_once(__DIR__ . "/../models/User.php");
require_once(__DIR__ . "/../services/StripePaymentService.php");

class CheckoutController
{
    private PDO $pdo;
    private OrderDAO $orderDAO;
    private ProductDAO $productDAO;
    private UserDAO $userDAO;
    private StripePaymentService $paymentService;

    public function __construct(PDO $pdo, OrderDAO $orderDAO, ProductDAO $productDAO, UserDAO $userDAO, StripePaymentService $paymentService)
    {
        $this->pdo = $pdo;
        $this->orderDAO = $orderDAO;
        $this->productDAO = $productDAO;
        $this->userDAO = $userDAO;
        $this->paymentService = $paymentService;
    }

    public function store(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::json(["error" => "Method not allowed"], 405);
            return;
        }

        $payload = json_decode(file_get_contents('php://input'), true) ?: [];
        $customer = $payload['customer'] ?? [];
        $items = $payload['items'] ?? [];

        $fullName = trim($customer['full_name'] ?? '');
        $email = trim($customer['email'] ?? '');
        $phone = trim($customer['phone'] ?? '');
        $address = trim($customer['address'] ?? '');

        if (!$this->isValidCheckout($fullName, $email, $address, $items)) {
            Response::json(["error" => "Customer information and cart items are required"], 422);
            return;
        }

        try {
            $this->pdo->beginTransaction();

            $user = new User(null, $fullName, $email, $phone, $address);
            $userId = $this->userDAO->save($user);
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

            Response::json(["error" => "Unable to confirm order"], 400);
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

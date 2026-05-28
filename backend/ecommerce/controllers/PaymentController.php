<?php

require_once(__DIR__ . "/../core/Response.php");
require_once(__DIR__ . "/../dao/OrderDAO.php");
require_once(__DIR__ . "/../dao/ProductDAO.php");
require_once(__DIR__ . "/../services/StripePaymentService.php");

class PaymentController
{
    private PDO $pdo;
    private OrderDAO $orderDAO;
    private ProductDAO $productDAO;
    private StripePaymentService $paymentService;

    public function __construct(PDO $pdo, OrderDAO $orderDAO, ProductDAO $productDAO, StripePaymentService $paymentService)
    {
        $this->pdo = $pdo;
        $this->orderDAO = $orderDAO;
        $this->productDAO = $productDAO;
        $this->paymentService = $paymentService;
    }

    public function success(): void
    {
        $sessionId = trim($_GET['session_id'] ?? '');

        if ($sessionId === '') {
            Response::json(["error" => "Missing Stripe session id"], 422);
            return;
        }

        try {
            $session = $this->paymentService->retrieveCheckoutSession($sessionId);

            if (($session['payment_status'] ?? '') !== 'paid') {
                Response::json(["error" => "Payment is not confirmed"], 400);
                return;
            }

            $this->pdo->beginTransaction();

            $order = $this->orderDAO->findByStripeSession($sessionId);

            if (!$order) {
                throw new RuntimeException("Order not found");
            }

            if ($order->getPaymentStatus() !== 'paid') {
                foreach ($this->orderDAO->findItems((int) $order->getId()) as $item) {
                    $product = $this->productDAO->findForUpdate($item->getProductId());

                    if (!$product || $product->getStock() < $item->getQuantity()) {
                        throw new RuntimeException("Product unavailable");
                    }

                    $this->productDAO->decreaseStock($item->getProductId(), $item->getQuantity());
                }

                $this->orderDAO->markPaid((int) $order->getId(), $session['payment_intent'] ?? null);
            }

            $this->pdo->commit();

            Response::json([
                "success" => true,
                "order_id" => (int) $order->getId()
            ]);
        } catch (Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            Response::json(["error" => "Unable to confirm payment"], 400);
        }
    }
}

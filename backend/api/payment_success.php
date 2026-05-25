<?php
require_once(__DIR__ . "/../config/db.php");
require_once(__DIR__ . "/../config/stripe.php");
require_once(__DIR__ . "/../controllers/PaymentController.php");

$controller = new PaymentController(
    $pdo,
    new OrderDAO($pdo),
    new ProductDAO($pdo),
    new StripePaymentService($stripeConfig)
);
$controller->success();

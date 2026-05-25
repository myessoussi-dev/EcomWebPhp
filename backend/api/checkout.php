<?php
require_once(__DIR__ . "/../config/db.php");
require_once(__DIR__ . "/../config/stripe.php");
require_once(__DIR__ . "/../controllers/CheckoutController.php");

$controller = new CheckoutController(
    $pdo,
    new OrderDAO($pdo),
    new ProductDAO($pdo),
    new UserDAO($pdo),
    new StripePaymentService($stripeConfig)
);
$controller->store();

<?php
require_once(__DIR__ . "/../ecommerce/core/Cors.php");
allowCors();

require_once(__DIR__ . "/../ecommerce/config/db.php");
require_once(__DIR__ . "/../ecommerce/config/stripe.php");
require_once(__DIR__ . "/../ecommerce/controllers/CheckoutController.php");

$controller = new CheckoutController(
    $pdo,
    new OrderDAO($pdo),
    new ProductDAO($pdo),
    new UserDAO($pdo),
    new StripePaymentService($stripeConfig)
);
$controller->store();

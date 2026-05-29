<?php
require_once(__DIR__ . "/../core/Cors.php");
allowCors();

require_once(__DIR__ . "/../Config/db.php");
require_once(__DIR__ . "/../Config/stripe.php");
require_once(__DIR__ . "/../Controller/CheckoutController.php");

$controller = new CheckoutController(
    $pdo,
    new OrderDAO($pdo),
    new EcommerceProductDAO($pdo),
    new StripePaymentService($stripeConfig)
);
$controller->store();

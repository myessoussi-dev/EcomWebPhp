<?php
require_once(__DIR__ . "/../core/Cors.php");
allowCors();

require_once(__DIR__ . "/../Config/db.php");
require_once(__DIR__ . "/../Config/stripe.php");
require_once(__DIR__ . "/../Controller/PaymentController.php");
require_once(__DIR__ . "/../DAO/OrderDAO.php");
require_once(__DIR__ . "/../DAO/EcommerceProductDAO.php");
require_once(__DIR__ . "/../Service/StripePaymentService.php");

$controller = new PaymentController(
    $pdo,
    new OrderDAO($pdo),
    new EcommerceProductDAO($pdo),
    new StripePaymentService($stripeConfig)
);
$controller->success();

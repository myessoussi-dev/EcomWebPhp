<?php

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// Normalize the URI (remove trailing slashes, and trim leading/trailing spaces)
$uri = rtrim(trim($uri), '/');

// GET /products or /products.php or /api/products.php
if ($method === "GET" && ($uri === "/products" || $uri === "/products.php" || str_ends_with($uri, "/api/products.php"))) {
    $routeFound = true;
    require_once(__DIR__ . "/../Config/db.php");
    require_once(__DIR__ . "/../Controller/EcommerceProductController.php");
    $controller = new EcommerceProductController(new EcommerceProductDAO($pdo));
    $controller->index();
    exit;
}

// POST /checkout or /checkout.php or /api/checkout.php
if ($method === "POST" && ($uri === "/checkout" || $uri === "/checkout.php" || str_ends_with($uri, "/api/checkout.php"))) {
    $routeFound = true;
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
    exit;
}

// GET /orders or /orders.php or /api/orders.php
if ($method === "GET" && ($uri === "/orders" || $uri === "/orders.php" || str_ends_with($uri, "/api/orders.php"))) {
    $routeFound = true;
    require_once(__DIR__ . "/../Config/db.php");
    require_once(__DIR__ . "/../Controller/OrderController.php");
    require_once(__DIR__ . "/../DAO/InvoiceDAO.php");
    require_once(__DIR__ . "/../DAO/OrderDAO.php");
    require_once(__DIR__ . "/../Service/InvoicePdfService.php");
    $controller = new OrderController(
        new OrderDAO($pdo),
        new InvoiceDAO($pdo),
        new InvoicePdfService(),
        __DIR__ . "/../storage/invoices"
    );
    $controller->history();
    exit;
}

// POST /invoice or /invoice.php or /api/invoice.php
if ($method === "POST" && ($uri === "/invoice" || $uri === "/invoice.php" || str_ends_with($uri, "/api/invoice.php"))) {
    $routeFound = true;
    require_once(__DIR__ . "/../Config/db.php");
    require_once(__DIR__ . "/../Controller/OrderController.php");
    require_once(__DIR__ . "/../DAO/InvoiceDAO.php");
    require_once(__DIR__ . "/../DAO/OrderDAO.php");
    require_once(__DIR__ . "/../Service/InvoicePdfService.php");
    $controller = new OrderController(
        new OrderDAO($pdo),
        new InvoiceDAO($pdo),
        new InvoicePdfService(),
        __DIR__ . "/../storage/invoices"
    );
    $controller->invoice();
    exit;
}

// GET /payment-success or /payment_success.php or /api/payment_success.php
if ($method === "GET" && ($uri === "/payment-success" || $uri === "/payment_success.php" || str_ends_with($uri, "/api/payment_success.php"))) {
    $routeFound = true;
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
    exit;
}

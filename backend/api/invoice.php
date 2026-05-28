<?php
require_once(__DIR__ . "/../ecommerce/core/Cors.php");
allowCors();

require_once(__DIR__ . "/../ecommerce/config/db.php");
require_once(__DIR__ . "/../ecommerce/controllers/OrderController.php");

$controller = new OrderController(
    new OrderDAO($pdo),
    new InvoiceDAO($pdo),
    new InvoicePdfService(),
    __DIR__ . "/../storage/invoices"
);
$controller->invoice();

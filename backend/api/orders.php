<?php
require_once(__DIR__ . "/../config/db.php");
require_once(__DIR__ . "/../controllers/OrderController.php");

$controller = new OrderController(
    new OrderDAO($pdo),
    new InvoiceDAO($pdo),
    new InvoicePdfService(),
    __DIR__ . "/../storage/invoices"
);
$controller->history();

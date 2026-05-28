<?php
require_once(__DIR__ . "/../core/Cors.php");
allowCors();

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

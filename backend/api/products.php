<?php
require_once(__DIR__ . "/../ecommerce/core/Cors.php");
allowCors();

require_once(__DIR__ . "/../ecommerce/config/db.php");
require_once(__DIR__ . "/../ecommerce/controllers/ProductController.php");

$controller = new ProductController(new ProductDAO($pdo));
$controller->index();

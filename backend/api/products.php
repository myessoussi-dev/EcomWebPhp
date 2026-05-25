<?php
require_once(__DIR__ . "/../config/db.php");
require_once(__DIR__ . "/../controllers/ProductController.php");

$controller = new ProductController(new ProductDAO($pdo));
$controller->index();

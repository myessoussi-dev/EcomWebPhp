<?php
require_once(__DIR__ . "/../core/Cors.php");
allowCors();

require_once(__DIR__ . "/../Config/db.php");
require_once(__DIR__ . "/../Controller/EcommerceProductController.php");

$controller = new EcommerceProductController(new EcommerceProductDAO($pdo));
$controller->index();

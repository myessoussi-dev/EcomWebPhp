<?php

require_once __DIR__ . "/../Controller/AdminController.php";
require_once __DIR__ . "/../Middleware/AdminMiddleware.php";

header("Content-Type: application/json");

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if ($method === "GET" && ( $uri === "/admin/dashboard" || $uri === "/admin"
    || $uri === "/api/admin" || $uri === "/admin.php" || $uri === "/admin/dashboard.php")) {

    $routeFound = true;
    $controller = new AdminController();
    $admin = AdminMiddleware::authorize();

    $controller->dashboard($admin);

    exit;
}


if ($method === "GET" && ($uri === "/admin/orders" || $uri === "/admin/orders.php")) {

    $routeFound = true;
    $controller = new AdminController();
    $admin = AdminMiddleware::authorize();

    $controller->orders($admin);

    exit;
}

if ($method === "GET" && ($uri === "/admin/products" || $uri === "/admin/products.php")) {

    $routeFound = true;
    $controller = new AdminController();
    $admin = AdminMiddleware::authorize();

    $controller->products($admin);

    exit;
}

if ($method === "GET" && ($uri === "/admin/users" || $uri === "/admin/users.php")) {

    $routeFound = true;
    $controller = new AdminController();
    $admin = AdminMiddleware::authorize();

    $controller->users($admin);

    exit;
}

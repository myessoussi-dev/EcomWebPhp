<?php

require_once __DIR__ . "/../Controller/ProtectedController.php";

$protectedController = new ProtectedController();

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if ($method === "GET" && $uri === "/protected") {

    $routeFound = true;
    $protectedController->index();
    exit();
}
<?php

require_once __DIR__ . "/../controller/AuthController.php";

$controller = new AuthController();

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if ($method === "POST" && $uri === "/signup") {

    $routeFound = true;
    $controller->signup();

}

if ($method === "POST" && $uri === "/login") {

    $routeFound = true;
    $controller->login();

}

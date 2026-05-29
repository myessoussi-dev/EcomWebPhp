<?php

require_once __DIR__ . "/../Controller/AuthController.php";

$controller = new AuthController();

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if ($method === "POST" && $uri === "/signup") {

    $routeFound = true;
    $controller->signup();
    exit();

}

if ($method === "POST" && $uri === "/login") {

    $routeFound = true;
    $controller->login();
    exit();
}

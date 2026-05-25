<?php

require_once __DIR__ . "/../controller/AuthController.php";

$controller = new AuthController();

$method = $_SERVER["REQUEST_METHOD"];
$uri = $_SERVER["REQUEST_URI"];

if ($method === "POST" && str_contains($uri, "/signup")) {

    $controller->signup();

} elseif ($method === "POST" && str_contains($uri, "/login")) {

    $controller->login();

} else {

    echo json_encode([
        "message" => "Route not found"
    ]);
}

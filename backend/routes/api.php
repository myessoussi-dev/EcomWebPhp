<?php

require_once __DIR__ . "/../controller/ProtectedController.php";

$method = $_SERVER["REQUEST_METHOD"];
$uri = $_SERVER["REQUEST_URI"];

$protectedController = new ProtectedController();

if ($method === "GET" && str_contains($uri, "/protected")) {

    $protectedController->index();

} else {

    http_response_code(404);

    echo json_encode([
        "message" => "Route not found"
    ]);
}
<?php

header("Content-Type: application/json");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

$routeFound = false;

require_once __DIR__ . "/../routes/auth.php";
require_once __DIR__ . "/../routes/protected.php";

if (!$routeFound) {

    http_response_code(404);

    echo json_encode([
        "message" => "Route not found"
    ]);
}
<?php

require_once __DIR__ . "/../middleware/AuthMiddleware.php";

class ProtectedController {

    public function index(): void
    {

        $user = AuthMiddleware::authenticate();

        echo json_encode([
            "success" => true,
            "message" => "You accessed a protected route",
            "user" => $user
        ]);
    }
}
<?php

require_once __DIR__ . "/../service/AuthService.php";

class AuthController {

    private AuthService $authService;

    public function __construct() {

        $this->authService = new AuthService();
    }

    public function signup(): void
    {

        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $success = $this->authService->signup(
            $data["username"],
            $data["email"],
            $data["YOUR_DB_PASSWORD"]
        );

        echo json_encode([
            "success" => $success
        ]);
    }

    public function login(): void
    {

        $data = json_decode(
            file_get_contents("php://input"),
            true
        );

        $token = $this->authService->login(
            $data["email"],
            $data["YOUR_DB_PASSWORD"]
        );

        if ($token) {

            echo json_encode([
                "success" => true,
                "token" => $token
            ]);

        } else {

            echo json_encode([
                "success" => false,
                "message" => "Invalid credentials"
            ]);
        }
    }
}

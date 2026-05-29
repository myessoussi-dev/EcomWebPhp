<?php

require_once __DIR__ . "/../Service/AuthService.php";

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

        if (!is_array($data) || empty($data["username"]) || empty($data["email"]) || empty($data["YOUR_DB_PASSWORD"])) {
            http_response_code(422);
            echo json_encode([
                "success" => false,
                "message" => "Username, email and YOUR_DB_PASSWORD are required"
            ]);
            return;
        }

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

        if (!is_array($data) || empty($data["email"]) || empty($data["YOUR_DB_PASSWORD"])) {
            http_response_code(422);
            echo json_encode([
                "success" => false,
                "message" => "Email and YOUR_DB_PASSWORD are required"
            ]);
            return;
        }

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
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Invalid credentials"
            ]);
        }
    }
}

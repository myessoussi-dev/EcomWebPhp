<?php

require_once __DIR__ . "/../service/AuthService.php";

class AuthController {

    private $authService;

    public function __construct() {

        $this->authService = new AuthService();
    }

    public function signup() {

        $data = json_decode(file_get_contents("php://input"), true);

        $success = $this->authService->signup(
            $data["username"],
            $data["email"],
            $data["YOUR_DB_PASSWORD"]
        );

        echo json_encode([
            "success" => $success
        ]);
    }

    public function login() {

        $data = json_decode(file_get_contents("php://input"), true);

        $user = $this->authService->login(
            $data["email"],
            $data["YOUR_DB_PASSWORD"]
        );

        if ($user) {

            session_start();

            $_SESSION["user_id"] = $user["id"];

            echo json_encode([
                "success" => true,
                "message" => "Login successful"
            ]);

        } else {

            echo json_encode([
                "success" => false,
                "message" => "Invalid credentials"
            ]);
        }
    }
}

<?php

require_once __DIR__ . "/../config/JwtConfig.php";
require_once __DIR__ . "/../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware {

    public static function authenticate() {

        $headers = getallheaders();

        if (!isset($headers["Authorization"])) {

            http_response_code(401);

            echo json_encode([
                "message" => "Token missing"
            ]);

            exit;
        }

        $authHeader = $headers["Authorization"];

        $token = str_replace(
            "Bearer ",
            "",
            $authHeader
        );

        try {

            $decoded = JWT::decode(
                $token,
                new Key(
                    JwtConfig::$SECRET_KEY,
                    "HS256"
                )
            );

            return $decoded;

        } catch(Exception $e) {

            http_response_code(401);

            echo json_encode([
                "message" => "Invalid token"
            ]);

            exit;
        }
    }
}
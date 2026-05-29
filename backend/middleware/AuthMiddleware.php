<?php

require_once __DIR__ . "/../Config/JwtConfig.php";
require_once __DIR__ . "/../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware {

    public static function authenticate() {

        $headers = getallheaders();

        if (!isset($headers["Authorization"])) {

            http_response_code(401);
            echo json_encode(["message" => "Token missing"]);
            exit;
        }

        $token = str_replace("Bearer ", "", $headers["Authorization"]);

        try {
            return JWT::decode(
                $token,
                new Key(JwtConfig::getSecret(), "HS256")
            );
        } catch (Exception $e) {
            // ignore and try admin
        }

        try {
            return JWT::decode(
                $token,
                new Key(JwtConfig::getAdminSecret(), "HS256")
            );
        } catch (Exception $e) {

            http_response_code(401);
            echo json_encode(["message" => "Invalid token"]);
            exit;
        }
    }
}
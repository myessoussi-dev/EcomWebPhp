<?php

require_once __DIR__ . "/AuthMiddleware.php";

class AdminMiddleware {

    public static function authorize() {

        $user = AuthMiddleware::authenticate();

        if (empty($user->is_admin)) {

            http_response_code(403);
            echo json_encode([
                "message" => "Access denied: Admins only"
            ]);
            exit;
        }

        return $user;
    }
}
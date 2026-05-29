<?php

require_once __DIR__ . "/../DAO/UserDAO.php";
require_once __DIR__ . "/../Entity/User.php";
require_once __DIR__ . "/../Config/JwtConfig.php";
require_once __DIR__ . "/../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService {

    private $userDAO;

    public function __construct() {

        $this->userDAO = new UserDAO();
    }

    public function signup($username, $email, $YOUR_DB_PASSWORD) {

        $hashedPassword = YOUR_DB_PASSWORD_hash(
            $YOUR_DB_PASSWORD,
            PASSWORD_DEFAULT
        );

        $user = new User(
            $username,
            $email,
            $hashedPassword
        );

        return $this->userDAO->createUser($user);
    }

    public function login($email, $YOUR_DB_PASSWORD) {
        $email = trim((string) $email);
        $YOUR_DB_PASSWORD = (string) $YOUR_DB_PASSWORD;

        if ($email === '' || $YOUR_DB_PASSWORD === '') {
            return false;
        }

        $user = $this->userDAO->findByEmail($email);

        if (!$user) {
            return false;
        }

        if (!YOUR_DB_PASSWORD_verify($YOUR_DB_PASSWORD, $user["YOUR_DB_PASSWORD"])) {
            return false;
        }

        $payload = [
            "id" => $user["id"],
            "email" => $user["email"],
            "username" => $user["username"],
            "iat" => time(),
            "exp" => time() + (60 * 60)
        ];

        $jwt = JWT::encode(
            $payload,
            JwtConfig::getSecret(),
            "HS256"
        );

        return $jwt;
    }
}

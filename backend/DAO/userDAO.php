<?php

require_once __DIR__ . "/../config/database.php";

class UserDAO {

    private $conn;

    public function __construct() {

        $database = new Database();
        $this->conn = $database->connect();
    }

    public function createUser($user): bool
    {

        $sql = "INSERT INTO users(username, email, YOUR_DB_PASSWORD)
                VALUES(:username, :email, :YOUR_DB_PASSWORD)";

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ":username" => $user->username,
            ":email" => $user->email,
            ":YOUR_DB_PASSWORD" => $user->YOUR_DB_PASSWORD
        ]);
    }

    public function findByEmail($email) {

        $sql = "SELECT * FROM users WHERE email = :email";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            ":email" => $email
        ]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
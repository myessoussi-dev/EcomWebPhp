<?php

require_once __DIR__ . "/../Config/database.php";

class UserDAO {

    private ?PDO $conn;

    public function __construct() {

        $this->conn = Database::getInstance();
    }

    public function createUser($user): bool
    {

        $sql = "INSERT INTO users(username, email, YOUR_DB_PASSWORD, phone, address)
                VALUES(:username, :email, :YOUR_DB_PASSWORD, :phone, :address)";

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ":username" => $user->username,
            ":email" => $user->email,
            ":YOUR_DB_PASSWORD" => $user->YOUR_DB_PASSWORD,
            ":phone" => $user->phone,
            ":address" => $user->address
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
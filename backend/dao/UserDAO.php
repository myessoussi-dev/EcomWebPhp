<?php

require_once(__DIR__ . "/../models/User.php");

class UserDAO
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function save(User $user): int
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO user (full_name, email, phone, address)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                full_name = VALUES(full_name),
                phone = VALUES(phone),
                address = VALUES(address)
        ");
        $stmt->execute([
            $user->getFullName(),
            $user->getEmail(),
            $user->getPhone(),
            $user->getAddress()
        ]);

        return $this->findIdByEmail($user->getEmail());
    }

    private function findIdByEmail(string $email): int
    {
        $stmt = $this->pdo->prepare("SELECT id FROM user WHERE email = ?");
        $stmt->execute([$email]);

        return (int) $stmt->fetchColumn();
    }
}

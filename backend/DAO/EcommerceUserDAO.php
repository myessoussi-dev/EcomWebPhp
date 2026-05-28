<?php

require_once(__DIR__ . "/../Entity/EcommerceUser.php");

class EcommerceUserDAO
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Persist an EcommerceUser and return the generated ID.
     */
    public function save(EcommerceUser $user): int
    {
        // Check if a user with this email already exists
        $stmt = $this->pdo->prepare("SELECT id FROM user WHERE email = :email");
        $stmt->execute([':email' => $user->getEmail()]);
        $existingId = $stmt->fetchColumn();

        if ($existingId !== false) {
            // Update existing user's information
            $stmt = $this->pdo->prepare(
                "UPDATE user SET full_name = :full_name, phone = :phone, address = :address WHERE id = :id"
            );
            $stmt->execute([
                ':full_name' => $user->getFullName(),
                ':phone'     => $user->getPhone(),
                ':address'   => $user->getAddress(),
                ':id'        => (int) $existingId,
            ]);
            return (int) $existingId;
        }

        // Insert new user
        $stmt = $this->pdo->prepare(
            "INSERT INTO user (full_name, email, phone, address) VALUES (:full_name, :email, :phone, :address)"
        );
        $stmt->execute([
            ':full_name' => $user->getFullName(),
            ':email'     => $user->getEmail(),
            ':phone'     => $user->getPhone(),
            ':address'   => $user->getAddress(),
        ]);
        return (int) $this->pdo->lastInsertId();
    }
}

<?php


class Database
{

    private $host = "localhost";
    private $dbName = "ecomdb";
    private $username = "root";
    private $YOUR_DB_PASSWORD = "YOUR_DB_PASSWORD";

    public function connect()
    {

        try {

            $pdo = new PDO(
                "mysql:host={$this->host};dbname={$this->dbName};charset=utf8",
                $this->username,
                $this->YOUR_DB_PASSWORD
            );

            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $pdo;

        } catch (PDOException $e) {

            die("Database connection failed: " . $e->getMessage());
        }
    }
}
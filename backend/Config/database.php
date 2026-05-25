<?php


class Database
{

    private static $host = "localhost";
    private static $dbName = "ecomdb";
    private static $username = "root";
    private static $YOUR_DB_PASSWORD = "YOUR_DB_PASSWORD";

    private static ?PDO $pdo = null;

    public static function connect(): void
    {

        try {

            self::$pdo = new PDO(
                "mysql:host=" .self::$host. ";dbname=" .self::$dbName .";charset=utf8",
                self::$username,
                self::$YOUR_DB_PASSWORD
            );

            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


        } catch (PDOException $e) {

            die("Database connection failed: " . $e->getMessage());
        }
    }
    public static function getInstance()
    {
        if (self::$pdo === null) {
            self::connect();
        }
        return self::$pdo;
    }
}
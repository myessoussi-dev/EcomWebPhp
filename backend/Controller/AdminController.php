<?php

require_once __DIR__ . "/../DAO/AdminDAO.php";

class AdminController {

    private AdminDAO $adminDAO;

    public function __construct() {
        $this->adminDAO = new AdminDAO();
    }

    public function dashboard($admin): void
    {
        echo json_encode([
            "success" => true,
            "message" => "Admin dashboard",
            "data" => [
                "revenue" => $this->adminDAO->getTotalRevenue(),
                "orders_count" => $this->adminDAO->getOrdersCount(),
                "products_count" => $this->adminDAO->getProductsCount() ,
                "data" => $this->adminDAO->getAllOrders()
            ]
        ]);
    }

    public function orders($admin): void
    {
        echo json_encode([
            "success" => true,
            "data" => $this->adminDAO->getAllOrders()
        ]);
    }

    public function products($admin): void
    {
        echo json_encode([
            "success" => true,
            "data" => $this->adminDAO->getAllProducts()
        ]);
    }
}
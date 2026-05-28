<?php

require_once(__DIR__ . "/../core/Response.php");
require_once(__DIR__ . "/../DAO/EcommerceProductDAO.php");

class EcommerceProductController
{
    private EcommerceProductDAO $productDAO;

    public function __construct(EcommerceProductDAO $productDAO)
    {
        $this->productDAO = $productDAO;
    }

    public function index(): void
    {
        try {
            Response::json(["products" => $this->productDAO->findAll()]);
        } catch (Throwable $e) {
            Response::json(["error" => "Unable to load products: " . $e->getMessage()], 500);
        }
    }
}

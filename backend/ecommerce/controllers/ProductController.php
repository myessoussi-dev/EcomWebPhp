<?php

require_once(__DIR__ . "/../core/Response.php");
require_once(__DIR__ . "/../dao/ProductDAO.php");

class ProductController
{
    private ProductDAO $productDAO;

    public function __construct(ProductDAO $productDAO)
    {
        $this->productDAO = $productDAO;
    }

    public function index(): void
    {
        try {
            Response::json(["products" => $this->productDAO->findAll()]);
        } catch (Throwable $e) {
            Response::json(["error" => "Unable to load products"], 500);
        }
    }
}

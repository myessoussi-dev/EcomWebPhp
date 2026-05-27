<?php
namespace EcomWebPhp\Backend\Controller;

use EcomWebPhp\Backend\Entity\Product;
use EcomWebPhp\Backend\Exception\ProductNotFoundException;
use EcomWebPhp\Backend\Service\ProductService;
use Exception;
use InvalidArgumentException;

use function EcomWebPhp\Backend\Helper\sendJsonResponse;

class ProductController
{
  private ProductService $productService;
  public function __construct()
  {
    $this->productService = new ProductService();
  }
  public function index()
  {
    try {
      $products = $this->productService->findAll();
      $data = array_map(fn($prouduct) => $this->productService->toArray($prouduct), $products);
      sendJsonResponse(200, $data);


    } catch (Exception $e) {
      sendJsonResponse(500, ['error' => $e->getMessage()]);
    }
  }
  public function create(): void
  {
    try {
      $json_body = json_decode(file_get_contents('php://input'), true);
      if ($json_body == false || $json_body == null) {
        sendJsonResponse(400, ['error' => 'Invalid Json Body']);
        return;
      }
      $product = new Product();
      $product->setName($json_body['name'] ?? null);
      $product->setPrice($json_body['price'] ?? null);
      $product->setStock($json_body['stock'] ?? null);
      $product->setCategoryId($json_body['category_id'] ?? null);
      $product->setImgUrl($json_body['img_url'] ?? null);
      $this->productService->save($product);
      sendJsonResponse(201, ['message' => 'product created with success']);
    } catch (InvalidArgumentException $e) {
      sendJsonResponse(400, ['error' => 'bad request']);
    } catch (Exception $e) {
      sendJsonResponse(500, ['error' => 'internal server error']);
    }
  }
  public function show(int $id)
  {
    try {
      $product = $this->productService->findById($id);
      sendJsonResponse(200, $this->productService->toArray($product));
    } catch (ProductNotFoundException $e) {
      sendJsonResponse($e->getCode(), ['message' => $e->getMessage()]);
    } catch (Exception $e) {
      sendJsonResponse(500, ['message' => $e->getMessage()]);
    }
  }
  public function delete(int $id)
  {
    try {
      $this->productService->deleteById($id);
      sendJsonResponse(200, ['message' => 'product deleted with success']);
    } catch (InvalidArgumentException $e) {
      sendJsonResponse(404, ['message' => $e->getMessage()]);
    } catch (Exception $e) {
      sendJsonResponse(500, ['message' => 'internal server error']);
    }
  }
}
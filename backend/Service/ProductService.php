<?php
namespace EcomWebPhp\Backend\Service;

use EcomWebPhp\Backend\DAO\CategoryDAO;
use EcomWebPhp\Backend\DAO\ProductDAO;

use EcomWebPhp\Backend\Entity\Product;
use EcomWebPhp\Backend\Exception\ProductNotFoundException;

class ProductService
{
  private ProductDAO $productDAO;
  private CategoryDAO $categoryDAO;
  public function __construct()
  {
    $this->productDAO = new ProductDAO();
    $this->categoryDAO = new CategoryDAO();
  }
  public function save(Product $product): void
  {
    if (empty($product->getName())) {
      throw new \InvalidArgumentException("Product should have a name");

    }
    if (empty($product->getPrice()) || $product->getPrice()) {
      throw new \InvalidArgumentException("Product should have a valid price");

    }
    if (empty($product->getStock()) || $product->getStock() < 0) {
      throw new \InvalidArgumentException("Product should have a valid stock");

    }
    if (empty($product->getCategoryId())) {
      throw new \InvalidArgumentException("Product should have  a Category id");
    }
    // if the category id doesnt exit it should throw an exception
    //TODO define existsById in CategoryDAO
    if ($this->categoryDAO->existsById($product->getId()) == false) {
      throw new \InvalidArgumentException("The category Id: " . $product->getCategoryId() . " doesnt exist");
    }
    $this->productDAO->save($product);
  }
  public function deleteById(int $id): void
  {
    if (!$this->productDAO->existsById($id)) {
      throw new \InvalidArgumentException("the id: " . $id . " doesnt exist");
    }
    $this->productDAO->deleteById($id);
  }
  public function findAll(): array
  {
    return $this->productDAO->findAll();
  }
  public function findById(int $id): ?Product
  {
    $product = $this->productDAO->findById($id);
    if ($product == null) {
      throw new ProductNotFoundException();
    }
    return $product;
  }
  public function toArray(Product $product): array
  {
    $array = $product->toArray();
    // TODO define the method toArray in CategorieEntity
    // TODO define the method findById in CategorieDAO
    $categorie = $this->categoryDAO->findById($product->getCategoryId());
    $array['category'] = $categorie->toArray();
    return $array;
  }
}
<?php
namespace EcomWebPhp\Backend\DAO;

use EcomWebPhp\Backend\Config\Database;
use EcomWebPhp\Backend\Entity\Product;
use PDO;


class ProductDAO
{
  private PDO $db;
  public function __construct()
  {
    $this->db = Database::getInstance();
  }
  private function mapToProduct(array $row): Product
  {
    $p = new Product();
    $p->setId($row['id']);
    $p->setName($row['name']);
    $p->setCategoryId($row['category_id']);
    $p->setPrice($row['price']);
    $p->setStock($row['stock']);
    $p->setImgUrl($row['img_url']);
    return $p;
  }
  public function findAll(): array
  {
    $statement = $this->db->query("select * from products");
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
    $products = [];
    return array_map(fn($row) => $this->mapToProduct($row), $rows);

  }
  public function findById(int $id): ?Product
  {
    $statement = $this->db->prepare("select * from products where id = :id");
    $statement->execute(['id' => $id]);
    $row = $statement->fetch(PDO::FETCH_ASSOC);
    if ($row == false) {
      return null;
    } else {
      return $this->mapToProduct($row);
    }
  }
  public function deleteById(int $id): void
  {
    $statement = $this->db->prepare("delete from products where id = :id");
    $statement->execute(['id' => $id]);
  }
  public function existsById(int $id): bool
  {
    $statement = $this->db->prepare("select 1 from products where id = :id");
    $statement->execute(['id' => $id]);
    $row = $statement->fetch(PDO::FETCH_ASSOC);
    return $row !== false;
  }
  public function save(Product $product)
  {
    $statement = $this->db->prepare(
      "insert into products(name, price, stock, category_id, img_url) 
       values("
      . $product->getName() .
      ","
      . $product->getPrice()
      . ","
      . $product->getStock()
      . ","
      . $product->getCategoryId()
      . ","
      . $product->getImgUrl()
      . ")"
    );
  }


}
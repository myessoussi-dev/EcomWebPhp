<?php


namespace EcomWebPhp\Backend\Entity;
class Product
{
  private ?int $id = null;
  private ?string $name = null;
  private ?float $price = null;
  private ?string $imgUrl = null;
  private ?int $stock;
  private ?int $categoryId = null;


  // getters
  public function getId(): ?int
  {
    return $this->id;
  }
  public function getName(): ?string
  {
    return $this->name;
  }
  public function getPrice(): ?float
  {
    return $this->price;
  }
  public function getCategoryId(): ?int
  {
    return $this->categoryId;
  }
  public function getStock(): ?int
  {
    return $this->stock;
  }

  public function getImgUrl(): ?string
  {
    return $this->imgUrl;
  }
  // setters
  public function setId(int $id): void
  {
    $this->id = $id;
  }
  public function setName(string $name): void
  {
    $this->name = $name;
  }
  public function setPrice(float $price): void
  {
    $this->price = $price;
  }
  public function setCategoryId(int $categoryId): void
  {
    $this->categoryId = $categoryId;
  }
  public function setStock(int $stock): void
  {
    $this->stock = $stock;
  }
  public function setImgUrl(string $imgUrl): void
  {
    $this->imgUrl = $imgUrl;
  }
  public function toArray(): array
  {
    return [
      "id" => $this->id,
      "name" => $this->name,
      "price" => $this->price,
      "imgUrl" => $this->imgUrl,
      "stock" => $this->stock
    ];
  }
}
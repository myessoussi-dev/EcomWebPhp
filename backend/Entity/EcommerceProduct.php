<?php

class EcommerceProduct implements JsonSerializable
{
    private ?int $id;
    private string $name;
    private string $category;
    private ?string $description;
    private float $price;
    private int $stock;
    private string $imageColor;
    private ?string $imageUrl;

    public function __construct(?int $id, string $name, string $category, ?string $description, float $price, int $stock, string $imageColor, ?string $imageUrl = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->category = $category;
        $this->description = $description;
        $this->price = $price;
        $this->stock = $stock;
        $this->imageColor = $imageColor;
        $this->imageUrl = $imageUrl;
    }

    public static function fromArray(array $row): self
    {
        return new self(
            isset($row['id']) ? (int) $row['id'] : null,
            $row['name'],
            $row['category'] ?? '',
            $row['description'] ?? null,
            (float) $row['price'],
            (int) $row['stock'],
            $row['image_color'] ?? '#2563eb',
            $row['image_url'] ?? null
        );
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function getStock(): int
    {
        return $this->stock;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'description' => $this->description,
            'price' => number_format($this->price, 2, '.', ''),
            'stock' => $this->stock,
            'image_color' => $this->imageColor,
            'image' => $this->imageUrl,
            'imageUrl' => $this->imageUrl
        ];
    }
}

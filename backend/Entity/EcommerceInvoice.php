<?php

class EcommerceInvoice
{
    private ?int $id;
    private int $orderId;
    private string $fileName;
    private string $filePath;
    private ?string $generatedAt;

    public function __construct(?int $id, int $orderId, string $fileName, string $filePath, ?string $generatedAt = null)
    {
        $this->id = $id;
        $this->orderId = $orderId;
        $this->fileName = $fileName;
        $this->filePath = $filePath;
        $this->generatedAt = $generatedAt;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            isset($data['id']) ? (int) $data['id'] : null,
            (int) $data['order_id'],
            $data['file_name'],
            $data['file_path'],
            $data['generated_at'] ?? null
        );
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrderId(): int
    {
        return $this->orderId;
    }

    public function getFileName(): string
    {
        return $this->fileName;
    }

    public function getFilePath(): string
    {
        return $this->filePath;
    }

    public function getGeneratedAt(): ?string
    {
        return $this->generatedAt;
    }
}

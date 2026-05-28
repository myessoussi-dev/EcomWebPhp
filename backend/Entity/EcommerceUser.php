<?php

class EcommerceUser
{
    private ?int $id;
    private string $fullName;
    private string $email;
    private string $phone;
    private string $address;

    public function __construct(?int $id, string $fullName, string $email, string $phone, string $address)
    {
        $this->id = $id;
        $this->fullName = $fullName;
        $this->email = $email;
        $this->phone = $phone;
        $this->address = $address;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFullName(): string
    {
        return $this->fullName;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPhone(): string
    {
        return $this->phone;
    }

    public function getAddress(): string
    {
        return $this->address;
    }
}

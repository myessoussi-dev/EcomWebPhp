<?php

class User
{

    public $id;
    public $username;
    public $email;
    public $YOUR_DB_PASSWORD;
    public $phone;
    public $address;

    public function __construct($username, $email, $YOUR_DB_PASSWORD, $phone = null, $address = null)
    {
        $this->username = $username;
        $this->email = $email;
        $this->YOUR_DB_PASSWORD = $YOUR_DB_PASSWORD;
        $this->phone = $phone;
        $this->address = $address;
    }
}
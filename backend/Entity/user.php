<?php

namespace EcomWebPhp\Backend\Entity;
class User
{

    public $id;
    public $username;
    public $email;
    public $YOUR_DB_PASSWORD;

    public function __construct($username, $email, $YOUR_DB_PASSWORD)
    {

        $this->username = $username;
        $this->email = $email;
        $this->YOUR_DB_PASSWORD = $YOUR_DB_PASSWORD;
    }
}
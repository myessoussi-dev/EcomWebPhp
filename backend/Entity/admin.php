<?php
 class admin extends User
 {
     private bool $isAdmin;
     public function __construct(string $username, string $email, string $YOUR_DB_PASSWORD , bool $isAdmin){
         parent::__construct($username, $email, $YOUR_DB_PASSWORD);
         $this->isAdmin = $isAdmin;
     }
 }
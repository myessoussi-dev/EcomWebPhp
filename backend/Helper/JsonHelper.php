<?php
namespace EcomWebPhp\Backend\Helper;

function sendJsonResponse(int $code, array $data): void
{
  http_response_code($code);
  header('Content-Type: application/json');
  echo json_encode($data);
  exit;
}
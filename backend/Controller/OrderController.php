<?php

require_once(__DIR__ . "/../core/Response.php");
require_once(__DIR__ . "/../DAO/InvoiceDAO.php");
require_once(__DIR__ . "/../DAO/OrderDAO.php");
require_once(__DIR__ . "/../Service/InvoicePdfService.php");

class OrderController
{
    private OrderDAO $orderDAO;
    private InvoiceDAO $invoiceDAO;
    private InvoicePdfService $invoicePdfService;
    private string $invoiceDirectory;

    public function __construct(OrderDAO $orderDAO, InvoiceDAO $invoiceDAO, InvoicePdfService $invoicePdfService, string $invoiceDirectory)
    {
        $this->orderDAO = $orderDAO;
        $this->invoiceDAO = $invoiceDAO;
        $this->invoicePdfService = $invoicePdfService;
        $this->invoiceDirectory = $invoiceDirectory;
    }

    public function history(): void
    {
        $email = trim($_GET['email'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::json(["error" => "Valid email is required"], 422);
            return;
        }

        try {
            Response::json(["orders" => $this->orderDAO->findHistoryByEmail($email)]);
        } catch (Throwable $e) {
            Response::json(["error" => "Unable to load order history"], 500);
        }
    }

    public function invoice(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::json(["error" => "Method not allowed"], 405);
            return;
        }

        $payload = json_decode(file_get_contents('php://input'), true) ?: [];
        $orderId = (int) ($payload['order_id'] ?? 0);
        $email = trim($payload['email'] ?? '');

        if ($orderId <= 0 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::json(["error" => "Order id and valid email are required"], 422);
            return;
        }

        $invoice = $this->orderDAO->findInvoice($orderId, $email);

        if (!$invoice) {
            Response::json(["error" => "Invoice not found"], 404);
            return;
        }

        if ($invoice['order']['payment_status'] !== 'paid') {
            Response::json(["error" => "Invoice is available after payment"], 403);
            return;
        }

        try {
            $pdf = $this->invoicePdfService->generate($invoice);
            $fileName = $this->invoicePdfService->fileName($orderId);
            $this->invoicePdfService->save($pdf, $this->invoiceDirectory, $fileName);
            $this->invoiceDAO->saveForOrder($orderId, $fileName, "backend/storage/invoices/" . $fileName);
        } catch (Throwable $e) {
            Response::json(["error" => "Unable to generate invoice: " . $e->getMessage()], 500);
            return;
        }

        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="' . $fileName . '"');
        header('X-Invoice-Saved: true');
        header('Content-Length: ' . strlen($pdf));
        echo $pdf;
    }
}

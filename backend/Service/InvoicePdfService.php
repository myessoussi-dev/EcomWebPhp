<?php

class InvoicePdfService
{
    public function fileName(int $orderId): string
    {
        return "facture-" . $orderId . ".pdf";
    }

    public function save(string $pdf, string $directory, string $fileName): string
    {
        if (!is_dir($directory) && !mkdir($directory, 0775, true)) {
            throw new RuntimeException("Unable to create invoice directory");
        }

        $filePath = rtrim($directory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;

        if (file_put_contents($filePath, $pdf) === false) {
            throw new RuntimeException("Unable to save invoice PDF");
        }

        return $filePath;
    }

    public function generate(array $invoice): string
    {
        $order = $invoice['order'];
        $customer = $invoice['customer'];
        $items = $invoice['items'];

        $lines = [
            ['x' => 50, 'y' => 790, 'size' => 20, 'text' => 'Facture #' . $order['id']],
            ['x' => 50, 'y' => 760, 'size' => 11, 'text' => 'ShopNow'],
            ['x' => 50, 'y' => 742, 'size' => 10, 'text' => 'Date commande: ' . $order['created_at']],
            ['x' => 50, 'y' => 724, 'size' => 10, 'text' => 'Statut paiement: ' . $order['payment_status']],
            ['x' => 50, 'y' => 690, 'size' => 12, 'text' => 'Client'],
            ['x' => 50, 'y' => 670, 'size' => 10, 'text' => 'Nom: ' . $customer['full_name']],
            ['x' => 50, 'y' => 652, 'size' => 10, 'text' => 'Email: ' . $customer['email']],
            ['x' => 50, 'y' => 634, 'size' => 10, 'text' => 'Telephone: ' . ($customer['phone'] ?: '-')],
            ['x' => 50, 'y' => 616, 'size' => 10, 'text' => 'Adresse: ' . $customer['address']],
            ['x' => 50, 'y' => 580, 'size' => 12, 'text' => 'Produits'],
            ['x' => 50, 'y' => 558, 'size' => 10, 'text' => 'Produit'],
            ['x' => 320, 'y' => 558, 'size' => 10, 'text' => 'Qte'],
            ['x' => 370, 'y' => 558, 'size' => 10, 'text' => 'Prix'],
            ['x' => 450, 'y' => 558, 'size' => 10, 'text' => 'Total']
        ];

        $y = 535;
        foreach ($items as $item) {
            $lines[] = ['x' => 50, 'y' => $y, 'size' => 10, 'text' => $item['product_name']];
            $lines[] = ['x' => 320, 'y' => $y, 'size' => 10, 'text' => (string) $item['quantity']];
            $lines[] = ['x' => 370, 'y' => $y, 'size' => 10, 'text' => $this->money($item['unit_price'])];
            $lines[] = ['x' => 450, 'y' => $y, 'size' => 10, 'text' => $this->money($item['line_total'])];
            $y -= 20;
        }

        $lines[] = ['x' => 370, 'y' => $y - 20, 'size' => 12, 'text' => 'Total facture'];
        $lines[] = ['x' => 450, 'y' => $y - 20, 'size' => 12, 'text' => $this->money($order['total'])];

        $content = '';
        foreach ($lines as $line) {
            $content .= sprintf(
                "BT /F1 %d Tf %d %d Td (%s) Tj ET\n",
                $line['size'],
                $line['x'],
                $line['y'],
                $this->escape($line['text'])
            );
        }

        return $this->buildPdf($content);
    }

    private function money(float $value): string
    {
        return number_format($value, 2, '.', '') . ' DT';
    }

    private function escape(string $text): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
        $ascii = $ascii === false ? $text : $ascii;

        return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $ascii);
    }

    private function buildPdf(string $content): string
    {
        $objects = [
            "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
            "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
            "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
            "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
            "5 0 obj\n<< /Length " . strlen($content) . " >>\nstream\n" . $content . "endstream\nendobj\n"
        ];

        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $object) {
            $offsets[] = strlen($pdf);
            $pdf .= $object;
        }

        $xrefOffset = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n";
        $pdf .= "0000000000 65535 f \n";

        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
        }

        $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\n";
        $pdf .= "startxref\n" . $xrefOffset . "\n%%EOF";

        return $pdf;
    }
}

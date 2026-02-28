<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ErpOrderSubmissionService
{
    public function submit(Order $order): void
    {
        $baseUrl = (string) config('services.erp.url');
        $apiKey = (string) config('services.erp.key');

        if ($baseUrl === '') {
            throw new \RuntimeException('ERP base URL is not configured.');
        }

        $url = rtrim($baseUrl, '/').'/orders';

        $payload = [
            'external_id' => $order->uuid,
            'total_amount' => $order->total_amount,
            'items' => $order->items->map(function ($item) {
                return [
                    'product_id' => $item->product->erp_id ?? null,
                    'quantity' => $item->quantity,
                    'price' => $item->unit_price,
                ];
            })->toArray(),
        ];

        $response = Http::withToken($apiKey)->post($url, $payload);

        if ($response->successful()) {
            $order->update([
                'status' => 'sent_to_erp',
                'synced_at' => now(),
            ]);
        } else {
            Log::error('Failed to submit POS order to ERP', [
                'order_id' => $order->id,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            $order->update([
                'status' => 'failed',
            ]);
        }
    }
}

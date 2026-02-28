<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ErpProductSyncService
{
    public function sync(): void
    {
        $baseUrl = (string) config('services.erp.url');
        $apiKey = (string) config('services.erp.key');

        if ($baseUrl === '') {
            throw new \RuntimeException('ERP base URL is not configured.');
        }

        $url = rtrim($baseUrl, '/').'/products';

        $allErpIds = [];

        do {
            $response = Http::withToken($apiKey)->get($url);

            if ($response->failed()) {
                Log::error('Failed to fetch products from ERP for POS', [
                    'status' => $response->status(),
                    'url' => $url,
                    'body' => $response->body(),
                ]);

                throw new \RuntimeException('Failed to fetch products from ERP.');
            }

            $json = $response->json();
            $erpProducts = $json['data'] ?? $json ?? [];

            foreach ($erpProducts as $erpProduct) {
                $erpId = (string) ($erpProduct['id'] ?? null);

                if ($erpId === '') {
                    continue;
                }

                $allErpIds[] = $erpId;

                $inventorySum = (int) ($erpProduct['inventories_sum_quantity'] ?? 0);
                $variantInventorySum = (int) ($erpProduct['variants_inventories_sum_quantity'] ?? 0);
                $stockQuantity = $inventorySum + $variantInventorySum;

                Product::updateOrCreate(
                    ['erp_id' => $erpId],
                    [
                        'name' => $erpProduct['name'] ?? '',
                        'sku' => $erpProduct['sku'] ?? ($erpProduct['code'] ?? $erpId),
                        'price' => $erpProduct['price'] ?? 0,
                        'stock_quantity' => $stockQuantity,
                    ]
                );
            }

            $url = $json['links']['next'] ?? null;
        } while (! empty($url));

        if (! empty($allErpIds)) {
            Product::whereNotIn('erp_id', $allErpIds)->update(['stock_quantity' => 0]);
        }
    }
}

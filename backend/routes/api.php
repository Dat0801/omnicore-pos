<?php

use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Models\Product;
use App\Services\ErpProductSyncService;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);

Route::post('/products/sync', function (ErpProductSyncService $service) {
    $service->sync();

    return response()->json(Product::all());
});

Route::post('/orders', [OrderController::class, 'store']);

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'uuid' => 'required|uuid',
            'total_amount' => 'required|numeric',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric',
        ]);

        // Idempotency check: Prevent double-sync
        $existingOrder = Order::where('uuid', $validated['uuid'])->first();
        if ($existingOrder) {
            return response()->json(['message' => 'Order already processed', 'order' => $existingOrder], 200);
        }

        $order = DB::transaction(function () use ($validated) {
            $order = Order::create([
                'uuid' => $validated['uuid'],
                'total_amount' => $validated['total_amount'],
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                $order->items()->create($item);
            }

            return $order;
        });

        // TODO: Dispatch job to sync with ERP
        // SyncOrderToErp::dispatch($order);

        return response()->json($order, 201);
    }
}

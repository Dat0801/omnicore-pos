<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['uuid', 'total_amount', 'status', 'synced_at'];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}

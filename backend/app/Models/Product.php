<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['erp_id', 'name', 'sku', 'price', 'stock_quantity'];
}

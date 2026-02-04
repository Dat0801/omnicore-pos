<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'POS Machine 1',
            'email' => 'pos1@omnicore.com',
            'password' => bcrypt('password'),
        ]);

        Product::create([
            'name' => 'Coffee',
            'sku' => 'COF-001',
            'price' => 3.50,
            'stock_quantity' => 100,
            'erp_id' => 101
        ]);
        
        Product::create([
            'name' => 'Bagel',
            'sku' => 'BAG-001',
            'price' => 2.00,
            'stock_quantity' => 50,
            'erp_id' => 102
        ]);
    }
}

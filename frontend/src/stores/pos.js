import { defineStore } from 'pinia';
import { db } from '../services/db';
import { productService } from '../services/productService';
import { v4 as uuidv4 } from 'uuid';

const API_BASE = import.meta.env.VITE_POS_API_URL ?? 'http://localhost:8001';
const API_ORDERS = `${API_BASE}/api/orders`;
const AUTH_HEADER = (() => {
  const token = import.meta.env.VITE_POS_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
})();

export const usePosStore = defineStore('pos', {
  state: () => ({
    products: [],
    cart: [],
    isOnline: navigator.onLine,
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      allSynced: true
    }
  }),
  actions: {
    async init() {
        this.products = await productService.getAll();
        await this.loadStats();
        
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.sync();
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });

        if (this.isOnline) {
            this.sync();
        }
    },
    async loadStats() {
        try {
            const s = await db.getOrderSummary();
            this.stats = s;
        } catch (e) {
            console.error('Failed to load order summary', e);
        }
    },
    async sync() {
        await this.syncProducts();
        await this.syncOrders();
        await this.loadStats();
    },
    async syncProducts() {
        try {
            this.products = await productService.sync();
        } catch (e) {
            console.error('Failed to sync products', e);
        }
    },
    async createOrder() {
        if (this.cart.length === 0) return;
        
        const order = {
            uuid: uuidv4(),
            items: this.cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price
            })),
            total_amount: this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            synced: false,
            created_at: new Date().toISOString()
        };
        
        await db.addOrder(order);
        this.cart = [];
        
        if (this.isOnline) {
            this.syncOrders();
        }
        await this.loadStats();
    },
    async syncOrders() {
        const unsynced = await db.getUnsyncedOrders();
        for (const order of unsynced) {
            try {
                const res = await fetch(API_ORDERS, { 
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...AUTH_HEADER,
                    },
                    body: JSON.stringify(order) 
                });
                
                if (res.ok) {
                    await db.markOrderSynced(order.uuid);
                }
            } catch (e) {
                console.error('Sync failed for order', order.uuid, e);
            }
        }
        await this.loadStats();
    },
    addToCart(product) {
        const existing = this.cart.find(i => i.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
    }
  }
});

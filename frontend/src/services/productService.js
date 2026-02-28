import { db } from './db';

const API_BASE = import.meta.env.VITE_POS_API_URL ?? 'http://localhost:8001';
const API_URL = `${API_BASE}/api/products`;
const API_SYNC_URL = `${API_BASE}/api/products/sync`;

export const productService = {
  /**
   * Syncs products from ERP/Backend to local IndexedDB
   * @returns {Promise<Array>} Updated list of products
   */
  async sync() {
    try {
      const headers = { Accept: 'application/json' };
      const token = import.meta.env.VITE_POS_API_TOKEN;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(API_SYNC_URL, { method: 'POST', headers });
      
      if (!res.ok) {
        throw new Error(`Sync failed: ${res.statusText}`);
      }
      
      const data = await res.json();
      await db.syncProducts(data);
      return await db.getProducts();
    } catch (error) {
      console.error('Product sync error:', error);
      // In offline mode, we might want to just return existing products
      // But let the caller handle the error
      throw error;
    }
  },

  /**
   * Get all products from local cache
   */
  async getAll() {
    return await db.getProducts();
  },

  /**
   * Find product by SKU using IndexedDB index
   */
  async getBySku(sku) {
    return await db.findProductBySku(sku);
  },

  /**
   * Search products by name using IndexedDB index
   */
  async searchByName(name) {
    return await db.findProductsByName(name);
  }
};

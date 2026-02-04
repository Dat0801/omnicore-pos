import { openDB } from 'idb';

const dbPromise = openDB('omnicore-pos', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('products')) {
      db.createObjectStore('products', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('orders')) {
      const orderStore = db.createObjectStore('orders', { keyPath: 'uuid' });
      orderStore.createIndex('synced', 'synced');
    }
  },
});

export const db = {
  async getProducts() {
    return (await dbPromise).getAll('products');
  },
  async setProducts(products) {
    const tx = (await dbPromise).transaction('products', 'readwrite');
    await Promise.all([
      tx.store.clear(),
      ...products.map(product => tx.store.put(product))
    ]);
    await tx.done;
  },
  async addOrder(order) {
    return (await dbPromise).add('orders', order);
  },
  async getUnsyncedOrders() {
    const all = await (await dbPromise).getAll('orders');
    return all.filter(o => !o.synced);
  },
  async markOrderSynced(uuid) {
    const db = await dbPromise;
    const order = await db.get('orders', uuid);
    if (order) {
        order.synced = true;
        await db.put('orders', order);
    }
  }
};

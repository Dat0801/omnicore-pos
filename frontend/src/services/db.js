import { openDB } from 'idb';

const dbPromise = openDB('omnicore-pos', 2, {
  upgrade(db, oldVersion, newVersion, transaction) {
    let productStore;
    if (!db.objectStoreNames.contains('products')) {
      productStore = db.createObjectStore('products', { keyPath: 'id' });
    } else {
      productStore = transaction.objectStore('products');
    }

    if (!productStore.indexNames.contains('name')) {
      productStore.createIndex('name', 'name', { unique: false });
    }
    if (!productStore.indexNames.contains('sku')) {
      productStore.createIndex('sku', 'sku', { unique: true });
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
  async findProductBySku(sku) {
    return (await dbPromise).getFromIndex('products', 'sku', sku);
  },
  async findProductsByName(name) {
    return (await dbPromise).getAllFromIndex('products', 'name', name);
  },
  async syncProducts(products) {
    const db = await dbPromise;
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');

    // Get all existing IDs
    const existingKeys = await store.getAllKeys();
    const existingIds = new Set(existingKeys);
    
    // Prepare incoming IDs
    const incomingIds = new Set(products.map(p => p.id));

    // Determine deletions
    const toDelete = existingKeys.filter(id => !incomingIds.has(id));

    // Perform updates/inserts
    for (const product of products) {
        store.put(product);
    }

    // Perform deletions
    for (const id of toDelete) {
        store.delete(id);
    }

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

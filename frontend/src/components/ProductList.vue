<script setup>
import { usePosStore } from '../stores/pos';
import { onMounted, computed, ref } from 'vue';

const store = usePosStore();
const searchQuery = ref('');

onMounted(() => {
  store.init();
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return store.products;
  const lower = searchQuery.value.toLowerCase();
  return store.products.filter(p => 
    p.name.toLowerCase().includes(lower) || 
    p.sku.toLowerCase().includes(lower)
  );
});
</script>

<template>
  <div class="product-list">
    <h2>POS Products</h2>
    <div class="controls">
      <button @click="store.sync()" :disabled="!store.isOnline">
        {{ store.isOnline ? 'Sync from ERP' : 'Offline' }}
      </button>
      <input v-model="searchQuery" placeholder="Search by Name or SKU" />
    </div>
    
    <div v-if="filteredProducts.length === 0">
      No products found.
    </div>
    
    <ul v-else class="products">
      <li v-for="product in filteredProducts" :key="product.id" class="product-item">
        <div class="product-info">
          <strong>{{ product.name }}</strong>
          <small>{{ product.sku }}</small>
        </div>
        <div class="product-price">
          ${{ product.price }}
        </div>
        <button @click="store.addToCart(product)">Add to Cart</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.product-list {
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
}
.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
.products {
  list-style: none;
  padding: 0;
}
.product-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-info {
  display: flex;
  flex-direction: column;
}
</style>

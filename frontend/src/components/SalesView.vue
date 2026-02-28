<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePosStore } from '../stores/pos';
import PaymentScreen from './PaymentScreen.vue';

const store = usePosStore();

const search = ref('');
const categories = ref([
  'All Items',
  'Electronics',
  'Apparel',
  'Home & Office',
  'Accessories',
  'Footwear',
  'New Arrivals',
]);
const activeCategory = ref('All Items');
const paymentMode = ref(false);

onMounted(async () => {
  if (!store.products.length) {
    try {
      await store.init();
    } catch (e) {
      // ignore init errors in UI prototype
    }
  }
});

const normalizedProducts = computed(() => {
  return store.products.map((p, idx) => ({
    id: p.id ?? idx + 1,
    name: p.name ?? p.title ?? 'Unnamed Product',
    sku: p.sku ?? `SKU-${(idx + 1).toString().padStart(4, '0')}`,
    price: Number(p.price ?? p.unit_price ?? 0),
    stock: Number(p.stock ?? p.stock_quantity ?? p.quantity ?? 0),
    category: p.category ?? 'Electronics',
    image:
      p.imageUrl ??
      p.image ??
      `https://picsum.photos/seed/${encodeURIComponent(p.sku ?? idx)}/640/480`,
  }));
});

const displayedProducts = computed(() => {
  const q = search.value.toLowerCase().trim();
  return normalizedProducts.value.filter((p) => {
    const matchCat =
      activeCategory.value === 'All Items' ||
      p.category?.toLowerCase() === activeCategory.value.toLowerCase();
    const matchQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });
});

function chooseCategory(cat) {
  activeCategory.value = cat;
}

function add(product) {
  store.addToCart(product);
}

function inc(item) {
  item.quantity++;
}
function dec(item) {
  if (item.quantity > 1) item.quantity--;
}
function removeItem(item) {
  const i = store.cart.findIndex((c) => c.id === item.id);
  if (i !== -1) store.cart.splice(i, 1);
}

const subtotal = computed(() =>
  store.cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
);
const taxRate = 0.08;
const tax = computed(() => subtotal.value * taxRate);
const discount = ref(0);
const total = computed(() => subtotal.value + tax.value - discount.value);
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <PaymentScreen
      v-if="paymentMode"
      :items="store.cart"
      @cancel="paymentMode = false"
      @paid="paymentMode = false"
    />
    <template v-else>
    <header class="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
      <div class="flex items-center gap-3">
        <div class="grid h-9 w-9 place-items-center rounded-2xl bg-blue-600 font-semibold text-white">O</div>
        <div>
          <p class="text-sm font-semibold leading-none">OMNICORE</p>
          <p class="mt-0.5 text-xs text-slate-500">Terminal #42 • Register 01</p>
        </div>
      </div>
      <nav class="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
        <a class="text-slate-900">Sales</a>
        <a class="hover:text-slate-900" href="#" @click.prevent="$router.push('/orders')">Orders</a>
        <a class="hover:text-slate-900" href="#">Inventory</a>
        <a class="hover:text-slate-900" href="#">Customers</a>
      </nav>
      <div class="flex items-center gap-3">
        <div class="hidden items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 md:inline-flex">
          ONLINE
        </div>
        <div class="flex items-center gap-2">
          <div class="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
            </svg>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold leading-none">Alex Johnson</p>
            <p class="mt-0.5 text-xs text-slate-500">Lead Cashier</p>
          </div>
        </div>
      </div>
    </header>

    <div class="grid gap-6 p-6 lg:grid-cols-[1fr_420px]">
      <section>
        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div class="relative">
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 7.5 15.5a7.5 7.5 0 0 0 9.15 1.15Z" />
              </svg>
            </span>
            <input
              v-model="search"
              class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Search products by name, category, or scan SKU…"
            />
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              title="Barcode Scanner"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7h2m2 0h2m2 0h2m2 0h2M3 17h2m2 0h2m2 0h2m2 0h2M4 3v2m0 14v2M20 3v2m0 14v2" />
              </svg>
            </button>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="cat"
              class="rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition"
              :class="activeCategory === cat ? 'bg-blue-600 text-white ring-blue-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'"
              @click="chooseCategory(cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="p in displayedProducts"
            :key="p.id"
            class="group rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
          >
            <div class="relative overflow-hidden rounded-xl bg-slate-100">
              <img :src="p.image" class="h-44 w-full object-cover transition group-hover:scale-[1.02]" :alt="p.name" />
              <div class="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {{ p.category }}
              </div>
            </div>
            <div class="mt-3 space-y-1.5">
              <div class="flex items-start justify-between">
                <p class="text-sm font-semibold leading-snug">{{ p.name }}</p>
                <p class="text-sm font-semibold text-slate-900">${{ p.price.toFixed(2) }}</p>
              </div>
              <p
                class="text-xs font-medium"
                :class="p.stock > 0 ? 'text-emerald-700' : 'text-rose-700'"
              >
                {{ p.stock > 0 ? p.stock + ' in stock' : 'Out of stock' }}
              </p>
              <button
                class="mt-2 w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                :disabled="p.stock <= 0"
                @click="add(p)"
              >
                Add to Order
              </button>
            </div>
          </div>

          <div
            v-if="displayedProducts.length === 0"
            class="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500"
          >
            No matching products found.
          </div>
        </div>
      </section>

      <aside class="space-y-4">
        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold">Current Order</p>
              <p class="text-xs text-slate-500">Order ID: #ORD-84920</p>
            </div>
            <div class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              {{ store.cart.length }} Items
            </div>
          </div>
          <div v-if="store.cart.length === 0" class="mt-6 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            Cart is empty. Choose products on the left to get started.
          </div>
          <div v-else class="mt-3 space-y-3">
            <div
              v-for="item in store.cart"
              :key="item.id"
              class="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
            >
              <div class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img :src="item.image || `https://picsum.photos/seed/${encodeURIComponent(item.sku || item.id)}/120/120`" class="h-full w-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold">{{ item.name }}</p>
                <p class="text-xs text-slate-500">${{ item.price.toFixed(2) }} / unit</p>
              </div>
              <div class="flex items-center gap-2">
                <button class="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200" @click="dec(item)">−</button>
                <div class="w-6 text-center text-sm font-semibold tabular-nums">{{ item.quantity }}</div>
                <button class="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200" @click="inc(item)">+</button>
              </div>
              <div class="w-20 text-right text-sm font-semibold tabular-nums">${{ (item.price * item.quantity).toFixed(2) }}</div>
              <button class="text-slate-400 hover:text-rose-600" title="Remove" @click="removeItem(item)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 7h12l-1 12H7L6 7Zm3-3h6l1 2H8l1-2Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Subtotal</span>
              <span class="font-semibold">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Tax (8%)</span>
              <span class="font-semibold">${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Discount</span>
              <span class="font-semibold text-emerald-700">-${{ discount.toFixed(2) }}</span>
            </div>
          </div>
          <div class="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
            <span class="text-xs font-semibold tracking-wide text-slate-600">TOTAL AMOUNT</span>
            <span class="text-xl font-bold text-blue-600 tabular-nums">${{ total.toFixed(2) }}</span>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <button class="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
              Hold Order
            </button>
            <button class="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
              Customer
            </button>
          </div>
          <button
            class="mt-3 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            :disabled="store.cart.length === 0"
            @click="paymentMode = true"
          >
            Proceed to Payment
          </button>
        </div>
      </aside>
    </div>
    </template>
  </div>
</template>

<style scoped>
</style>

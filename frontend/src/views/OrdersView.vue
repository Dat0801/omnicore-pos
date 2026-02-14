<script setup>
import { ref } from 'vue';

const filters = ref(['All', 'Synced', 'Failed']);
const activeFilter = ref('All');

const orders = ref([
  { id: 8824, total: 142.0, minutes: 2, status: 'FAILED' },
  { id: 8823, total: 54.9, minutes: 14, status: 'SYNCED' },
  { id: 8822, total: 210.0, minutes: 42, status: 'SYNCED' },
  { id: 8821, total: 12.5, minutes: 60, status: 'SYNCED' },
  { id: 8820, total: 88.0, minutes: 120, status: 'SYNCED' },
]);

const current = ref(orders.value[0]);

function select(o) {
  current.value = o;
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
      <div class="flex items-center gap-3">
        <div class="grid h-9 w-9 place-items-center rounded-2xl bg-blue-600 font-semibold text-white">O</div>
        <nav class="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <a class="hover:text-slate-900" @click.prevent="$router.push('/')">Dashboard</a>
          <span class="text-slate-900">Order History</span>
          <a class="hover:text-slate-900" href="#">Devices</a>
          <a class="hover:text-slate-900" href="#">Staff</a>
        </nav>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative hidden md:block">
          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 7.5 15.5a7.5 7.5 0 0 0 9.15 1.15Z" />
            </svg>
          </span>
          <input class="w-80 rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Search orders..." />
        </div>
        <button class="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">🔔</button>
        <div class="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
          </svg>
        </div>
      </div>
    </header>

    <div class="grid gap-6 p-6 lg:grid-cols-[320px_1fr]">
      <!-- Recent Transactions -->
      <aside class="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">Recent Transactions</h3>
          <button class="text-sm font-semibold text-slate-600 hover:text-slate-900">Filter</button>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <button
            v-for="f in filters"
            :key="f"
            class="rounded-full px-3 py-1.5 text-xs font-semibold ring-1"
            :class="activeFilter === f ? 'bg-blue-600 text-white ring-blue-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'"
            @click="activeFilter = f"
          >
            {{ f }}
          </button>
        </div>
        <div class="mt-3">
          <button
            v-for="o in orders"
            :key="o.id"
            class="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-slate-50"
            :class="current?.id === o.id ? 'bg-blue-50 ring-1 ring-blue-200' : ''"
            @click="select(o)"
          >
            <div>
              <p class="text-sm font-semibold">Order #{{ o.id }}</p>
              <p class="text-xs text-slate-500">{{ o.minutes }} mins ago</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold">${{ o.total.toFixed(2) }}</p>
              <div class="mt-1 inline-flex items-center gap-1 text-xs font-semibold"
                   :class="o.status === 'SYNCED' ? 'text-emerald-700' : 'text-rose-700'">
                <span class="h-2 w-2 rounded-full"
                      :class="o.status === 'SYNCED' ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                {{ o.status }}
              </div>
            </div>
          </button>
        </div>
      </aside>

      <!-- Order Details -->
      <section>
        <div class="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <div class="flex items-start justify-between">
            <div>
              <nav class="text-xs text-slate-500">
                Order History <span class="mx-1">/</span> <span class="text-slate-900 font-semibold">Order #{{ current?.id }}</span>
              </nav>
              <h1 class="mt-1 text-xl font-semibold">Order Details</h1>
              <p class="mt-0.5 text-xs text-slate-500">Processed on Oct 24, 2023 at 10:42 AM</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">Print Receipt</button>
              <button class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">Retry Sync</button>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p class="text-sm font-semibold text-rose-700">Cloud Synchronization Failed</p>
            <p class="mt-1 text-sm text-rose-700">This order data has not been successfully uploaded to the central server. This may affect inventory levels and sales reporting.</p>
            <div class="mt-2 text-sm">
              <a class="font-semibold text-rose-700 hover:underline" href="#">View Error Logs</a>
              <span class="ml-2 text-rose-600">Last attempt: 10:44 AM (Timeout Error)</span>
            </div>
          </div>

          <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs text-slate-500">Staff Member</p>
              <p class="mt-1 text-sm font-semibold">Marcus Richardson</p>
              <p class="text-xs text-slate-500">ID: STF-0912</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs text-slate-500">Device ID</p>
              <p class="mt-1 text-sm font-semibold">POS Terminal #04</p>
              <p class="text-xs text-slate-500">Model: OmniTouch X1</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs text-slate-500">Payment Method</p>
              <p class="mt-1 text-sm font-semibold">Visa •••• 4242</p>
              <p class="text-xs text-slate-500">Auth Code: 981240</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs text-slate-500">Customer</p>
              <p class="mt-1 text-sm font-semibold">Guest Checkout</p>
              <p class="text-xs text-slate-500">Loyalty: N/A</p>
            </div>
          </div>

          <div class="mt-6 rounded-xl border border-slate-200 bg-white">
            <div class="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <div>Item Details</div>
              <div>Qty</div>
              <div>Unit Price</div>
              <div>Total</div>
            </div>
            <div class="divide-y divide-slate-200">
              <div class="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16V8a2 2 0 0 0-2-2h-3.1A4.994 4.994 0 0 0 12 4a4.994 4.994 0 0 0-3.9 2H5a2 2 0 0 0-2 2v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3Z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold">Wireless Headphones Pro</p>
                    <p class="text-xs text-slate-500">SKU: AUD-99-BLU</p>
                  </div>
                </div>
                <div class="text-sm font-semibold">1</div>
                <div class="text-sm font-semibold">$89.00</div>
                <div class="text-sm font-semibold">$89.00</div>
              </div>
              <div class="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z" opacity=".2"/><path d="M8 8h8v8H8z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold">Fast Charger 45W</p>
                    <p class="text-xs text-slate-500">SKU: ACC-PWR-BLK</p>
                  </div>
                </div>
                <div class="text-sm font-semibold">2</div>
                <div class="text-sm font-semibold">$19.00</div>
                <div class="text-sm font-semibold">$38.00</div>
              </div>
              <div class="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm0 8H5V9h14v6Z"/></svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold">OmniCare® Extended Warranty</p>
                    <p class="text-xs text-slate-500">SKU: SRV-PROT-Y</p>
                  </div>
                </div>
                <div class="text-sm font-semibold">1</div>
                <div class="text-sm font-semibold">$15.00</div>
                <div class="text-sm font-semibold">$15.00</div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-8 border-t border-slate-200 px-6 py-4">
              <div class="space-y-2 text-sm">
                <div class="flex items-center justify-between gap-8">
                  <span class="text-slate-600">Subtotal</span>
                  <span class="font-semibold">$142.00</span>
                </div>
                <div class="flex items-center justify-between gap-8">
                  <span class="text-slate-600">Tax (0%)</span>
                  <span class="font-semibold">$0.00</span>
                </div>
                <div class="flex items-center justify-between gap-8">
                  <span class="text-slate-600">Discounts</span>
                  <span class="font-semibold text-emerald-700">-$0.00</span>
                </div>
                <div class="flex items-center justify-between gap-8 border-t border-slate-200 pt-3">
                  <span class="text-xs font-semibold tracking-wide text-slate-600">TOTAL</span>
                  <span class="text-xl font-bold text-blue-600">$142.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer class="mt-6 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-xs text-slate-100">
          <div class="flex items-center gap-6">
            <span class="inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
              POS TERMINAL #04 ONLINE
            </span>
            <span class="inline-flex items-center gap-2 text-rose-300">
              <span class="h-2 w-2 rounded-full bg-rose-500"></span>
              CLOUD SYNC ERROR (1 PENDING)
            </span>
          </div>
          <span class="opacity-70">SYSTEM VERSION 2.4.0-STABLE</span>
        </footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
</style>


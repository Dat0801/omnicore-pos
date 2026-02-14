<script setup>
import { ref, computed } from 'vue'
import { usePosStore } from '../stores/pos'

const props = defineProps({
  items: { type: Array, default: () => [] },
  onCancel: { type: Function, default: null }
})

const emit = defineEmits(['cancel', 'paid'])

const methods = [
  { key: 'cash', name: 'Cash', icon: '💵' },
  { key: 'card', name: 'Credit Card', icon: '💳' },
  { key: 'wallet', name: 'Digital Wallet', icon: '🪙' }
]
const selected = ref('card')
const printReceipt = ref(true)

const subtotal = computed(() =>
  props.items.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0)
)
const tax = ref(0)
const total = computed(() => subtotal.value + tax.value)

const store = usePosStore()

async function confirm() {
  await store.createOrder()
  emit('paid', { method: selected.value, printReceipt: printReceipt.value })
}

function cancel() {
  emit('cancel')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
      <div class="flex items-center gap-3">
        <div class="grid h-9 w-9 place-items-center rounded-2xl bg-blue-600 font-semibold text-white">O</div>
        <div>
          <p class="text-sm font-semibold leading-none">OMNICORE</p>
          <p class="mt-0.5 text-xs text-slate-500">Terminal ID: #POS-082 • Staff: Alex Johnson</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <a class="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600" href="#" aria-label="Help">?</a>
        <a class="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600" href="#" aria-label="Settings">⚙︎</a>
        <div class="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
          </svg>
        </div>
      </div>
    </header>

    <div class="grid gap-6 p-6 lg:grid-cols-[420px_1fr]">
      <aside class="space-y-4">
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p class="text-sm font-semibold text-slate-900">Order #8921-33</p>
          <h2 class="mt-1 text-lg font-semibold">Review Order</h2>
          <div class="mt-4 space-y-4">
            <div
              v-for="item in items"
              :key="item.id"
              class="flex items-center justify-between gap-3"
            >
              <div class="flex items-start gap-3">
                <div class="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16V8a2 2 0 0 0-2-2h-3.1A4.994 4.994 0 0 0 12 4a4.994 4.994 0 0 0-3.9 2H5a2 2 0 0 0-2 2v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3Z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold">{{ item.name }}</p>
                  <p class="text-xs text-slate-500">Qty: {{ item.quantity }} × ${{ Number(item.price).toFixed(2) }}</p>
                </div>
              </div>
              <div class="text-sm font-semibold">${{ (Number(item.price) * Number(item.quantity)).toFixed(2) }}</div>
            </div>
          </div>
          <div class="mt-6 border-t border-slate-200 pt-4 space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Subtotal</span>
              <span class="font-semibold">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Tax (0%)</span>
              <span class="font-semibold">${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-slate-200">
              <span class="text-xs font-semibold tracking-wide text-slate-600">Total Amount</span>
              <span class="text-xl font-bold text-blue-600 tabular-nums">${{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </aside>

      <section class="space-y-4">
        <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 class="text-sm font-semibold">Select Payment Method</h3>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <button
              v-for="m in methods"
              :key="m.key"
              class="flex items-center justify-center gap-3 rounded-xl border p-6 text-sm font-semibold transition focus:outline-none"
              :class="selected === m.key ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200 hover:bg-slate-50'"
              @click="selected = m.key"
            >
              <span class="text-xl">{{ m.icon }}</span>
              <span>{{ m.name }}</span>
              <span v-if="selected === m.key" class="ml-auto grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-[10px] text-white">✓</span>
            </button>
          </div>
          <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-sm font-semibold">Credit Card Terminal</p>
            <p class="mt-1 text-sm text-slate-600">Waiting for card insertion on terminal #42…</p>
            <div class="mt-3 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button class="text-sm font-semibold text-blue-600 hover:text-blue-700">Reset Connection</button>
                <button class="text-sm text-slate-600 hover:text-slate-900">Manual Entry</button>
              </div>
              <div class="grid h-10 w-10 place-items-center rounded-full bg-white shadow ring-1 ring-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h12v12H6z" opacity=".2"/><path d="M8 8h8v8H8z"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div class="flex items-start gap-3">
              <div class="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm0 8H5V9h14v6Z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold">Print Receipt</p>
                <p class="text-xs text-slate-500">A physical copy will be printed automatically</p>
              </div>
            </div>
            <label class="inline-flex cursor-pointer items-center">
              <input type="checkbox" class="peer sr-only" v-model="printReceipt">
              <div class="peer h-6 w-11 rounded-full bg-slate-200 after:ml-1 after:mt-1 after:block after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-blue-600 peer-checked:after:translate-x-5"></div>
            </label>
          </div>
          <div class="mt-4 flex items-center gap-3">
            <button
              class="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
              @click="confirm"
            >
              Confirm Payment
            </button>
            <button class="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold hover:bg-slate-50" @click="cancel">
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>

    <footer class="flex items-center justify-between border-t border-slate-200 bg-white/80 px-6 py-3 text-xs text-slate-600">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          SYSTEM ONLINE
        </span>
        <span class="hidden items-center gap-1 sm:flex">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          TERMINAL CONNECTED
        </span>
      </div>
      <div class="flex items-center gap-3">
        <span>LAST SYNC: 1 MINUTE AGO</span>
        <span>OMNICORE V4.2.0</span>
      </div>
    </footer>
  </div>
  </template>

<style scoped>
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePosStore } from '../stores/pos';

const store = usePosStore();
const deviceId = ref('');
const secretKey = ref('');
const showSecret = ref(false);

onMounted(() => {
  if (!store.products.length) {
    store.init().catch(() => {});
  }
});

const isValid = computed(() => {
  return deviceId.value.trim().length > 0 && secretKey.value.length === 16;
});

function registerDevice() {
  alert('Device has been registered (UI demo).');
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
    <header class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-2xl bg-blue-600 text-white grid place-items-center font-semibold">O</div>
        <span class="text-lg font-semibold tracking-tight">OMNICORE</span>
      </div>
      <div class="flex items-center gap-4">
        <span
          :class="[
            'text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5',
            store.isOnline ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
          ]"
        >
          <span
            :class="[
              'h-1.5 w-1.5 rounded-full',
              store.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
            ]"
          ></span>
          {{ store.isOnline ? 'ONLINE' : 'OFFLINE' }}
        </span>
        <button class="h-9 w-9 grid place-items-center rounded-full bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Help">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.84 9a3.38 3.38 0 0 1 6.61 1.125c0 2.25-2.25 2.813-2.25 2.813M12 17h.01" />
            <circle cx="12" cy="12" r="9"></circle>
          </svg>
        </button>
        <button class="h-9 w-9 grid place-items-center rounded-full bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-.78.597-1.42 1.372-1.493a9.03 9.03 0 0 0-1.197-2.888c-.432-.69-.287-1.59.322-2.12l.013-.012a9.024 9.024 0 0 0-2.784-2.785l-.012.012c-.53.609-1.43.754-2.12.322a9.03 9.03 0 0 0-2.888-1.197A1.5 1.5 0 0 0 12 1.5h0a1.5 1.5 0 0 0-1.493 1.372 9.03 9.03 0 0 0-2.888 1.197c-.69.432-1.59.287-2.12-.322l-.012-.013A9.024 9.024 0 0 0 2.702 6.52l.012.012c.609.53.754 1.43.322 2.12a9.03 9.03 0 0 0-1.197 2.888A1.5 1.5 0 0 0 1.5 12h0c0 .78.597 1.42 1.372 1.493a9.03 9.03 0 0 0 1.197 2.888c.432.69.287 1.59-.322 2.12l-.013.012a9.024 9.024 0 0 0 2.784 2.785l.012-.012c.53-.609 1.43-.754 2.12-.322 0 0 1.832.637 2.888 1.197A1.5 1.5 0 0 0 12 22.5h0c.78 0 1.42-.597 1.493-1.372a9.03 9.03 0 0 0 2.888-1.197c.69-.432 1.59-.287 2.12.322l.012.013a9.024 9.024 0 0 0 2.785-2.784l-.012-.012c-.609-.53-.754-1.43-.322-2.12a9.03 9.03 0 0 0 1.197-2.888c.875-.073 1.372-.713 1.372-1.493Z" />
          </svg>
        </button>
      </div>
    </header>

    <main class="flex-1 grid place-items-center px-4">
      <div class="w-full max-w-md">
        <div class="overflow-hidden rounded-2xl shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 bg-white">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-4 text-white">
            <p class="text-xs font-semibold tracking-[0.25em] uppercase">Secure Onboarding</p>
          </div>

          <div class="px-6 py-6">
            <h1 class="text-2xl font-semibold text-slate-900">Register POS Terminal</h1>
            <p class="mt-1 text-sm text-slate-600">
              Enter the device information provided by your administrator to link this terminal with the OMNICORE system.
            </p>

            <div class="mt-6 space-y-4">
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-slate-700">Device ID</label>
                <div class="relative">
                  <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="7" width="18" height="10" rx="2" />
                      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </span>
                  <input
                    v-model.trim="deviceId"
                    placeholder="e.g. TML-8842-X9"
                    class="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none ring-0 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    autocomplete="off"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-slate-700">Secret Key</label>
                  <a href="#" class="text-xs font-medium text-blue-600 hover:underline">Lost key?</a>
                </div>
                <div class="relative">
                  <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path d="M3 21v-2a4 4 0 0 1 4-4h3" />
                      <path d="m21 12-1.5 1.5" />
                    </svg>
                  </span>
                  <input
                    :type="showSecret ? 'text' : 'password'"
                    v-model="secretKey"
                    placeholder="••••••••••••••••"
                    class="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    autocomplete="off"
                  />
                  <button
                    type="button"
                    class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    @click="showSecret = !showSecret"
                  >
                    {{ showSecret ? 'Hide' : 'Show' }}
                  </button>
                </div>
                <p class="text-xs text-slate-500">Key is case‑sensitive and must be exactly 16 characters.</p>
              </div>

              <button
                class="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                :disabled="!isValid"
                @click="registerDevice"
              >
                Register Device
              </button>
            </div>

            <p class="mt-6 text-xs text-slate-500">
              Need help? Contact your administrator or visit the Help Center.
            </p>
          </div>
        </div>
      </div>
    </main>

    <footer class="px-6 py-4 text-xs text-slate-500">
      <div class="flex items-center justify-between">
        <p>© 2024 OMNICORE RETAIL SYSTEMS INC.</p>
        <div class="flex items-center gap-4">
          <span class="inline-flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3.5 w-3.5 text-emerald-500" fill="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            E2EE ACTIVE
          </span>
          <span>VERSION 4.2.0-STABLE</span>
          <a href="#" class="hover:text-slate-700">PRIVACY</a>
          <a href="#" class="hover:text-slate-700">TERMS</a>
        </div>
      </div>
    </footer>
  </div>
  </template>

<style scoped>
</style>

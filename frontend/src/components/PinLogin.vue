<script setup>
import { ref, computed } from 'vue';
const emit = defineEmits(['success']);

const pin = ref('');
const error = ref('');
const loading = ref(false);

const filled = computed(() => pin.value.length);
const canSubmit = computed(() => pin.value.length === 6 && !loading.value);

const keys = [
  '1','2','3',
  '4','5','6',
  '7','8','9',
  'CLEAR','0','BACK'
];

function press(key) {
  error.value = '';
  if (key === 'CLEAR') {
    pin.value = '';
    return;
  }
  if (key === 'BACK') {
    pin.value = pin.value.slice(0, -1);
    return;
  }
  if (pin.value.length < 6 && /^[0-9]$/.test(key)) {
    pin.value += key;
  }
}

async function submit() {
  if (!canSubmit.value) return;
  loading.value = true;
  await new Promise(r => setTimeout(r, 450));
  if (pin.value !== '123456') {
    error.value = 'Incorrect PIN. Please try again.';
    pin.value = '';
  } else {
    emit('success');
  }
  loading.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
    <header class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-2xl bg-blue-600 text-white grid place-items-center font-semibold">O</div>
        <span class="text-lg font-semibold tracking-tight">OMNICORE</span>
      </div>
      <div class="flex items-center gap-2 text-sm text-slate-600">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor">
          <path d="M18 10c1.657 0 3-1.79 3-4s-1.343-4-3-4c-1.33 0-2.787.977-3.33 2.285C13.8 5.45 12.07 6.5 10 6.5H8a5 5 0 0 0-5 5v4.25C3 17.321 4.679 19 6.75 19H9v3.25c0 .414.336.75.75.75.18 0 .355-.065.492-.183L14.5 19h2.75A4.75 4.75 0 0 0 22 14.25V10z"/>
        </svg>
        <span>Register #04 - Main Floor</span>
      </div>
    </header>

    <main class="flex-1 grid place-items-center px-4">
      <div class="w-full max-w-sm">
        <div class="text-center">
          <h1 class="text-2xl font-semibold text-slate-900">Please enter your PIN</h1>
          <p class="mt-1 text-sm text-slate-500">Enter your 6-digit staff authentication code</p>
        </div>

        <div class="mt-5 flex items-center justify-center gap-2">
          <div
            v-for="i in 6"
            :key="i"
            class="h-2.5 w-2.5 rounded-full"
            :class="i <= filled ? 'bg-blue-600' : 'bg-slate-300'"
          />
        </div>

        <div class="mt-6 grid grid-cols-3 gap-3">
          <button
            v-for="k in keys"
            :key="k"
            class="h-14 rounded-xl bg-white text-slate-800 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50 active:scale-[0.99] transition text-base font-semibold disabled:opacity-50"
            :class="{'col-span-1': true, 'text-slate-600': k === 'CLEAR' || k === 'BACK'}"
            @click="k === 'BACK' ? press('BACK') : press(k)"
          >
            <span v-if="/^[0-9]$/.test(k)">{{ k }}</span>
            <span v-else-if="k === 'CLEAR'">CLEAR</span>
            <span v-else class="inline-flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
                <path d="M7.414 5H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7.414a2 2 0 0 1-1.414-.586L1.586 14a2 2 0 0 1 0-2L6 5.586A2 2 0 0 1 7.414 5ZM13.707 12l2.147-2.146a1 1 0 0 0-1.414-1.415L12.293 10.59l-2.147-2.15a1 1 0 0 0-1.414 1.417L10.879 12l-2.147 2.146a1 1 0 0 0 1.414 1.415l2.147-2.147 2.147 2.147a1 1 0 0 0 1.414-1.415L13.707 12Z"/>
              </svg>
            </span>
          </button>
        </div>

        <button
          class="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          :disabled="!canSubmit"
          @click="submit"
        >
          Login
        </button>

        <p v-if="error" class="mt-3 text-center text-sm text-red-600">
          {{ error }}
        </p>
      </div>
    </main>

    <footer class="px-6 py-8">
      <p class="text-center text-xs text-slate-400">© 2024 OMNICORE Retail Solutions. v2.4.0</p>
    </footer>
  </div>
</template>

<style scoped>
</style>

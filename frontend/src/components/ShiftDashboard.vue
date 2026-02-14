<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePosStore } from '../stores/pos';

const store = usePosStore();

const user = ref({
  name: 'Alex',
  employeeId: '#44029',
  title: 'Floor Supervisor',
  avatarUrl: ''
});

const shiftActive = ref(false);
const secondsLeft = ref(8 * 3600 + 45 * 60 + 12);
let intervalId;

onMounted(async () => {
  if (!store.products.length) {
    await store.init().catch(() => {});
  } else {
    await store.loadStats().catch(() => {});
  }
  intervalId = setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value -= 1;
    }
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const hours = computed(() => String(Math.floor(secondsLeft.value / 3600)).padStart(2, '0'));
const mins = computed(() => String(Math.floor((secondsLeft.value % 3600) / 60)).padStart(2, '0'));
const secs = computed(() => String(secondsLeft.value % 60).padStart(2, '0'));

function startShift() {
  shiftActive.value = true;
}

function closeShift() {
  alert('Closing shift and printing report (UI demo).');
  shiftActive.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
    <header class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-2xl bg-blue-600 text-white grid place-items-center font-semibold">O</div>
        <span class="text-lg font-semibold tracking-tight">OMNICORE</span>
      </div>
      <div class="flex items-center gap-2">
        <button class="h-9 w-9 grid place-items-center rounded-full bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"/><path d="M2 12a10 10 0 1 1 20 0"/></svg>
        </button>
        <button class="h-9 w-9 grid place-items-center rounded-full bg-white ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Help">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 15a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 12 17Zm1.501-6.75c-.799.549-1.001.85-1.001 1.75a1 1 0 0 1-2 0 3.62 3.62 0 0 1 1.649-3.17c.799-.55 1.001-.85 1.001-1.75a1.5 1.5 0 1 0-3 0 1 1 0 1 1-2 0 3.5 3.5 0 1 1 7 0 3.62 3.62 0 0 1-1.649 3.17Z"/></svg>
        </button>
        <div class="h-9 w-9 rounded-full bg-slate-200 overflow-hidden grid place-items-center">
          <svg v-if="!user.avatarUrl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 text-slate-600" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"/></svg>
          <img v-else :src="user.avatarUrl" alt="avatar" class="h-full w-full object-cover" />
        </div>
      </div>
    </header>

    <main class="flex-1 px-6 py-6">
      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="h-16 w-16 rounded-full bg-slate-100 grid place-items-center overflow-hidden">
              <img v-if="user.avatarUrl" :src="user.avatarUrl" alt="User" class="h-full w-full object-cover" />
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-8 w-8 text-slate-500" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"/></svg>
            </div>
            <div>
              <h2 class="text-xl font-semibold">Welcome back, {{ user.name }}</h2>
              <p class="text-sm text-slate-600">Employee ID: {{ user.employeeId }} • {{ user.title }}</p>
            </div>
          </div>
          <div class="mt-6 flex items-center gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold tabular-nums">{{ hours }}</div>
              <div class="text-xs text-slate-500">HOURS</div>
            </div>
            <div class="text-2xl text-slate-300">:</div>
            <div class="text-center">
              <div class="text-3xl font-bold tabular-nums">{{ mins }}</div>
              <div class="text-xs text-slate-500">MINS</div>
            </div>
            <div class="text-2xl text-slate-300">:</div>
            <div class="text-center">
              <div class="text-3xl font-bold tabular-nums">{{ secs }}</div>
              <div class="text-xs text-slate-500">SECS</div>
            </div>
          </div>
          <button
            class="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
            @click="startShift"
          >
            Start New Shift
          </button>
          <p class="mt-3 text-center text-sm text-slate-500">
            Not {{ user.name }}? Switch user
          </p>
        </div>

        <div class="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
          <div class="flex items-start justify-between">
            <h3 class="text-lg font-semibold">Current Shift Summary</h3>
            <span class="rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 ring-1 ring-emerald-200">
              {{ shiftActive ? 'ACTIVE' : 'INACTIVE' }}
            </span>
          </div>
          <div class="mt-4 space-y-4">
            <div class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 grid place-items-center rounded-lg bg-blue-50 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M3 3h18v2H3zM3 7h18v2H3zM3 11h18v2H3zM3 15h18v2H3zM3 19h18v2H3z"/></svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Total Orders</span>
              </div>
              <div class="text-2xl font-bold tabular-nums">{{ store.stats.totalOrders }}</div>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 grid place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M12 1a9 9 0 1 0 9 9A9.01 9.01 0 0 0 12 1Zm1 14.93V17h-2v-1a4 4 0 0 1-4-4h2a2 2 0 0 0 2 2v-3.93a3.996 3.996 0 1 1 2 7.86Z"/></svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Total Revenue</span>
              </div>
              <div class="text-2xl font-bold tabular-nums">${{ store.stats.totalRevenue.toFixed(2) }}</div>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 grid place-items-center rounded-lg bg-slate-100 text-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M20.285 2.998a1 1 0 0 0-1.567-1.257l-9.724 12.125L5.2 10.524a1 1 0 0 0-1.4 1.428l4.5 4.412a1 1 0 0 0 1.493-.093Z"/></svg>
                </div>
                <span class="text-sm font-medium text-slate-700">Sync Status</span>
              </div>
              <div
                :class="[
                  'text-sm font-semibold px-3 py-1 rounded-full',
                  store.stats.allSynced ? 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200' : 'text-amber-700 bg-amber-50 ring-1 ring-amber-200'
                ]"
              >
                {{ store.stats.allSynced ? 'All Synchronized' : 'Pending Sync' }}
              </div>
            </div>
          </div>
          <button
            class="mt-6 w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            @click="closeShift"
          >
            Close Shift & Print Report
          </button>
        </div>
      </div>

      <div class="mt-6 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
        Your shift started today at 08:00 AM. Make sure to reconcile all cash payments before closing.
      </div>
    </main>

    <footer class="flex items-center justify-between px-6 py-4 text-xs text-slate-500">
      <div class="space-x-2">
        <span>POS TERMINAL: #RX-882</span>
        <span>•</span>
        <span>BUILD: 4.2.0-STABLE</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="inline-flex items-center gap-1" :class="store.isOnline ? 'text-emerald-700' : 'text-slate-600'">
          <span class="h-2 w-2 rounded-full" :class="store.isOnline ? 'bg-emerald-500' : 'bg-slate-400'"></span>
          {{ store.isOnline ? 'ONLINE' : 'OFFLINE' }}
        </span>
        <span class="inline-flex items-center gap-1 text-emerald-700">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          DATABASE CONNECTED
        </span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>


import { createRouter, createWebHistory } from 'vue-router';
import SalesView from '../components/SalesView.vue';
import OrdersView from '../views/OrdersView.vue';

const routes = [
  { path: '/', name: 'sales', component: SalesView },
  { path: '/orders/:id?', name: 'orders', component: OrdersView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});


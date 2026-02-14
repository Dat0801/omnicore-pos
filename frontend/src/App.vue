<script setup>
import { ref } from 'vue'
import PinLogin from './components/PinLogin.vue'

const loggedIn = ref(false)
</script>

<template>
  <div>
    <PinLogin v-if="!loggedIn" @success="loggedIn = true" />
    <router-view v-else />
  </div>
</template>

<style>
</style>

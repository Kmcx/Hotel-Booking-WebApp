<template>
  <Header />
  <router-view />
</template>

<script setup>
import Header from './components/Header.vue'
</script>

<style scoped>
/* İsteğe bağlı logo stili (kaldırılabilir) */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

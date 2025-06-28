<template>
  <header class="bg-white shadow-md p-4 flex justify-between items-center">
    <h1 class="text-2xl font-bold text-blue-600">HotelWebApp</h1>
    
    <div v-if="user" class="flex items-center gap-4">
      <span class="text-gray-700">Merhaba, {{ user.name }}</span>
      <button @click="logout" class="text-sm bg-red-500 text-white px-3 py-1 rounded">Çıkış</button>
    </div>

    <div v-else class="flex gap-2">
      <router-link to="/login" class="text-sm bg-blue-500 text-white px-3 py-1 rounded">Giriş Yap</router-link>
      <router-link to="/register" class="text-sm border border-blue-500 text-blue-500 px-3 py-1 rounded">Kayıt Ol</router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// Örnek kullanıcı: Gerçekte bu bilgi login sonrası Vuex veya Pinia ile alınır
const user = ref(null)
// const user = ref({ name: "Kutay" })

function logout() {
  user.value = null
}
</script>

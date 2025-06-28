<template>
  <header class="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
    <!-- Sol: Logo / Uygulama İsmi -->
    <router-link to="/" class="text-2xl font-extrabold text-gray-800 hover:text-blue-600 transition">
      🏨 HotelApp
    </router-link>

    <!-- Sağ: Kullanıcı / Giriş Kısmı -->
    <div class="space-x-4 flex items-center">
      <template v-if="userStore.user">
        <span class="text-sm text-gray-700">
          Welcome, <strong>{{ userStore.user.name || userStore.user.email }}</strong>
        </span>
        <button
          @click="logout"
          class="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition text-sm"
        >
          Logout
        </button>
      </template>

      <template v-else>
        <router-link
          to="/login"
          class="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
        >
          Login
        </router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="header">
    <router-link to="/" class="header-title">🏨 HotelApp</router-link>

    <template v-if="userStore.user">
      <div>
        <span style="margin-right: 1rem;">Welcome, {{ userStore.user.name || userStore.user.email }}</span>
        <button @click="logout" class="header-button">Logout</button>
      </div>
    </template>

    <template v-else>
      <router-link to="/login" class="header-button">Login</router-link>
    </template>
  </header>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import './Header.css' 

const userStore = useUserStore()
const router = useRouter()

const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>

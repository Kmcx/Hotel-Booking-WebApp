<template>
  <header class="header">
    <router-link to="/" class="header-title">
      <div class="main-title">FindHotel🏨</div>
      <div class="sub-title">by Kmc</div>
    </router-link>

    <div class="header-right">
      <template v-if="userStore.user">
        <span class="user-greeting">Welcome, {{ userStore.user.name || userStore.user.email }}</span>
        <button @click="logout" class="header-button">Logout</button>
      </template>

      <template v-else>
        <router-link to="/login" class="header-button">Login</router-link>
      </template>
    </div>
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

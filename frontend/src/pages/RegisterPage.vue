<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200 px-4">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">Create your account</h2>
      
      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- Hata Mesajı -->
        <p v-if="errorMessage" class="text-red-600 text-sm text-center mb-2">
          {{ errorMessage }}
        </p>

        <input v-model="name" type="text" placeholder="Name" class="input" />
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Password" class="input" />
        <input v-model="country" type="text" placeholder="Country" class="input" />
        <input v-model="city" type="text" placeholder="City" class="input" />
        <input type="file" @change="handleFileUpload" class="input" />

        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Register
        </button>
      </form>

      <router-link to="/login" class="block text-center text-sm text-blue-600 hover:underline mt-4">
        Already have an account? Login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const name = ref('')
const email = ref('')
const password = ref('')
const country = ref('')
const city = ref('')
const photo = ref(null)
const errorMessage = ref('')

const router = useRouter()
const userStore = useUserStore()

const handleFileUpload = (e) => {
  photo.value = e.target.files[0]
}

const handleRegister = async () => {
  errorMessage.value = ''

  if (!name.value || !email.value || !password.value || !country.value || !city.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  const passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
  if (!passwordRegex.test(password.value)) {
    errorMessage.value = 'Password must be at least 8 characters, include 1 number and 1 special character.'
    return
  }

  try {
    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('email', email.value)
    formData.append('password', password.value)
    formData.append('country', country.value)
    formData.append('city', city.value)
    if (photo.value) {
      formData.append('photo', photo.value)
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (!res.ok) {
      errorMessage.value = data.error || 'Register failed'
      return
    }

    userStore.login(data.user, data.token)
    router.push('/')
  } catch (err) {
    errorMessage.value = err.message || 'Register failed'
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
</style>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200 px-4">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">Create your account</h2>
      
      <form @submit.prevent="handleRegister" class="space-y-5">
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

const router = useRouter()
const userStore = useUserStore()

const handleFileUpload = (e) => {
  photo.value = e.target.files[0]
}

const handleRegister = async () => {
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

    if (!res.ok) throw new Error('Register failed')
    const data = await res.json()
    userStore.login(data.user, data.token)
    router.push('/')
  } catch (err) {
    alert(err.message || 'Register failed')
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

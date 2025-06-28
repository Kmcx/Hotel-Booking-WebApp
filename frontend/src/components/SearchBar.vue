<template>
  <form @submit.prevent="handleSearch" class="flex flex-wrap items-center gap-4 bg-white p-4 shadow rounded-lg">
    <input v-model="city" type="text" placeholder="Şehir" class="p-2 border rounded w-full sm:w-auto" />

    <input v-model="startDate" type="date" class="p-2 border rounded w-full sm:w-auto" />
    <input v-model="endDate" type="date" class="p-2 border rounded w-full sm:w-auto" />

    <input v-model="guestCount" type="number" min="1" placeholder="Kişi sayısı"
      class="p-2 border rounded w-full sm:w-auto" />

    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Ara
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const city = ref('')
const startDate = ref('')
const endDate = ref('')
const guestCount = ref(1)

const router = useRouter()

function handleSearch() {
  const query = {
    city: city.value,
    start: startDate.value,
    end: endDate.value,
    guests: guestCount.value,
  }

  // 🔁 Arama sonuçları sayfasına yönlendirme
  router.push({ path: '/search', query })
}
</script>

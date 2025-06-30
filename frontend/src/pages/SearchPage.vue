<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold mb-4">Search Results</h1>

    <div class="flex space-x-4 mb-4">
      <select v-model="sortBy" @change="fetchHotels" class="border rounded px-3 py-1">
        <option disabled value="">Sort by</option>
        <option value="price">Price: Low to High</option>
        <option value="rating">Rating: High to Low</option>
      </select>
    </div>

    <HotelCard
      v-for="(hotel, index) in hotels"
      :key="index"
      :hotel="hotel"
      :loggedIn="true"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import HotelCard from '../components/HotelCard.vue'
import axios from 'axios'

const route = useRoute()
const hotels = ref([])
const sortBy = ref('')

const fetchHotels = async () => {
  try {
    const params = {
      city: route.query.city,
      sortBy: sortBy.value || undefined,
    }

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/hotels`, {
      params,
    })

    hotels.value = res.data
  } catch (error) {
    console.error('Error fetching hotels:', error)
  }
}

onMounted(() => {
  fetchHotels()
})
</script>

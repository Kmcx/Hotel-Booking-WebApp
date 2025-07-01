<template>
  <div class="p-6 space-y-4">
    <h1 class="page-title">Search Results</h1>

    <!-- Sıralama Menüsü -->
    <div class="sort-menu flex space-x-4 mb-4">
      <select v-model="sortBy" @change="fetchHotels" class="border rounded px-3 py-1">
        <option disabled value="">Sort by</option>
        <option value="price">Price: Low to High</option>
        <option value="rating">Rating: High to Low</option>
      </select>
    </div>

    <!-- Otel Kartları -->
    <HotelCard
      v-for="(hotel, index) in hotels"
      :key="index"
      :hotel="hotel"
      :loggedIn="true"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import HotelCard from '../components/HotelCard.vue'

const hotels = ref([])
const sortBy = ref('')

const route = useRoute()

const fetchHotels = async () => {
  try {
    const { city, start, end, guests } = route.query

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/hotels`, {
      params: {
        city,
        start,
        end,
        guests,
        sortBy: sortBy.value || undefined
      }
    })

    hotels.value = res.data
  } catch (error) {
    console.error('Error fetching hotels:', error)
  }
}

// İlk yüklemede çalışsın
onMounted(() => {
  fetchHotels()
})

// Query parametreleri değişirse tekrar filtreleme yap
watch(() => route.query, fetchHotels)
</script>

<style scoped>
.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4b70d6; /* Tailwind blue-700 */
  margin-bottom: 1rem;
  justify-content: flex-start; 
}

.sort-menu select {
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #ffffff;
  color: #333;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
    justify-content: flex-start; 
}

.sort-menu select:focus {
  border-color: #2563eb; /* Mavi odak çizgisi */
  outline: none;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3); /* Mavi iç gölge */
}

</style>
<template>
  <div>
    <SearchBar />

    <div class="home-layout">
      <aside class="sidebar">
        <div class="map-box" @click="goToMap">🗺️ Haritada Göster</div>
        <div class="filter-title">
          <strong>Konaklama yeri adına göre ara</strong>
        </div>
      </aside>

      <!-- Sağ: Otel kartları -->
      <section class="hotel-list">
        Available hotels for this weekend and next weekend in
        <div v-if="filteredHotels.length === 0" class="text-gray-500 p-4">
          <template v-if="!userStore.user && !detectedCountry">
            Loading location info...
          </template>
          <template v-else-if="!userCountry">
            Unable to detect your country.
          </template>
          <template v-else>
            No hotels available for this or next weekend in {{ userCountry }}.
          </template>
        </div>

        <HotelCard
          v-for="hotel in filteredHotels"
          :key="hotel._id"
          :hotel="hotel"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import SearchBar from '../components/SearchBar.vue'
import HotelCard from '../components/HotelCard.vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import './HomePage.css'

const hotels = ref([])
const detectedCountry = ref(null)
const userStore = useUserStore()
const router = useRouter()

function goToMap() {
  router.push('/map')
}

// 🔄 İki haftalık hafta sonu tarihlerini al (Cumartesi + Pazar)
const getWeekendDates = () => {
  const today = new Date()
  const thisSaturday = new Date(today)
  thisSaturday.setDate(today.getDate() + ((6 - today.getDay()) % 7))
  const thisSunday = new Date(thisSaturday)
  thisSunday.setDate(thisSaturday.getDate() + 1)

  const nextSaturday = new Date(thisSaturday)
  nextSaturday.setDate(thisSaturday.getDate() + 7)
  const nextSunday = new Date(nextSaturday)
  nextSunday.setDate(nextSaturday.getDate() + 1)

  return [
    thisSaturday.toISOString().split('T')[0],
    thisSunday.toISOString().split('T')[0],
    nextSaturday.toISOString().split('T')[0],
    nextSunday.toISOString().split('T')[0],
  ]
}

const [sat1, sun1, sat2, sun2] = getWeekendDates()


const COUNTRY_CODES = {
  TR: 'Türkiye',
  US: 'United States',
  DE: 'Germany',
  FR: 'France'
}

const userCountry = computed(() => {
  if (userStore.user?.country) return userStore.user.country
  return COUNTRY_CODES[detectedCountry.value] || null
})

onMounted(async () => {
  try {
    const ipRes = await axios.get('https://api.country.is')
    detectedCountry.value = ipRes.data.country
  } catch (err) {
    console.warn('Could not detect country from IP:', err)
  }

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hotels`)
    console.log("Hotel API response:", response.data)

    const processedHotels = response.data.map(hotel => {
      hotel.available = Array.isArray(hotel.available)
        ? hotel.available.map(d =>
            typeof d === 'string' ? d : new Date(d).toISOString().split('T')[0]
          )
        : []
      return hotel
    })

    hotels.value = processedHotels

    console.log("All hotels:", hotels.value.map(h => ({
      name: h.name,
      country: h.country,
      available: h.available,
      rating: h.rating
    })))
  } catch (err) {
    console.error('Error fetching hotels from backend:', err)
  }
})

const filteredHotels = computed(() => {
  if (!userCountry.value) return []

  return hotels.value
    .filter(hotel =>
      hotel.country === userCountry.value &&
      hotel.available?.some(date => [sat1, sun1, sat2, sun2].includes(date))
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
})
</script>

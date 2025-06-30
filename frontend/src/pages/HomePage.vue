<template>
  <div>
    <SearchBar />

    <div class="home-layout">
      <div class="hotel-cards-with-map">
        <!-- Sol: Otel kartları -->
        <div class="hotel-cards">
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
        </div>

        <!-- Sağ: Harita -->
        <div class="hotel-map-area">
          <HotelMap v-if="filteredHotels.length" :hotels="filteredHotels" />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import SearchBar from '../components/SearchBar.vue'
import HotelCard from '../components/HotelCard.vue'
import HotelMap from '../components/HotelMap.vue'
import { useUserStore } from '../stores/userStore'

const hotels = ref([])
const detectedCountry = ref(null)
const userStore = useUserStore()

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
    const processedHotels = response.data.map(hotel => {
      hotel.available = Array.isArray(hotel.available)
        ? hotel.available.map(d =>
            typeof d === 'string' ? d : new Date(d).toISOString().split('T')[0]
          )
        : []
      return hotel
    })

    hotels.value = processedHotels
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



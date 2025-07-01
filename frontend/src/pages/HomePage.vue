<template>
  <div class="home-container">
    <!-- Search bar -->
    <div class="search-bar-wrapper">
      
      <SearchBar />
    </div>

    <!-- Kartlar ve harita yan yana -->
    <div class="home-layout">
      <div class="hotel-cards-with-map">
        <!-- Otel Kartları (Sol) -->
        <div class="hotel-cards">
          <div class="hotel-cards-title"> Available rooms in this and next weekend! </div>
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

        <!-- Harita (Sağ) -->
        <div class="hotel-map-area">
         <div class="map button">
          <HotelMap v-if="filteredHotels.length" :hotels="filteredHotels" />
         </div>
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

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

/* Üstteki arama barı */
.search-bar-wrapper {
  width: 100%;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

/* Flex düzen (masaüstü görünüm) */
.hotel-cards-with-map {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* Sol: Otel kartları */
.hotel-cards {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Sağ: Harita 
.hotel-map-area {
  width: 30%;
  min-height: 400px;
  background-color: #eef2f5;
  border-radius: 10px;
  overflow: hidden;
  position: sticky;
  top: 100px;
}
*/
/* Harita kutusu */
.map.button {
  width: 100%;
  height: 105%;
  position: relative;
  background-color: #81beff;
}

/* ✅ RESPONSIVE EKLEME */
@media (max-width: 768px) {
  .hotel-cards-with-map {
    flex-direction: column;
  }

  .hotel-cards,
  .hotel-map-area {
    width: 100%;
    max-width: 100%;
  }

  .hotel-map-area {
    position: static;
    top: auto;
    margin-top: 16px;
  }
}

</style>

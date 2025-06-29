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

      <section class="hotel-list">
        <HotelCard
          v-for="hotel in hotels"
          :key="hotel.id"
          :hotel="hotel"
          :logged-in="true"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import HotelCard from '../components/HotelCard.vue'
import { useRouter } from 'vue-router'
import './HomePage.css'

const hotels = ref([])
const router = useRouter()

function goToMap() {
  router.push('/map')
}

onMounted(async () => {
  try {
    const res = await fetch('/hotels.json')
    if (!res.ok) throw new Error('Local hotels.json not found')
    const data = await res.json()
    hotels.value = data
  } catch (err) {
    console.error('Error loading hotels:', err)
  }
})

</script>

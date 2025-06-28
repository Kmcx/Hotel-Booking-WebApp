<template>
  <div class="map-container">
    <Header />
    <SearchBar />
    <div id="map"></div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import SearchBar from '../components/SearchBar.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()

onMounted(() => {
  const map = L.map('map').setView([38.4237, 27.1428], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  const hotels = [
    {
      id: 1,
      name: "Palm Beach Hotel",
      lat: 38.42,
      lng: 27.13,
    },
    {
      id: 2,
      name: "Mountain View Resort",
      lat: 38.45,
      lng: 27.15,
    }
  ]

  hotels.forEach(hotel => {
    const marker = L.marker([hotel.lat, hotel.lng]).addTo(map)
    marker.bindPopup(`<b>${hotel.name}</b><br><button id="goto-${hotel.id}">Detay</button>`)

    marker.on('popupopen', () => {
      setTimeout(() => {
        const btn = document.getElementById(`goto-${hotel.id}`)
        if (btn) {
          btn.onclick = () => {
            router.push(`/hotel/${hotel.id}`)
          }
        }
      }, 10)
    })
  })
})
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.map-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

#map {
  flex: 1;
  width: 100%;
}
</style>

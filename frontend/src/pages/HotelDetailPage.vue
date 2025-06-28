<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-blue-700">{{ hotel.name }}</h1>

    <div class="text-gray-600">
      ⭐ {{ hotel.rating }} / 5 ({{ hotel.commentCount }} yorum)
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="amenity in hotel.amenities"
        :key="amenity"
        class="text-sm text-gray-800"
      >
        ✔️ {{ amenity }}
      </div>
    </div>

    <div id="map" class="w-full h-64 rounded shadow" />

    <ReviewChart :ratings="ratingsByService" />

    <div>
      <h2 class="text-xl font-semibold mt-6 mb-2">Yorumlar</h2>
      <ul class="list-disc list-inside text-gray-700">
        <li v-for="comment in hotel.comments" :key="comment">{{ comment }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHotelStore } from '../stores/HotelStore'
import ReviewChart from '../components/ReviewChart.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const route = useRoute()
const hotel = ref({})
const hotelStore = useHotelStore()

const ratingsByService = {
  Temizlik: 9.6,
  'Personel ve servis': 9.6,
  'İmkan ve özellikler': 9.4,
  'Konum ve kolaylık': 9.4,
  'Çevre dostluğu': 9.4
}

onMounted(() => {
  const id = route.params.id
  const result = hotelStore.getHotelById(id)
  if (result) {
    hotel.value = result

    const map = L.map('map').setView([result.lat, result.lng], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)
    L.marker([result.lat, result.lng]).addTo(map).bindPopup(result.name)
  }
})
</script>

<style>
#map {
  height: 100%;
}
</style>

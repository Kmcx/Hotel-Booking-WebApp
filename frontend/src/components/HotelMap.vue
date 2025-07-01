<template>
  <div class="map-wrapper">
    <!-- Statik harita önizleme -->
    <img src="/map-preview.png" class="map-preview" @click="showMap = true" />
    <button class="map-button" @click="showMap = true">See On Map</button>
    <p v-if="address" class="hotel-address">{{ address }}</p>

    <!-- Harita Lightbox -->
    <div v-if="showMap" class="map-lightbox">
      <div id="map" class="leaflet-map"></div>
      <button class="close-btn" @click="closeMap">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  coordinates: Object,     // tekil kullanım için
  name: String,            // tekil kullanım için
  address: String,
  hotels: Array            // çoklu otel için (HomePage gibi)
})

const showMap = ref(false)
let mapInstance = null

const closeMap = () => {
  showMap.value = false
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
}

const setupMap = () => {
  if (mapInstance) return

  const mapCenter = props.coordinates || (props.hotels?.[0]?.coordinates || { lat: 0, lng: 0 })
  if (!mapCenter.lat || !mapCenter.lng) return

  mapInstance = L.map('map').setView([mapCenter.lat, mapCenter.lng], 6)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapInstance)

  // Tekil kullanım (HotelDetailPage)
  if (props.coordinates && props.name) {
    L.marker([props.coordinates.lat, props.coordinates.lng])
      .addTo(mapInstance)
      .bindPopup(props.name)
  }

  // Çoklu otel desteği (HomePage)
  if (props.hotels?.length) {
    props.hotels.forEach(hotel => {
      if (hotel.coordinates?.lat && hotel.coordinates?.lng) {
        L.marker([hotel.coordinates.lat, hotel.coordinates.lng])
          .addTo(mapInstance)
          .bindPopup(hotel.name)
      }
    })
  }
}

watch(showMap, async (val) => {
  if (val) {
    await nextTick()
    setupMap()
  }
})
</script>

<style scoped>
.map-wrapper {
  margin-top: 0;
}
.map-preview {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}
.map-button {
  padding: 8px 24px;        /* içerikten dolayı genişlik artar */
  width: auto;              /* içeriğe göre doğal genişlik */
  min-width: 160px;         /* en az bu kadar geniş olsun */
  max-width: 100%;          /* çevresini aşmasın */
  display: inline-block;    /* sadece kendini etkiler */
  background-color: #81beff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}


.hotel-address {
  margin-top: 8px;
  font-style: italic;
}
.map-lightbox {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);
  z-index: 1000;
  border: 2px solid #ddd;
  border-radius: 12px;
  background: white;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
}
.leaflet-map {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}
.close-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 24px;
  background: rgb(255, 0, 0);
  border: none;
  cursor: pointer;
  color: #ffffff;
}
</style>
<template>
  <div class="hotel-detail-container" v-if="hotel">
    <!-- ÜST BİLGİ -->
    <div class="top-section">
      <LeftHotelInfo
      :hotel="hotel"
      :is-logged-in="isLoggedIn"
      :review-count="reviewCount"
    />


      <!-- HARİTA COMPONENT -->
      <HotelMap
        :coordinates="hotel.coordinates"
        :name="hotel.name"
        :address="hotel.address"
      />
    </div>

    <!-- GÖRSELLER -->
    <div class="gallery">
      <img
        v-for="(img, i) in hotel.images"
        :key="i"
        :src="img"
        class="gallery-image"
        @click="openLightbox(i)"
      />
    </div>

    <!-- LIGHTBOX (resimler) -->
    <div v-if="lightboxOpen" class="lightbox">
      <img :src="hotel.images[lightboxIndex]" class="lightbox-img" />
      <button class="close-btn" @click="lightboxOpen = false">×</button>
      <button class="nav-btn left" @click="prevImage">‹</button>
      <button class="nav-btn right" @click="nextImage">›</button>
    </div>

    <!-- GRAFİK -->
    <div class="ratings-section">
      <ReviewChart :ratings="ratingsByService" />
    </div>

    <!-- YORUMLAR -->
    <HotelComments v-if="hotel" :hotelId="hotel._id" />
  </div>

  <div v-else class="loading">Loading hotel details...</div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import ReviewChart from '../components/ReviewChart.vue'
import HotelComments from '../components/HotelComments.vue'
import HotelMap from '../components/HotelMap.vue'
import { useUserStore } from '../stores/userStore'
import './HotelDetailPage.css'
import LeftHotelInfo from '../components/LeftHotelInfo.vue'


const route = useRoute()
const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)

const hotel = ref(null)
const ratingsByService = ref({})
const reviewCount = ref(0)

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (index) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
}
const nextImage = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % hotel.value.images.length
}
const prevImage = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + hotel.value.images.length) % hotel.value.images.length
}

onMounted(async () => {
  const id = route.params.id
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/hotels/${id}`)
    hotel.value = res.data

    if (hotel.value) {
      await nextTick()
      await fetchRatingsSummary(hotel.value._id)
    }
  } catch (err) {
    console.error('Failed to load hotel detail:', err)
  }
})

const fetchRatingsSummary = async (hotelId) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/summary/${hotelId}`)
    const avg = res.data.averages
    reviewCount.value = res.data.totalReviews || 0
    ratingsByService.value = {
      Temizlik: parseFloat(avg.cleanliness || 0),
      'Personel ve servis': parseFloat(avg.staff || 0),
      'İmkan ve özellikler': parseFloat(avg.features || 0),
      'Konum ve kolaylık': parseFloat(avg.location || 0)
    }
  } catch (err) {
    console.error('Puan ortalaması yüklenemedi:', err)
  }
}
</script>

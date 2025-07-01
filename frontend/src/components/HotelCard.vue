<template>
  
  <div class="hotel-card-wide" @click="goToDetail" style="cursor: pointer;">
    <!-- Swiper (varsa resim) -->
    <div class="hotel-image-slider" v-if="hotel.images?.length">
      <Swiper
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 3000 }"
        :pagination="{ clickable: true }"
        :modules="[Autoplay, Pagination]"
        class="hotel-swiper"
      >
        <SwiperSlide v-for="(img, index) in hotel.images" :key="index">
          <img :src="img" class="carousel-image" alt="Hotel Image" />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Otel Bilgileri -->
    <div class="hotel-info">
      <div class="hotel-top">
        <h2 class="hotel-name">{{ hotel.name }}</h2>
        <div class="hotel-rating">
          ⭐ {{ hotel.rating }} / 5 ({{ reviewCount }} review{{ reviewCount === 1 ? '' : 's' }})
        </div>
        <div class="hotel-features">
          <span
            v-for="(amenity, index) in hotel.amenities"
            :key="index"
            class="amenity-tag"
          >
            • {{ amenity }}
          </span>
        </div>
      </div>

      <div class="hotel-bottom">
        <div class="hotel-price">
          <span v-if="userStore.user && hotel.discountedPrice">
            {{ hotel.discountedPrice }} TL
            <span class="original-price">{{ hotel.pricePerNight }} TL</span>
          </span>
          <span v-else>
            {{ hotel.pricePerNight }} TL
          </span>
        </div>
        <div v-if="userStore.user && hotel.isMemberOnly" class="hotel-discount">
          Member Only Discount
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import axios from 'axios'

import 'swiper/css'
import 'swiper/css/pagination'
import './HotelCard.css'

const { hotel } = defineProps({ hotel: Object })

const router = useRouter()
const userStore = useUserStore()
const reviewCount = ref(0)

const goToDetail = () => {
  router.push(`/hotel/${hotel._id}`)
}

onMounted(async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/summary/${hotel._id}`)
    reviewCount.value = res.data.totalReviews || 0
  } catch (err) {
    console.error('Failed to load review count:', err)
  }
})
</script>



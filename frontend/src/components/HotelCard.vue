<template>
  <div class="hotel-card-wide">
    <!-- Swiper (varsa resim) -->
    <div class="hotel-image-slider" v-if="hotel.images?.length">
      <Swiper
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 3000 }"
        :pagination="{ clickable: true }"
        :navigation="true"
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
          ⭐ {{ hotel.rating }} / 5 ({{ hotel.commentCount ?? 0 }} reviews)
        </div>
        <div class="hotel-features">
          <span v-if="hotel.amenities?.includes('breakfast')">🥐 Breakfast</span>
          <span v-if="hotel.amenities?.includes('pool')">🏊 Pool</span>
          <span v-if="hotel.amenities?.includes('wifi')">📶 Wifi</span>
          <span v-if="hotel.amenities?.includes('seaView')">🌊 Sea View</span>
        </div>
      </div>

      <div class="hotel-bottom">
        <div class="hotel-price">{{ displayPrice }} TL</div>
        <div v-if="userStore.user && hotel.isMemberOnly" class="hotel-discount">
          Member Only Discount
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const { hotel } = defineProps({
  hotel: Object
})

const userStore = useUserStore()

const displayPrice = computed(() => {
  if (userStore.user && hotel.discountedPrice) return hotel.discountedPrice
  return hotel.pricePerNight
})
</script>

<style scoped>
.hotel-card-wide {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: white;
  margin-bottom: 1.5rem;
}

.hotel-image-slider {
  width: 220px;
  height: 160px;
  flex-shrink: 0;
  background-color: #f3f4f6;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hotel-swiper {
  width: 100%;
  height: 100%;
}

::v-deep(.swiper-button-prev),
::v-deep(.swiper-button-next) {
  z-index: 10;
  color: #1f2937;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotel-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}

.hotel-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.hotel-rating {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.hotel-features span {
  display: inline-block;
  margin-right: 0.5rem;
  font-size: 0.85rem;
  color: #334155;
}

.hotel-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 0.75rem;
}

.hotel-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #1d4ed8;
}

.hotel-discount {
  font-size: 0.9rem;
  color: #dc2626;
  font-weight: 500;
}
</style>

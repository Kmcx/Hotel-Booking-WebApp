<template>
  <div class="hotel-card-wide">
    <!-- Sol: Otel görselleri (şimdilik ilk resim) -->
    <div class="hotel-image-slider">
      <img :src="hotel.images?.[0]" alt="Hotel Image" />
    </div>

    <!-- Sağ: Otel detayları -->
    <div class="hotel-info">
      <div class="hotel-top">
        <h2 class="hotel-name">{{ hotel.name }}</h2>
        <div class="hotel-rating">
          ⭐ {{ hotel.rating }} / 5 ({{ hotel.commentCount }} reviews)
        </div>
        <div class="hotel-features">
          <span v-if="hotel.features?.includes('breakfast')">🥐 Breakfast Included</span>
          <span v-if="hotel.features?.includes('pool')">🏊 Pool</span>
          <span v-if="hotel.features?.includes('wifi')">📶 Wifi</span>
          <!-- Daha fazla özellik eklenebilir -->
        </div>
      </div>

      <div class="hotel-bottom">
        <div class="hotel-price">
          {{ displayPrice }} TL
        </div>
        <div v-if="hotel.specialDiscount" class="hotel-discount">
          %{{ hotel.specialDiscount }} off!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { hotel, loggedIn } = defineProps({
  hotel: Object,
  loggedIn: Boolean
})

const displayPrice = computed(() => {
  if (loggedIn && hotel.memberPrice) return hotel.memberPrice
  return hotel.price
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
}

.hotel-image-slider {
  width: 220px;
  height: 160px;
  flex-shrink: 0;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hotel-image-slider img {
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

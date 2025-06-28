<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-bold mb-4">Arama Sonuçları</h1>

    <HotelCard
      v-for="(hotel, index) in hotels"
      :key="index"
      :hotel="hotel"
      :loggedIn="true"
    />
  </div>
</template>

<script setup>
import HotelCard from '../components/HotelCard.vue'
import { ref } from 'vue'

const hotels = ref([
  {
    name: "Palm Beach Hotel",
    rating: 4.7,
    commentCount: 120,
    price: 1450,
    memberPrice: 1305,
    specialDiscount: 10,
    flagged: true,
    image: "https://via.placeholder.com/400x300.png?text=Otel+1"
  },
  {
    name: "Mountain View Resort",
    rating: 4.3,
    commentCount: 87,
    price: 980,
    memberPrice: 882,
    flagged: false,
    image: "https://via.placeholder.com/400x300.png?text=Otel+2"
  }
])
</script>

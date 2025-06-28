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
import { useHotelStore } from '../stores/HotelStore'

const hotelStore = useHotelStore()

const hotels = [
  {
    id: '1',
    name: "Palm Beach Hotel",
    rating: 4.7,
    commentCount: 120,
    price: 1450,
    memberPrice: 1305,
    specialDiscount: 10,
    flagged: true,
    image: "https://source.unsplash.com/featured/?hotel,beach"
  },
  {
    id: '2',
    name: "Mountain View Resort",
    rating: 4.3,
    commentCount: 87,
    price: 980,
    memberPrice: 882,
    flagged: false,
    image: "https://source.unsplash.com/featured/?hotel,mountain"
  }
]

hotelStore.setHotels(hotels)
</script>

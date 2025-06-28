<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto">
    <img :src="hotel.image" alt="hotel" class="w-full h-48 object-cover" />

    <div class="p-4 space-y-1">
      <h2 class="text-xl font-bold text-gray-800">{{ hotel.name }}</h2>

      <div class="text-sm text-gray-600">
        ⭐ {{ hotel.rating }} / 5 ({{ hotel.commentCount }} yorum)
      </div>

      <div class="text-lg font-semibold text-blue-700">
        {{ displayPrice }} TL
      </div>

      <div v-if="hotel.specialDiscount" class="text-red-600 text-sm">
        %{{ hotel.specialDiscount }} indirim!
      </div>

      <div v-if="!loggedIn && hotel.flagged" class="text-sm text-gray-500 italic">
        Üye fiyatı için giriş yapın
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


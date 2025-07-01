<template>
  <div class="left-info">
    <h1 class="hotel-name">{{ hotel.name }}</h1>

    <div class="info-group">
      <p class="rating">⭐ {{ hotel.rating }} / 5 – {{ reviewCount }} yorum</p>
      <p class="location">{{ hotel.city }}, {{ hotel.country }}</p>

      <p class="room-types">
        Room Types:
        <span v-for="n in hotel.maxGuests" :key="n">
          {{ n }} people<span v-if="n !== hotel.maxGuests">, </span>
        </span>
      </p>
    </div>

    <div class="amenities">
      <div v-for="amenity in hotel.amenities" :key="amenity" class="amenity">
        ✔️ {{ amenity }}
      </div>
    </div>

    <div class="price-box">
      <span class="discounted">
        {{ isLoggedIn && hotel.discountedPrice ? hotel.discountedPrice : hotel.pricePerNight }} ₺
      </span>
      <span v-if="isLoggedIn && hotel.discountedPrice" class="original">
        {{ hotel.pricePerNight }} ₺
      </span>
    </div>
    <p class="tax-info">for 1 night – taxes included</p>
  </div>
</template>

<script setup>
defineProps({
  hotel: Object,
  isLoggedIn: Boolean,
  reviewCount: Number
})
</script>

<style scoped src="./LeftHotelInfo.css"></style>

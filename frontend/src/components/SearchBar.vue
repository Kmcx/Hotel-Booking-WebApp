<template>
   <div class="search-title">Where is your destination?</div>
  <form @submit.prevent="handleSearch" class="search-form">
    
    <input v-model="city" type="text" placeholder="City" class="search-input" />

    <input v-model="startDate" type="date" class="search-input" />
    <input v-model="endDate" type="date" class="search-input" />

    <input v-model="guestCount" type="number" min="1" placeholder="People" class="search-input" />

    <button type="submit" class="search-button">
      Search
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import './SearchBar.css' 

const city = ref('')
const startDate = ref('')
const endDate = ref('')
const guestCount = ref(1)

const router = useRouter()

function handleSearch() {
  const query = {
    city: city.value,
    start: startDate.value,
    end: endDate.value,
    guests: guestCount.value,
  }

  router.push({ path: '/search', query })
}
</script>

<template>
  <div class="map-preview" @click="goToMap">
    <div class="map-placeholder">🗺️ Open Map</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goToMap() {
  router.push('/map')
}
</script>

<style scoped>
.map-preview {
  width: 100%;
  height: 150px;
  background-color: #e2e8f0;
  border: 2px dashed #94a3b8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.map-placeholder {
  font-size: 0.9rem;
  color: #475569;
  font-weight: 600;
}
</style>

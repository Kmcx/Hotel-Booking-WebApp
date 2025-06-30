<template>
  <div class="hotel-detail-container" v-if="hotel">
    <!-- ÜST BİLGİ -->
    <div class="top-section">
      <div class="left-info">
        <h1 class="hotel-name">{{ hotel.name }}</h1>
        <p class="rating">⭐ {{ hotel.rating }} / 5 – {{ hotel.commentCount }} yorum</p>
        <p class="location">{{ hotel.city }}, {{ hotel.country }}</p>

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
        <p class="tax-info">1 gece için – vergiler dahil</p>
      </div>

      <div class="map-box">
        <div id="map" class="map"></div>
      </div>
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

    <!-- LIGHTBOX -->
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
    <div class="comments-section">
      <h2 class="comments-title">Yorumlar</h2>
      <ul class="comments-list">
        <li v-for="(c, i) in comments" :key="i" class="comment">
          <p class="comment-header">
            <span v-if="c.user?.country">{{ getFlagEmoji(c.user.country) }}</span>
            {{ c.user?.name || 'Anonim' }}
          </p>
          <p class="comment-date">📅 {{ formatDate(c.createdAt) }}</p>


          <p class="comment-text">{{ c.comment }}</p>

          <!-- Kategori Puanları -->
          <div class="comment-ratings">
            <p>Temizlik: {{ '⭐'.repeat(c.serviceRatings?.cleanliness || 0) }}</p>
            <p>Personel ve servis: {{ '⭐'.repeat(c.serviceRatings?.staff || 0) }}</p>
            <p>İmkan ve özellikler: {{ '⭐'.repeat(c.serviceRatings?.features || 0) }}</p>
            <p>Konum ve kolaylık: {{ '⭐'.repeat(c.serviceRatings?.location || 0) }}</p>
          </div>

          <p class="comment-reply">Otel yanıtı: Geri bildiriminiz için teşekkür ederiz.</p>
        </li>
      </ul>

      <p v-if="comments.length === 0" class="no-comments">Henüz yorum yok.</p>

    </div>

    <!-- YORUM FORMU -->
    <div class="comment-form-section">
      <h3 class="form-title">Yorum Yap</h3>

      <div v-if="isLoggedIn">
        <textarea
          v-model="newComment"
          class="comment-textarea"
          placeholder="Yorumunuzu yazın..."
        ></textarea>

        <div class="feature-ratings">
          <label>Temizlik:
            <select v-model="ratings.cleanliness">
              <option v-for="n in 10" :key="'c' + n" :value="n">{{ n }}</option>
            </select>
          </label>

          <label>Personel ve servis:
            <select v-model="ratings.staff">
              <option v-for="n in 10" :key="'s' + n" :value="n">{{ n }}</option>
            </select>
          </label>

          <label>İmkan ve özellikler:
            <select v-model="ratings.features">
              <option v-for="n in 10" :key="'f' + n" :value="n">{{ n }}</option>
            </select>
          </label>

          <label>Konum ve kolaylık:
            <select v-model="ratings.location">
              <option v-for="n in 10" :key="'l' + n" :value="n">{{ n }}</option>
            </select>
          </label>
        </div>


        <button @click="submitComment" class="submit-btn">Gönder</button>
      </div>

      <p v-else class="login-warning">
        Yorum yapmak için giriş yapmalısınız.
      </p>
    </div>
  </div>

  <div v-else class="loading">Loading hotel details...</div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import ReviewChart from '../components/ReviewChart.vue'
import axios from 'axios'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './HotelDetailPage.css'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)

const hotel = ref(null)
const ratingsByService = ref({})
let mapInstance = null

// LIGHTBOX
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
  lightboxIndex.value =
    (lightboxIndex.value - 1 + hotel.value.images.length) % hotel.value.images.length
}

const comments = ref([])

const fetchComments = async (hotelId) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/${hotelId}`)
    comments.value = res.data
  } catch (err) {
    console.error('Yorumlar yüklenemedi:', err)
  }
}



const setupMap = (lat, lng, name) => {
  if (!lat || !lng || mapInstance) return
  mapInstance = L.map('map').setView([lat, lng], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapInstance)
  L.marker([lat, lng]).addTo(mapInstance).bindPopup(name)
}

// YORUM FORMU
const newComment = ref('')
const ratings = ref({
  cleanliness: 0,
  staff: 0,
  features: 0,
  location: 0
})

const averageRating = computed(() => {
  const values = Object.values(ratings.value)
  const sum = values.reduce((acc, val) => acc + Number(val), 0)
  return values.length ? (sum / values.length).toFixed(1) : 0
})

const formatDate = (isoDate) => {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}


const COUNTRY_NAME_TO_CODE = {
  Türkiye: 'TR',
  Germany: 'DE',
  France: 'FR',
  UnitedStates: 'US',
  Canada : 'CA',
  GreatBritain: 'GB',
  Italy: 'IT',
  Spain: 'ES',
}

const getFlagEmoji = (country) => {
  const code = COUNTRY_NAME_TO_CODE[country] || country
  if (!code || code.length !== 2) return '🏳️'
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}



const submitComment = async () => {
  if (!newComment.value || Object.values(ratings.value).some(r => r === 0)) {
    return alert('Lütfen tüm alanlara puan verin ve yorum yazın.')
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/reviews`,
      {
        hotel: hotel.value._id,
        comment: newComment.value,
        stars: averageRating.value,
        serviceRatings: ratings.value
      },
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`
        }
      }
    )
    // Yeni yorum sonrası ortalamaları yeniden yükle
    await fetchRatingsSummary(hotel.value._id)

    // Reset
    newComment.value = ''
    ratings.value = { cleanliness: 0, staff: 0, features: 0, location: 0 }
  } catch (err) {
    console.error('Yorum gönderilemedi:', err)
    alert('Yorum gönderilemedi')
  }
  await fetchComments(hotel.value._id)

}


const fetchRatingsSummary = async (hotelId) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/summary/${hotelId}`)
    const avg = res.data.averages

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


onMounted(async () => {
  const id = route.params.id

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/hotels/${id}`)
    hotel.value = res.data

    if (hotel.value) {
      await nextTick()

      // Harita kur
      const { coordinates, name } = hotel.value
      setupMap(coordinates?.lat, coordinates?.lng, name)

      // Yorum ortalamalarını çek
      await fetchRatingsSummary(hotel.value._id)

      // ❗ Otel verisi geldikten sonra yorumları çek
      await fetchComments(hotel.value._id)
    }
  } catch (err) {
    console.error('Failed to load hotel detail:', err)
  }
})


</script>

<template>
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

      <p v-else class="login-warning">Yorum yapmak için giriş yapmalısınız.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import axios from 'axios'

const props = defineProps({
  hotelId: { type: String, required: true }
})

const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)

const comments = ref([])
const newComment = ref('')
const ratings = ref({
  cleanliness: 0,
  staff: 0,
  features: 0,
  location: 0
})

const fetchComments = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/${props.hotelId}`)
    comments.value = res.data
  } catch (err) {
    console.error('Yorumlar yüklenemedi:', err)
  }
}

const submitComment = async () => {
  if (!newComment.value || Object.values(ratings.value).some(r => r === 0)) {
    return alert('Lütfen tüm alanlara puan verin ve yorum yazın.')
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/reviews`,
      {
        hotel: props.hotelId,
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

    // Reset
    newComment.value = ''
    ratings.value = { cleanliness: 0, staff: 0, features: 0, location: 0 }

    await fetchComments()
  } catch (err) {
    console.error('Yorum gönderilemedi:', err)
    alert('Yorum gönderilemedi')
  }
}

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
  Canada: 'CA',
  GreatBritain: 'GB',
  Italy: 'IT',
  Spain: 'ES'
}

const getFlagEmoji = (country) => {
  const code = COUNTRY_NAME_TO_CODE[country] || country
  if (!code || code.length !== 2) return '🏳️'
  const codePoints = code.toUpperCase().split('').map(char => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}

onMounted(fetchComments)
</script>

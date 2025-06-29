import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import './style.css'


const app = createApp(App)
const pinia = createPinia()                // ✅ pinia nesnesi oluştur
pinia.use(piniaPluginPersistedstate)       // ✅ plugin'i tanımla

app.use(pinia)                             // ✅ pinia'yı uygulamaya ekle
app.use(router)

app.mount('#app')

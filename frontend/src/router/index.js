import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import SearchPage from '../pages/SearchPage.vue'
import MapSearchPage from '../pages/MapSearchPage.vue'
import HotelDetailPage from '../pages/HotelDetailPage.vue'


const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/search', component: SearchPage },
  { path: '/map', component: MapSearchPage },
  { path: '/hotel/:id', component: HotelDetailPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

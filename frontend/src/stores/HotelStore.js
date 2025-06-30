import { defineStore } from 'pinia'
import axios from 'axios'

export const useHotelStore = defineStore('hotel', {
  state: () => ({
    hotelDetail: null
  }),
  actions: {
    async fetchHotelById(id) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/hotels/${id}`)
        this.hotelDetail = res.data
      } catch (error) {
        console.error('Failed to fetch hotel:', error)
      }
    }
  }
})

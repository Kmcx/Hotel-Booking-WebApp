import { defineStore } from 'pinia'

export const useHotelStore = defineStore('hotel', {
  state: () => ({
    hotels: []
  }),
  actions: {
    setHotels(hotels) {
      this.hotels = hotels
    },
    getHotelById(id) {
      return this.hotels.find(h => h.id === id)
    }
  }
})

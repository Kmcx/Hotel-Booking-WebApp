import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    login(userData, token) {
      this.user = userData
      this.token = token
    },
    logout() {
      this.user = null
      this.token = null
    }
  },
  persist: true,
})

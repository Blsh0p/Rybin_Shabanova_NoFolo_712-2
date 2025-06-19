import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '../api'
import { useCartStore } from './cart'
import { useFavoriteStore } from './favorite'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/auth_me', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      user.value = data
    } catch (err) {
      console.error('Ошибка авторизации', err)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    user.value = null
    useCartStore().clearCart()
    useFavoriteStore().clearFavorites()
  }

  return { user, fetchUser, logout }
})
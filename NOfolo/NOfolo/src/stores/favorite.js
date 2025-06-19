import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '../api'
import { useUserStore } from './user'

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref([])
  const userStore = useUserStore()

  const fetchFavorites = async () => {
    if (!userStore.user?.id) return
    const { data } = await axios.get(`/favorites?userId=${userStore.user.id}`)
    favorites.value = data
  }

  const toggleFavorite = async (item) => {
    if (!userStore.user?.id) return

    const { data } = await axios.get(`/favorites?productId=${item.id}&userId=${userStore.user.id}`)
    if (data.length > 0) {
      await axios.delete(`/favorites/${data[0].id}`)
    } else {
      await axios.post('/favorites', {
        ...item,
        productId: item.id,
        userId: userStore.user.id
      })
    }

    await fetchFavorites()
  }

  const removeFavorite = async (id) => {
    await axios.delete(`/favorites/${id}`)
    favorites.value = favorites.value.filter((item) => item.id !== id)
  }

  const clearFavorites = () => {
    favorites.value = []
  }

  return { favorites, fetchFavorites, toggleFavorite, removeFavorite, clearFavorites }
})
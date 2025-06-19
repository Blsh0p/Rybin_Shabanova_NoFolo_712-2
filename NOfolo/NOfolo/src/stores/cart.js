import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import axios from '../api'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const userStore = useUserStore()

  const fetchCart = async () => {
    if (!userStore.user?.id) {
      clearCart()
      return
    }
    const { data } = await axios.get(`/cart?userId=${userStore.user.id}`)
    items.value = data
  }

  const addToCart = async (item) => {
    if (!userStore.user?.id) return
    await axios.post('/cart', {
      ...item,
      productId: item.id,
      userId: userStore.user.id
    })
    await fetchCart()
  }

  const removeFromCart = async (id) => {
    await axios.delete(`/cart/${id}`)
    items.value = items.value.filter((item) => item.id !== id)
  }

  const clearCart = () => {
    items.value = []
  }

  // Отслеживаем смену пользователя и обновляем корзину
  watch(() => userStore.user, (newUser) => {
    if (newUser?.id) {
      fetchCart()
    } else {
      clearCart()
    }
  }, { immediate: true })

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + (item.price || item.prise || 0), 0)
  )

  return { items, fetchCart, addToCart, removeFromCart, clearCart, totalPrice }
})
<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
import { useUserStore } from '../stores/user'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-product', 'auth-required'])

const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()

const isAdded = computed(() =>
  cartStore.items.some(i => i.productId === props.item.id)
)

const isFavorite = computed(() =>
  favoriteStore.favorites.some(f => f.productId === props.item.id)
)

const addToCart = async () => {
  if (!userStore.user) {
    emit('auth-required')
    return
  }

  await cartStore.addToCart(props.item)
}

const toggleFavorite = async () => {
  if (!userStore.user) {
    emit('auth-required')
    return
  }

  await favoriteStore.toggleFavorite(props.item)
}

const openDetails = () => {
  emit('open-product', props.item.id)
}
</script>

<template>
  <div class="border p-4 rounded-xl shadow">
    <!-- Кликабельное изображение -->
    <img
      :src="item.image"
      class="w-full h-40 object-cover rounded mb-2 cursor-pointer hover:opacity-90 transition"
      @click="openDetails"
    />
    <h3 class="text-lg font-bold">{{ item.title }}</h3>
    <p class="text-sm text-gray-600 mb-2">{{ item.price || item.prise }} ₽</p>

    <div class="flex gap-2">
      <button
        @click="addToCart"
        :disabled="isAdded"
        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {{ isAdded ? 'В корзине' : 'Добавить в корзину' }}
      </button>

      <button
        @click="toggleFavorite"
        class="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
      >
        {{ isFavorite ? '★' : '☆' }}
      </button>
    </div>
  </div>
</template>

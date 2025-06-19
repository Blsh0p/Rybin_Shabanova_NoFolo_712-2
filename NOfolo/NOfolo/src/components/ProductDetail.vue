<script setup>
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: Object
})

const emit = defineEmits(['close'])
const cartStore = useCartStore()

const addToCart = async () => {
  try {
    await cartStore.addToCart(props.product)
  } catch (err) {
    console.error('Ошибка добавления в корзину:', err)
  }
}
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl w-[90%] max-w-md relative">
      <button
        @click="emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
      >
        ×
      </button>

      <img :src="product.image" alt="product" class="w-full h-60 object-cover rounded mb-4" />
      <h2 class="text-2xl font-bold mb-2">{{ product.title }}</h2>
      <p class="text-gray-600 mb-4">{{ product.description || 'Описание отсутствует.' }}</p>
      <p class="text-xl font-semibold mb-4">{{ product.price || product.prise }} ₽</p>

      <button
        @click="addToCart"
        class="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Добавить в корзину
      </button>
    </div>
  </div>
</template>

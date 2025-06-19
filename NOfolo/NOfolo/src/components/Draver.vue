<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import Cartlist from './Cartlist.vue'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.fetchCart()
})

const handleRemove = async (id) => {
  await cartStore.removeFromCart(id)
}
</script>

<template>
  <div>
    <!-- Тень -->
    <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>

    <!-- Боковая панель -->
    <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
      <div class="flex items-center gap-5 mb-8">
        <img
          @click="$emit('close')"
          src="/arrow-next.svg"
          alt="Next"
          class="bg-black opacity-30 cursor-pointer rotate-180 hover:opacity-100 transition hover:-translate-x-1"
        />
        <h2 class="text-2xl font-bold">Корзина</h2>
      </div>

      <!-- Список товаров -->
      <Cartlist :items="cartStore.items" :onRemove="handleRemove" />

      <!-- Итог -->
      <div v-if="cartStore.items.length > 0">
        <div class="flex gap-4 my-6 mb-4">
          <span>Итого:</span>
          <div class="flex-1"></div>
          <b>{{ cartStore.totalPrice }} руб.</b>
        </div>
        <button
          class="transition bg-lime-400 w-full rounded-xl py-3 text-white disabled:bg-slate-400 hover:bg-lime-600 active:bg-lime-700 cursor-pointer"
        >
          Оформить заказ
        </button>
      </div>

      <div v-else class="text-gray-500">Корзина пуста</div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, watch } from 'vue'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

const cartStore = useCartStore()
const userStore = useUserStore()

onMounted(() => {
  cartStore.fetchCart()
})

watch(() => userStore.user?.id, () => {
  cartStore.fetchCart()
})

const handleRemove = async (id) => {
  await cartStore.removeFromCart(id)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Корзина</h2>

    <div v-if="cartStore.items.length === 0" class="text-gray-500">
     
    </div>

    <ul v-else>
      <li
        v-for="item in cartStore.items"
        :key="item.id"
        class="border p-4 rounded flex justify-between items-center mb-2"
      >
        <div class="flex gap-4 items-center">
          <img :src="item.image" class="w-16 h-16 object-cover rounded" />
          <div>
            <h3 class="font-bold">{{ item.title }}</h3>
            <p>{{ item.price || item.prise }} ₽</p>
          </div>
        </div>

        <button
          @click="handleRemove(item.id)"
          class="text-red-500 hover:text-red-700"
        >
          Удалить
        </button>
      </li>
    </ul>
  </div>
</template>
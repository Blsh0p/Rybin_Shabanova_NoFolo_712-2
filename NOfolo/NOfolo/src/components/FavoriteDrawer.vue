<script setup>
import { onMounted } from 'vue'
import { useFavoriteStore } from '../stores/favorite'

const emit = defineEmits(['close'])
const favoriteStore = useFavoriteStore()

onMounted(() => {
  favoriteStore.fetchFavorites()
})

const remove = async (id) => {
  await favoriteStore.removeFavorite(id)
}
</script>

<template>
  <div class="fixed top-0 right-0 w-full sm:w-[420px] h-full bg-white shadow-2xl z-50 p-6 overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Избранное</h2>
      <button @click="$emit('close')" class="text-gray-500 hover:text-black">✕</button>
    </div>

    <div v-if="favoriteStore.favorites.length === 0" class="text-gray-500">
      Нет избранных товаров.
    </div>

    <ul v-else>
      <li
        v-for="item in favoriteStore.favorites"
        :key="item.id"
        class="border p-4 rounded mb-4 flex justify-between items-center"
      >
        <div class="flex gap-4">
          <img :src="item.image" class="w-16 h-16 object-cover rounded" />
          <div>
            <h3 class="font-semibold">{{ item.title }}</h3>
            <p>{{ item.price || item.prise }} ₽</p>
          </div>
        </div>
        <button
          @click="remove(item.id)"
          class="text-red-500 hover:text-red-700"
        >
          Удалить
        </button>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { onMounted, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
import { useUserStore } from '../stores/user'

const emit = defineEmits(['open-drawer', 'open-favorites', 'auth', 'auth-required'])

const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()

onMounted(() => {
  cartStore.fetchCart()
  favoriteStore.fetchFavorites()
})

const isLoggedIn = computed(() => !!userStore.user)

const handleCartClick = () => {
  if (!isLoggedIn.value) {
    emit('auth-required')
  } else {
    emit('open-drawer')
  }
}

const handleFavoritesClick = () => {
  if (!isLoggedIn.value) {
    emit('auth-required')
  } else {
    emit('open-favorites')
  }
}

const logout = () => {
  userStore.logout()
}
</script>

<template>
  <header class="flex justify-between items-center p-8 border-b border-slate-200 bg-white rounded-t-xl">
    <!-- Логотип -->
    <div class="flex items-center gap-4">
      <img src="/logo.png" alt="logo" class="w-10" />
      <div>
        <h2 class="text-xl font-bold">NOfolo</h2>
        <p class="text-slate-400 text-sm">Магазин настольных игр</p>
      </div>
    </div>

    <!-- Панель пользователя -->
    <ul class="flex items-center gap-10 text-gray-500 font-medium">
      <!-- Корзина -->
      <li
        @click="handleCartClick"
        class="cursor-pointer hover:text-black transition flex items-center gap-2"
      >
        <img src="/cart.svg" alt="cart" class="w-5 h-5" />
        <span>{{ cartStore.totalPrice }} руб.</span>
      </li>

      <!-- Избранное -->
      <li
        @click="handleFavoritesClick"
        class="cursor-pointer hover:text-black transition flex items-center gap-2"
      >
        <img src="/heart.svg" alt="heart" class="w-5 h-5" />
        <span>Избранное</span>
      </li>

      <!-- Профиль / Выйти -->
      <li v-if="isLoggedIn" @click="logout" class="cursor-pointer hover:text-black transition flex items-center gap-2 text-red-600">
        <img src="/logout.svg" alt="logout" class="w-5 h-5" />
        <span>Выйти</span>
      </li>

      <li v-else @click="$emit('auth')" class="cursor-pointer hover:text-black transition flex items-center gap-2">
        <img src="/profile.svg" alt="profile" class="w-5 h-5" />
        <span>Профиль</span>
      </li>
    </ul>
  </header>
</template>
<script setup>
import Header from './components/Header.vue'
import Cardlist from './components/Cardlist.vue'
import Draver from './components/Draver.vue'
import ProductDetail from './components/ProductDetail.vue'
import FavoriteDrawer from './components/FavoriteDrawer.vue'
import AuthForm from './components/AuthForm.vue'
import AdminPanel from './components/AdminPanel.vue'
import { onMounted, ref } from 'vue'
import { useUserStore } from './stores/user'
import axios from './api'


const favoriteDrawerOpen = ref(false)
const draverOpen = ref(false)
const selectedProduct = ref(null)
const showAuth = ref(false)

const userStore = useUserStore()


const openFavorites = () => {
  if (!userStore.user) {
    showAuth.value = true
  } else {
    favoriteDrawerOpen.value = true
  }
}

const closeFavorites = () => (favoriteDrawerOpen.value = false)

const openDrawer = () => {
  if (!userStore.user) {
    showAuth.value = true
  } else {
    draverOpen.value = true
  }
}

const closeDrawer = () => (draverOpen.value = false)

const openProduct = async (id) => {
  try {
    const { data } = await axios.get(`/games/${id}`)
    selectedProduct.value = data
  } catch (err) {
    console.error('Ошибка при загрузке товара:', err)
  }
}

const closeProduct = () => (selectedProduct.value = null)

const showLogin = () => (showAuth.value = true)

const onAuth = async () => {
  showAuth.value = false
  await userStore.fetchUser()
}
onMounted(() => {
  userStore.fetchUser()
})
</script>

<template>
  <div>
    
    <AuthForm v-if="showAuth" @auth="onAuth" @close="showAuth = false" />

    
    <FavoriteDrawer v-if="favoriteDrawerOpen" @close="closeFavorites" />

   
    <Draver v-if="draverOpen" @close="closeDrawer" />

    
    <ProductDetail
      v-if="selectedProduct"
      :product="selectedProduct"
      @close="closeProduct"
    />

   
    <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
      <Header
        @open-drawer="openDrawer"
        @open-favorites="openFavorites"
        @auth="showLogin"
        @auth-required="showAuth = true"
      />

      
      <AdminPanel
        v-if="userStore.user?.isAdmin"
        :user="userStore.user"
      />

      
      <div class="p-10">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Все игры</h2>
        </div>

        
        <Cardlist
          @open-product="openProduct"
          @auth-required="showAuth = true"
        />
      </div>
    </div>
  </div>
</template>

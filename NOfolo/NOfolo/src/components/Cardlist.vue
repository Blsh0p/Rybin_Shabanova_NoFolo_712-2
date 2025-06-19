<script setup>
import Card from './Card.vue'
import { ref, watch, onMounted } from 'vue'
import axios from '../api'

const emit = defineEmits(['open-product'])

/* все товары с сервера и текущий отображаемый список */
const allItems   = ref([])
const items      = ref([])

/* состояние поиска и фильтра */
const searchQuery    = ref('')
const selectedFilter = ref('')

/* ---------------------------------- */
/*  Функция локальной фильтрации      */
/* ---------------------------------- */
const filterItems = () => {
  const q = searchQuery.value.trim().toLowerCase()

  /* 1. поиск по названию */
  let result = allItems.value.filter(item =>
    item.title.toLowerCase().includes(q)
  )

  /* 2. фильтр по категории / сортировка */
  if (selectedFilter.value === 'дешевые') {
    result.sort((a, b) => a.price - b.price)
  } else if (selectedFilter.value === 'дорогие') {
    result.sort((a, b) => b.price - a.price)
  } else if (selectedFilter.value) {
    result = result.filter(item => item.category === selectedFilter.value)
  }

  items.value = result
}

/* ---------------------------------- */
/*  Загрузка товаров один раз         */
/* ---------------------------------- */
const fetchAll = async () => {
  const { data } = await axios.get('/games')
  allItems.value = data
  filterItems()
}

onMounted(fetchAll)

/* реактивно пересчитываем при изменении */
watch([searchQuery, selectedFilter], filterItems)

/* сброс */
const clearFilters = () => {
  searchQuery.value    = ''
  selectedFilter.value = ''
  filterItems()
}
</script>

<template>
  <div>
    <!-- Фильтры и поиск -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <select
        v-model="selectedFilter"
        class="border border-slate-300 rounded-xl px-4 pr-8 h-10 w-full sm:w-1/3 appearance-none text-gray-500"
      >
        <option disabled value="">Фильтр</option>
        <option value="карточная"   class="text-black">Карточная</option>
        <option value="приключения" class="text-black">Приключения</option>
        <option value="дешевые"     class="text-black">По цене (дешёвые)</option>
        <option value="дорогие"     class="text-black">По цене (дорогие)</option>
      </select>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по названию..."
        class="border border-slate-300 rounded-xl px-4 py-2 h-10 w-full sm:w-2/3 focus:border-gray-400"
      />

      <button
        @click="clearFilters"
        class="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 text-sm"
      >
        Сбросить
      </button>
    </div>

    <!-- Сообщение, если ничего не найдено -->
    <div v-if="items.length === 0" class="text-center text-gray-400 py-10">
      Ничего не найдено
    </div>

    <!-- Карточки -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card
        v-for="item in items"
        :key="item.id"
        :item="item"
        @open-product="id => emit('open-product', id)"
      />
    </div>
  </div>
</template>
<template>
  <div class="border p-6 rounded-lg mb-8 bg-gray-50">
    <h3 class="text-xl font-semibold mb-4">Панель администратора</h3>

    <form @submit.prevent="addItem" class="mb-4 flex flex-col gap-2 max-w-md">
      <input v-model="newTitle" placeholder="Название" required class="border px-3 py-2 rounded" />
      <input v-model.number="newPrice" type="number" placeholder="Цена" required class="border px-3 py-2 rounded" />
      <input v-model="newImageUrl" placeholder="URL изображения" required class="border px-3 py-2 rounded" />
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Добавить товар
      </button>
    </form>

    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex justify-between items-center border-b py-2"
      >
        <span>{{ item.title }} — {{ item.prise }} руб.</span>
        <button @click="$emit('remove', index)" class="text-red-600 hover:underline">Удалить</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  items: Array,
});

const emit = defineEmits(['add', 'remove']);

const newTitle = ref('');
const newPrice = ref(null);
const newImageUrl = ref('');

const addItem = () => {
  if (!newTitle.value || !newPrice.value || !newImageUrl.value) return;

  emit('add', {
    title: newTitle.value,
    prise: newPrice.value,
    imageUrl: newImageUrl.value,
    isFavorite: false,
    isAdded: false,
  });

  newTitle.value = '';
  newPrice.value = null;
  newImageUrl.value = '';
};
</script>
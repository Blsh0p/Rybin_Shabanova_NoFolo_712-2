<script setup>
/* принимаем товар одной строкой корзины */
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

/* событие, чтобы сообщить родителю об удалении */
const emit = defineEmits(['remove'])
</script>

<template>
  <div
    class="flex items-center justify-between border border-slate-200 p-4 rounded-xl gap-4"
  >
    <!-- левая часть: изображение + название + цена -->
    <div class="flex items-center gap-4">
      <img
        class="w-18 h-20 object-cover rounded"
        :src="props.item.image"
        :alt="props.item.title"
      />
      <div class="flex flex-col">
        <p>{{ props.item.title }}</p>
        <b class="mt-2">{{ props.item.price || props.item.prise }} руб.</b>
      </div>
    </div>

    <!-- кнопка удаления позиции -->
    <img
      src="/close.svg"
      alt="Удалить"
      class="opacity-40 hover:opacity-100 cursor-pointer transition"
      @click="emit('remove', props.item.id)"
    />
  </div>
</template>
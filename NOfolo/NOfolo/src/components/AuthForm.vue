<script setup>
import { ref } from 'vue'
import axios from '../api'
import { useUserStore } from '../stores/user'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'

const emit = defineEmits(['auth', 'close'])

const email = ref('')
const password = ref('')
const isLogin = ref(true)
const errorMessage = ref('')
const isSubmitting = ref(false)

const userStore = useUserStore()
const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()

const validateForm = () => {
  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Пожалуйста, заполните все поля.'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Некорректный формат email.'
    return false
  }

  if (!isLogin.value) {
    const passwordMinLength = 6
    const passwordSpecialChars = /[!@#$%^&*(),.?":{}|<>]/

    if (password.value.length < passwordMinLength) {
      errorMessage.value = `Пароль должен содержать минимум ${passwordMinLength} символов.`
      return false
    }

    if (!passwordSpecialChars.test(password.value)) {
      errorMessage.value = 'Пароль должен содержать хотя бы один спецсимвол (!@#$%^&* и т.д.).'
      return false
    }
  }

  return true
}

const submit = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    if (!email.value.trim() || !password.value.trim()) {
      errorMessage.value = 'Пожалуйста, заполните все поля.'
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      errorMessage.value = 'Некорректный формат email.'
      return
    }

    if (!isLogin.value) {
      const { data: existingUsers } = await axios.get(`/users?email=${email.value}`)
      if (existingUsers.length > 0) {
        errorMessage.value = 'Пользователь с таким email уже зарегистрирован.'
        return
      }

      const passwordMinLength = 6
      const passwordSpecialChars = /[!@#$%^&*(),.?":{}|<>]/
      if (password.value.length < passwordMinLength) {
        errorMessage.value = `Пароль должен содержать минимум ${passwordMinLength} символов.`
        return
      }

      if (!passwordSpecialChars.test(password.value)) {
        errorMessage.value = 'Пароль должен содержать хотя бы один спецсимвол (!@#$%^&* и т.д.).'
        return
      }
    }

    const endpoint = isLogin.value ? '/auth' : '/register'
    const { data } = await axios.post(endpoint, {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('token', data.token)

    await userStore.fetchUser()
    await cartStore.fetchCart()
    await favoriteStore.fetchFavorites()

    emit('auth')
    emit('close')
  } catch (err) {
    const errorCode = err.response?.data?.code || err.response?.data?.message || ''
    if (errorCode === 'RESOURCE_INVALID_LOGIN_OR_PASSWORD') {
      errorMessage.value = 'Неверный email или пароль.'
    } else if (errorCode === 'RESOURCE_NOT_FOUND') {
      errorMessage.value = 'Пользователь не найден.'
    } else {
      errorMessage.value = 'Произошла неизвестная ошибка. Попробуйте ещё раз.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl relative">
      <h2 class="text-2xl font-bold mb-4 text-center">
        {{ isLogin ? 'Вход' : 'Регистрация' }}
      </h2>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border p-2 rounded mb-3"
        :class="{ 'border-red-500': errorMessage && !email }"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Пароль"
        class="w-full border p-2 rounded mb-4"
        :class="{ 'border-red-500': errorMessage && !password }"
      />

      <button
        @click="submit"
        class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        :disabled="isSubmitting"
      >
        {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
      </button>

      <p v-if="errorMessage" class="text-red-500 text-sm mt-3 text-center">
        {{ errorMessage }}
      </p>

      <p class="text-sm mt-4 text-center">
        <button @click="isLogin = !isLogin" class="underline text-blue-600 hover:text-blue-800">
          {{ isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войти' }}
        </button>
      </p>

      <button
        @click="emit('close')"
        class="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
      >
        ×
      </button>
    </div>
  </div>
</template>

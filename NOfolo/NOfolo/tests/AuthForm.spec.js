import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AuthForm from '../src/components/AuthForm.vue'
import axios from '../src/api'


vi.mock('../src/api', () => ({
  default: {
    post: vi.fn()
  }
}))

vi.mock('../src/stores/user', () => ({
  useUserStore: () => ({ fetchUser: vi.fn() })
}))

vi.mock('../src/stores/cart', () => ({
  useCartStore: () => ({ fetchCart: vi.fn() })
}))

vi.mock('../src/stores/favorite', () => ({
  useFavoriteStore: () => ({ fetchFavorites: vi.fn() })
}))

describe('AuthForm.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(AuthForm, {
      props: {
        onAuth: vi.fn(),
        onClose: vi.fn()
      }
    })
  })

  it('показывает ошибку при пустых полях', async () => {
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Пожалуйста, заполните все поля.')
  })

  it('показывает ошибку при некорректном email', async () => {
    await wrapper.find('input[type="email"]').setValue('not-an-email')
    await wrapper.find('input[type="password"]').setValue('123456')
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Некорректный формат email.')
  })

  it('успешный вход', async () => {
    axios.post.mockResolvedValueOnce({ data: { token: '123' } })
    await wrapper.find('input[type="email"]').setValue('user@example.com')
    await wrapper.find('input[type="password"]').setValue('123456')
    await wrapper.find('button').trigger('click')

    expect(axios.post).toHaveBeenCalledWith('/auth', {
      email: 'user@example.com',
      password: '123456'
    })
  })

  it('показывает ошибку при RESOURCE_USER_ALREADY_EXISTS', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { code: 'RESOURCE_USER_ALREADY_EXISTS' } }
    })
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('123456')
    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Пользователь с таким email уже зарегистрирован.')
  })

  it('показывает ошибку при RESOURCE_INVALID_LOGIN_OR_PASSWORD', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { code: 'RESOURCE_INVALID_LOGIN_OR_PASSWORD' } }
    })
    await wrapper.find('input[type="email"]').setValue('wrong@example.com')
    await wrapper.find('input[type="password"]').setValue('wrongpass')
    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Неверный email или пароль.')
  })
})
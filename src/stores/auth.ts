import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchLoginToken, setSeatApiToken } from '@/api'
import { tokenStore } from '@/stores/tokenStore'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const studentId = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const isLoading = ref(false)

  const isLoggedIn = computed(() => Boolean(token.value))

  const initFromStorage = () => {
    token.value = tokenStore.get()
    setSeatApiToken(token.value)
  }

  const login = async (username: string, userPassword: string) => {
    errorMessage.value = ''
    isLoading.value = true
    try {
      const response = await fetchLoginToken({
        username: username.trim(),
        password: userPassword,
      })
      const fetchedToken = response?.data?.token
      if (!fetchedToken) {
        throw new Error('未获取到 token')
      }
      tokenStore.set(fetchedToken)
      token.value = fetchedToken
      setSeatApiToken(fetchedToken)
      password.value = ''
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '登录失败，请重试'
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    tokenStore.clear()
    token.value = null
    setSeatApiToken(null)
  }

  return {
    token,
    studentId,
    password,
    errorMessage,
    isLoading,
    isLoggedIn,
    initFromStorage,
    login,
    logout,
  }
})

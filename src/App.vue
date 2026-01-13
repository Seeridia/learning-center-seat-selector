<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchLoginToken } from './api/authApi'
import LoginView from './components/LoginView.vue'
import { RouterView } from 'vue-router'

const TOKEN_KEY = 'learning_center_token'

const currentFloor = ref<'4F' | '5F'>('4F')
const token = ref<string | null>(null)
const studentId = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const isLoggedIn = computed(() => Boolean(token.value))

onMounted(() => {
  token.value = localStorage.getItem(TOKEN_KEY)
})

const handleLogin = async (username: string, userPassword: string) => {
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
    localStorage.setItem(TOKEN_KEY, fetchedToken)
    token.value = fetchedToken
    password.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <LoginView
    v-if="!isLoggedIn"
    v-model:student-id="studentId"
    v-model:password="password"
    :loading="isLoading"
    :error="errorMessage"
    @submit="handleLogin"
  />
  <RouterView v-else v-slot="{ Component }">
    <KeepAlive include="SeatPage">
      <component
        :is="Component"
        :floor="currentFloor"
        :token="token || ''"
        @update:floor="currentFloor = $event"
      />
    </KeepAlive>
  </RouterView>
</template>

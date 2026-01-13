<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { LoginView } from '@/components/common'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFloorStore } from '@/stores/floor'

const authStore = useAuthStore()
const floorStore = useFloorStore()

const { token, studentId, password, errorMessage, isLoading, isLoggedIn } = storeToRefs(authStore)
const { currentFloor } = storeToRefs(floorStore)
</script>

<template>
  <LoginView
    v-if="!isLoggedIn"
    v-model:student-id="studentId"
    v-model:password="password"
    :loading="isLoading"
    :error="errorMessage"
    @submit="authStore.login"
  />
  <RouterView v-else v-slot="{ Component }">
    <KeepAlive include="SeatPage">
      <component
        :is="Component"
        :floor="currentFloor"
        :token="token || ''"
        @update:floor="floorStore.setFloor"
      />
    </KeepAlive>
  </RouterView>
</template>

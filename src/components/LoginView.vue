<script setup lang="ts">
import { computed } from 'vue'
import { Label, Primitive } from 'reka-ui'

const props = defineProps<{
  studentId: string
  password: string
  loading: boolean
  error: string
}>()

const emit = defineEmits<{
  (e: 'update:studentId', value: string): void
  (e: 'update:password', value: string): void
  (e: 'submit', username: string, password: string): void
}>()

const studentIdModel = computed({
  get: () => props.studentId,
  set: (value: string) => emit('update:studentId', value),
})

const passwordModel = computed({
  get: () => props.password,
  set: (value: string) => emit('update:password', value),
})

const handleSubmit = () => {
  emit('submit', props.studentId, props.password)
}

const handleStudentInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  studentIdModel.value = target?.value ?? ''
}

const handlePasswordInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  passwordModel.value = target?.value ?? ''
}
</script>

<template>
  <Primitive class="login-view">
    <Primitive class="login-card">
      <Primitive as="header">
        <Primitive as="p" class="eyebrow">福州大学</Primitive>
        <Primitive as="h1">学习中心登录</Primitive>
        <Primitive as="p" class="subtle">请输入学号与密码以继续。</Primitive>
      </Primitive>
      <Primitive as="form" class="login-form" @submit.prevent="handleSubmit">
        <Primitive class="field">
          <Label class="field-label" for="login-student-id">学号</Label>
          <Primitive
            as="input"
            id="login-student-id"
            :value="studentIdModel"
            autocomplete="username"
            placeholder="请输入学号"
            class="field-input"
            @input="handleStudentInput"
          />
        </Primitive>
        <Primitive class="field">
          <Label class="field-label" for="login-password">密码</Label>
          <Primitive
            as="input"
            id="login-password"
            :value="passwordModel"
            type="password"
            autocomplete="current-password"
            placeholder="请输入密码"
            class="field-input"
            @input="handlePasswordInput"
          />
        </Primitive>
        <Primitive as="button" type="submit" class="primary" :disabled="loading">
          {{ loading ? '登录中…' : '登录' }}
        </Primitive>
        <Primitive v-if="error" as="p" class="error">{{ error }}</Primitive>
      </Primitive>
    </Primitive>
  </Primitive>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background: #f8fafc;
}

.login-card {
  width: min(420px, 92vw);
  padding: 28px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

header h1 {
  margin: 8px 0 8px;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.3em;
  color: #6b7280;
  text-transform: uppercase;
}

.subtle {
  margin: 0 0 24px;
  font-size: 14px;
  color: #6b7280;
}

.login-form {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #111827;
}

.field-label {
  font-weight: 500;
}

.field-input {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 15px;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.12);
}

.primary {
  margin-top: 8px;
  border: none;
  border-radius: 999px;
  padding: 12px 16px;
  font-size: 15px;
  cursor: pointer;
  color: #fff;
  background: #111827;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 20px rgba(17, 24, 39, 0.2);
}

.primary:disabled {
  cursor: wait;
  opacity: 0.7;
}

.error {
  margin: 0;
  color: #b23b2b;
  font-size: 13px;
}
</style>

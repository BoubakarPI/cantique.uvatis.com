<script setup lang="ts">
defineProps<{
  label: string,
  placeholder: string
  type: 'text' | 'password'
  id: string
  error?: string
}>()
const model = defineModel()
</script>
<template>
  <div>
    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      required
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      :placeholder="placeholder"
      :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': error }"
    />
    <p v-if="error" class="mt-1 text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>

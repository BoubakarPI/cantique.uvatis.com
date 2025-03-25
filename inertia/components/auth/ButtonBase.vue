<script setup lang="ts">
defineProps<{
  label: string
  isLoading: boolean
}>()
</script>

<template>
  <button
    type="submit"
    class="w-full bg-[#4f46e5] hover:bg-primary text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 ease-in-out"
    :class="{
    'opacity-70 cursor-not-allowed bg-opacity-50': isLoading,
    'bg-primary': !isLoading
  }"
    :disabled="isLoading"
  >
  <span v-if="isLoading" class="flex items-center justify-center">
    <div class="i-svg-spinners:bars-scale w-6 h-6"> </div>
  </span>
    <span v-else>{{ label }}</span>
  </button>

</template>

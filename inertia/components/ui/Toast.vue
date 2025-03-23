<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  id: string
  type?: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
  duration?: number
}>()

const emit = defineEmits<{
  close: [id: string]
}>()

const progress = ref(100)
const progressInterval = ref<number>()

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'i-line-md-check-all'
    case 'error':
      return 'i-line-md-close-circle'
    case 'warning':
      return 'i-line-md-bell-alert'
    default:
      return 'i-line-md-chat'
  }
})

const styles = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
    case 'error':
      return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
    case 'warning':
      return 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
    default:
      return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
  }
})

const iconStyles = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-600 dark:text-green-400'
    case 'error':
      return 'text-red-600 dark:text-red-400'
    case 'warning':
      return 'text-amber-600 dark:text-amber-400'
    default:
      return 'text-blue-600 dark:text-blue-400'
  }
})

const progressBarStyles = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-500 dark:bg-green-400'
    case 'error':
      return 'bg-red-500 dark:bg-red-400'
    case 'warning':
      return 'bg-amber-500 dark:bg-amber-400'
    default:
      return 'bg-blue-500 dark:bg-blue-400'
  }
})

const startTimer = () => {
  if (props.duration === 0) return

  const duration = props.duration || 5000
  const intervalDuration = 10 // Mise à jour toutes les 10ms pour une animation fluide
  const steps = duration / intervalDuration
  const stepSize = 100 / steps

  progressInterval.value = window.setInterval(() => {
    progress.value = Math.max(0, progress.value - stepSize)

    if (progress.value === 0) {
      clearInterval(progressInterval.value)
      emit('close', props.id)
    }
  }, intervalDuration)
}

const pauseTimer = () => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
  }
}

const resumeTimer = () => {
  if (props.duration !== 0 && progress.value > 0) {
    startTimer()
  }
}

onMounted(() => {
  startTimer()
})

const handleClose = () => {
  pauseTimer()
  emit('close', props.id)
}
</script>

<template>
  <div
    class="relative flex w-full max-w-sm overflow-hidden rounded-lg border shadow-lg"
    :class="styles"
    role="alert"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
  >
    <div class="flex w-full items-center p-4">
      <div class="flex-shrink-0">
        <div  :class="`${icon} ${iconStyles} h-5 w-5`"/>
      </div>
      <div class="ml-3 w-full">
        <p v-if="title" class="text-sm font-medium text-gray-900 dark:text-gray-100">
          {{ title }}
        </p>
        <p class="text-sm text-gray-700 dark:text-gray-300" :class="{ 'mt-1': title }">
          {{ message }}
        </p>
      </div>
      <div class="ml-4 flex flex-shrink-0">
        <button
          @click="handleClose"
          class="inline-flex text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Barre de progression -->
    <div
      class="absolute bottom-0 left-0 h-1 transition-all duration-10 ease-linear"
      :class="progressBarStyles"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>

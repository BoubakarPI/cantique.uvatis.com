import { ref } from 'vue'

interface Toast {
  id: string
  type?: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ ...toast, id })
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    addToast({ type: 'success', message, ...options })
  }

  const error = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    addToast({ type: 'error', message, ...options })
  }

  const info = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    addToast({ type: 'info', message, ...options })
  }

  const warning = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    addToast({ type: 'warning', message, ...options })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}

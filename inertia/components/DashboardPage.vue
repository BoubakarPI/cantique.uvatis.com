<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Audio Dashboard</h1>
          </div>
          <div class="flex items-center">
            <button
              @click="logout"
              class="ml-4 bg-primary px-4 py-2 text-sm text-white hover:bg-gray-100 rounded-md"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Uploader un fichier audio</h2>

        <!-- Upload area -->
        <div
          @dragover.prevent
          @drop.prevent="handleFileDrop"
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          :class="{ 'border-primary bg-primary bg-opacity-5': isDragging }"
          @dragenter.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            accept="audio/*"
            class="hidden"
            @change="handleFileSelect"
            multiple
          />

          <div v-if="!isUploading && !uploadedFileUrls.length">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-600">
              Glissez et déposez des fichiers audio ici, ou cliquez pour sélectionner
            </p>
            <p class="mt-1 text-xs text-gray-500">MP3, WAV, OGG, FLAC (max. 20MB par fichier)</p>
          </div>

          <!-- Loading animation -->
          <div v-if="isUploading" class="py-4">
            <div class="upload-animation">
              <div class="bar-container">
                <div
                  v-for="i in 5"
                  :key="i"
                  class="bar"
                  :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
                ></div>
              </div>
            </div>
            <p class="mt-4 text-sm text-gray-600">
              Téléchargement en cours... {{ uploadProgress }}%
            </p>
          </div>

          <!-- Success state -->
          <div v-if="uploadedFileUrls.length > 0 && !isUploading" class="py-4">
            <div class="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p class="mt-2 text-sm text-gray-600">
              {{ uploadedFileUrls.length > 1 ? 'Fichiers téléchargés' : 'Fichier téléchargé' }} avec succès!
            </p>
          </div>
        </div>

        <!-- File URL result -->
        <!-- File URLs result -->
        <div v-if="uploadedFileUrls.length > 0" class="mt-6">
          <h3 class="text-sm font-medium text-gray-700 mb-2">
            {{ uploadedFileUrls.length > 1 ? 'URLs des fichiers:' : 'URL du fichier:' }}
          </h3>

          <div v-for="(url, index) in uploadedFileUrls" :key="index" class="mb-2">
            <div class="flex">
              <input
                type="text"
                readonly
                :value="url"
                class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
              />
              <button
                @click="copyToClipboard(url)"
                class="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-4 hover:bg-gray-200 transition-colors"
              >
                <span v-if="copiedStates[url]">Copié!</span>
                <span v-else>Copier</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Upload new file button -->
        <div v-if="uploadedFileUrls.length > 0" class="mt-4">
          <button
            @click="resetUpload"
            class="text-primary hover:text-primary-dark text-sm font-medium"
          >
            Télécharger d'autres fichiers
          </button>
        </div>

        <!-- Recent uploads -->
        <div v-if="recentUploads.length > 0" class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Tous les Fichiers </h3>
          <ul class="divide-y divide-gray-200">
            <li
              v-for="(file, index) in recentUploads"
              :key="index"
              class="py-3 flex justify-between"
            >
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <span class="text-sm text-gray-700">{{ file.name }}</span>
              </div>
              <a :href="file.url" target="_blank" class="text-primary hover:underline text-sm">
                Ouvrir
              </a>
            </li>
          </ul>
        </div>
      </div>

      <ToastContainer />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { router } from '@inertiajs/vue3'
import ToastContainer from '~/components/ui/ToastContainer.vue'
import { useToast } from "~/composables/use_toast"

// Déclaration des références avec types
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref<boolean>(false)
const isUploading = ref<boolean>(false)
const uploadProgress = ref<number>(0)
const uploadedFileUrls = ref<string[]>([]) // Changé pour un tableau
const copiedStates = ref<{[key: string]: boolean}>({}) // Objet pour suivre l'état de copie de chaque URL

interface UploadItem {
  name: string
  url: string
  date: string
}

const recentUploads = ref<UploadItem[]>([])

// Déclenchement du clic sur l'input de fichier
const triggerFileInput = (): void => {
  fileInput.value?.click()
}

// Gestion du dépôt de fichier
const handleFileDrop = (event: DragEvent): void => {
  event.preventDefault()
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'))
    if (audioFiles.length > 0) {
      uploadFiles(audioFiles)
    }
  }
}

// Gestion de la sélection de fichier via l'input
const handleFileSelect = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    const audioFiles = Array.from(files)
    uploadFiles(audioFiles)
  }
}

const uploadFiles = async (files: File[]): Promise<void> => {
  // Vérifier la taille de chaque fichier
  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) {
      error(`Le fichier ${file.name} est trop volumineux. La taille maximale est de 20MB.`, {
        title: 'Erreur',
        duration: 3000
      })
      return
    }
  }

  isUploading.value = true
  uploadProgress.value = 0
  uploadedFileUrls.value = [] // Réinitialiser les URLs

  const progressInterval = setInterval(() => {
    if (uploadProgress.value < 95) {
      uploadProgress.value += Math.floor(Math.random() * 10) + 1
    }
  }, 300)

  const formData = new FormData()

  // Ajouter tous les fichiers au FormData
  files.forEach(file => {
    formData.append('audios', file)
  })

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()

    // Si l'API retourne un tableau d'URLs
    if (Array.isArray(data.urls)) {
      uploadedFileUrls.value = data.urls
      files.forEach((file, index) => {
        if (index < data.urls.length) {
          recentUploads.value.unshift({
            name: file.name,
            url: data.urls[index],
            date: new Date().toISOString(),
          })
        }
      })

    } else {
      // Pour compatibilité avec l'ancien format de réponse
      uploadedFileUrls.value = [data.url]
      recentUploads.value.unshift({
        name: files[0].name,
        url: data.url,
        date: new Date().toISOString(),
      })
    }

    success(`${files.length > 1 ? files.length + ' fichiers audio' : 'Audio'} uploadé${files.length > 1 ? 's' : ''} avec succès`, {
      title: 'Félicitations',
      duration: 3000
    })

    clearInterval(progressInterval)
  } catch (error) {
    error('Échec de l\'upload', { title: 'Erreur', duration: 3000 })
  } finally {
    isUploading.value = false
    uploadProgress.value = 100
  }
}

// Copier l'URL dans le presse-papier
const copyToClipboard = (url: string): void => {
  info('Lien copié avec succès', { title: 'Succès', duration: 3000 })
  navigator.clipboard.writeText(url)

  // Mettre à jour l'état de copie pour cet URL
  copiedStates.value[url] = true

  setTimeout(() => {
    copiedStates.value[url] = false
  }, 2000)
}

const { info, error, success } = useToast()

const resetUpload = (): void => {
  uploadedFileUrls.value = []
  if (fileInput.value) fileInput.value.value = ''
}

const logout = (): void => {
  console.log('Déconnexion initiée...')
  error('Vous serez déconnecté dans 3s', { title: 'Ahii', duration: 3000 })

  setTimeout(() => {
    router.delete('/auth/logout')
  }, 3000)
}

const fetchFiles = async () => {
  try {
    const response = await fetch('/api/files')
    recentUploads.value = await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers :', error)
  }
}

onMounted(() => {
  fetchFiles()
})
</script>


<style>
:root {
  --color-primary: #4f46e5;
  --color-primary-dark: #4338ca;
}

.bg-primary {
  background-color: var(--color-primary);
}

.text-primary {
  color: var(--color-primary);
}

.hover\:text-primary-dark:hover {
  color: var(--color-primary-dark);
}

.hover\:border-primary:hover {
  border-color: var(--color-primary);
}

.border-primary {
  border-color: var(--color-primary);
}

/* Upload animation */
.upload-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}

.bar-container {
  display: flex;
  align-items: flex-end;
  height: 40px;
  gap: 4px;
}

.bar {
  width: 4px;
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 2px;
  animation: sound 1.2s ease-in-out infinite;
  transform-origin: bottom;
}

@keyframes sound {
  0%,
  100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}
</style>

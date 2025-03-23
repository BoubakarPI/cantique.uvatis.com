<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-md p-8">
        <div class="mb-6 text-center">
          <h1 class="text-2xl font-bold text-gray-900">Connexion</h1>
          <p class="text-gray-500 mt-2">Connectez-vous à votre compte</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">

          <InputLabel type="text" label="Email" placeholder="Votre@email.com" v-model="email"  id="email" :error="errors.email"/>

          <InputLabel type="password" label="Mot de passe" placeholder="*******" v-model="password"  id="password" :error="errors.E_INVALID_CREDENTIALS || errors.password"/>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember" type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
              <label for="remember" class="ml-2 block text-sm text-gray-700">Se souvenir de moi</label>
            </div>
          </div>

          <ButtonBase label="Se connecter" :isLoading="isLoading"/>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {router} from "@inertiajs/vue3";
import InputLabel from "~/components/auth/InputLabel.vue";
import ButtonBase from "~/components/auth/ButtonBase.vue";
import { usePageErrors } from "~/composables/use_page_errors"
import { useToast } from "~/composables/use_toast";
import ToastContainer from "~/components/ui/ToastContainer.vue";
const { success } = useToast()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errors = usePageErrors()

const handleLogin = async () => {
  isLoading.value = true
  const formData = new FormData()
  formData.append('email', email.value)
  formData.append('password', password.value)

  try {
    setTimeout(() => {
      router.post("/auth/login", formData,  {
        onSuccess: () => {
          isLoading.value = false
          success(
            "Connexion effectuée avec succès",
            {
              title: 'Bienvenu à nouveau',
              duration: 3000,
            }
          )
        },
        onError: () => {
          isLoading.value = false
        }
      })
    }, 500)


  } catch (error) {
    console.error('Login failed:', error)
  } finally {
  }
}
</script>

<style>
:root {
  --color-primary: #4f46e5;
  --color-primary-dark: #4338ca;
}

.bg-primary {
  background-color: var(--color-primary);
}

.bg-primary-dark {
  background-color: var(--color-primary-dark);
}

.text-primary {
  color: var(--color-primary);
}

.focus\:ring-primary:focus {
  --tw-ring-color: var(--color-primary);
}
</style>

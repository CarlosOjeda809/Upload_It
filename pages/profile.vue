<script setup>

import { profile } from '@/composables/formatProfile';

const client = useSupabaseClient();
const user = useSupabaseUser();
const users = ref({});
const isLoading = ref(true);
const errorMsg = ref(null);
const router = useRouter();

const {
  
  formatDate,
  userData,
  checkBirth,

} = profile();

onMounted(async () => {
  await checkBirth();
  if (user.value?.id) {
    await userData();
  } else {
    isLoading.value = false;
    errorMsg.value = 'Usuario no autenticado.';
  }

});
</script>

<template>
  <div class="flex flex-col bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 ">
    <main class="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
      <div v-if="isLoading" class="w-full max-w-md">
        <div class="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white text-center">
          <div class="flex justify-center mb-3">
            <div class="h-14 w-14 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p class="text-pink-700 font-medium text-lg">Cargando tu perfil...</p>
        </div>
      </div>


      <div v-else-if="errorMsg" class="w-full max-w-md">
        <div class="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-red-100">
          <div class="text-center mb-4">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-700 mb-2">Ha ocurrido un problema</h2>
            <p class="text-red-600 mb-4">{{ errorMsg }}</p>
          </div>
          <div class="text-center">
            <button @click="router.push('/login')"
              class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition duration-300 shadow-md flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Ir a Login
            </button>
          </div>
        </div>
      </div>


      <div v-else-if="user" class="w-full max-w-md">
        <div class="mb-6 text-center">
          <h1 class="text-4xl font-bold text-white drop-shadow-md">MI PERFIL</h1>
          <p class="text-lg text-white mt-1 opacity-90">Tu información personal</p>
        </div>

        <div class="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white">

          <div class="flex justify-center mb-6">
            <div
              class="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg text-white text-3xl font-bold">
              {{ users?.nombre?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
          </div>

          <h2 class="text-2xl font-bold text-center mb-6 text-pink-600">
            {{ users?.nombre || 'Usuario' }}
          </h2>

          <div class="space-y-6">
            <div class="bg-pink-50 rounded-lg p-5 border border-pink-100 shadow-sm">
              <div class="flex items-center">
                <div class="bg-pink-100 p-2 rounded-lg mr-3">
                  <Icon name="material-symbols:person-outline" class="text-pink-500 text-2xl"></Icon>
                </div>
                <div>
                  <div class="text-gray-500 text-sm font-medium">Nombre</div>
                  <div class="text-gray-800 font-semibold text-lg">{{ users?.nombre || 'No especificado' }}</div>
                </div>
              </div>
            </div>

            <div class="bg-purple-50 rounded-lg p-5 border border-purple-100 shadow-sm">
              <div class="flex items-center">
                <div class="bg-purple-100 p-2 rounded-lg mr-3">
                  <Icon name="material-symbols:alternate-email" class="text-purple-500 text-2xl"></Icon>
                </div>
                <div>
                  <div class="text-gray-500 text-sm font-medium">Email</div>
                  <div class="text-gray-800 font-semibold">{{ users?.email || 'No especificado' }}</div>
                </div>
              </div>
            </div>

            <div class="bg-purple-50 rounded-lg p-5 border border-purple-100 shadow-sm">
              <div class="flex items-center">
                <div class="bg-purple-100 p-2 rounded-lg mr-3">
                  <Icon name="material-symbols:calendar-today-sharp" class="text-purple-500 text-2xl"></Icon>
                </div>
                <div>
                  <div class="text-gray-500 text-sm font-medium">Fecha de nacimiento</div>
                  <div class="text-gray-800 font-semibold">{{ formatDate(users?.birth) }}</div>
                </div>
              </div>
            </div>

            <div class="mt-8">
              <button @click="router.push('/')"
                class="w-full p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:opacity-90 transition duration-300 cursor-pointer flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                IR A INICIO
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="w-full max-w-md">
        <div class="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-700 mb-2">Acceso restringido</h2>
          <p class="text-gray-600 mb-6">No has iniciado sesión. Por favor, accede a tu cuenta para ver tu perfil.</p>
          <button @click="router.push('/login')"
            class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition duration-300 shadow-md flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Iniciar sesión
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
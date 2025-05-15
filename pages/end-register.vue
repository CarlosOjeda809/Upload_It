<script setup>
import { NuxtLink } from '#components';


const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const errorMsg = ref('');
const successMsg = ref('');
const isLoading = ref(false);
const nombreCompleto = ref('');
const fechaNacimiento = ref('');

onMounted(async () => {
  if (!user.value) {
    navigateTo('/login')
  }

  const { data, error } = await client
    .from('users')
    .select('nombre, birth')
    .eq('id', user.value.id)
    .single();

  if (data && data.birth) {

    successMsg.value = 'Ya has completado tu registro';

    navigateTo('/profile')

    return;
  }

  if (data && data.nombre) {
    nombreCompleto.value = data.nombre;
  } else if (user.value.user_metadata?.full_name) {
    nombreCompleto.value = user.value.user_metadata.full_name;
  }
});

const completarRegistro = async () => {
  if (!nombreCompleto.value || !fechaNacimiento.value) {
    errorMsg.value = 'Por favor, rellena todos los campos';
    return;
  }

  isLoading.value = true;

  try {

    const { data, error } = await client
      .from('users')
      .update({
        nombre: nombreCompleto.value,
        birth: fechaNacimiento.value
      })
      .eq('id', user.value.id);

    if (error) {
      console.error('Error al actualizar datos', error);
      errorMsg.value = 'Error al guardar tus datos. Inténtalo de nuevo.';
      return;
    }

    errorMsg.value = '';
    successMsg.value = '¡Registro completado con éxito!';

  } catch (e) {
    errorMsg.value = 'Error inesperado. Inténtalo de nuevo.';
    console.error('Error inesperado:', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <section class="flex flex-col bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 min-h-screen">
    <main class="flex-grow container mx-auto p-4 flex justify-center items-center flex-col">
      <article class="w-full max-w-md mx-auto">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <section class="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white"
          aria-labelledby="titulo-registro">
          <h2 id="titulo-registro" class="text-3xl font-bold text-center mb-6 text-indigo-600">
            Completar Registro
          </h2>

          <form @submit.prevent="completarRegistro" class="space-y-5" novalidate>
            <fieldset class="relative">
              <legend class="sr-only">Nombre completo</legend>
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input v-model="nombreCompleto" type="text" id="nombreCompleto" name="nombreCompleto"
                placeholder="Nombre completo" aria-describedby="nombreHelp"
                class="w-full p-4 pl-10 bg-indigo-50 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-indigo-300 text-gray-700"
                required />
              <small id="nombreHelp" class="sr-only">Introduce tu nombre completo</small>
            </fieldset>

            <fieldset class="relative">
              <legend class="sr-only">Fecha de nacimiento</legend>
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input v-model="fechaNacimiento" type="date" id="fechaNacimiento" name="fechaNacimiento"
                class="w-full p-4 pl-10 bg-indigo-50 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-indigo-300 text-gray-700"
                required />
            </fieldset>

            <section>
              <button type="submit"
                class="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg hover:opacity-90 transition duration-300 cursor-pointer flex items-center justify-center shadow-md"
                :disabled="isLoading">
                <span v-if="isLoading" class="mr-2" aria-live="polite" aria-label="Cargando">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" role="img" aria-hidden="false">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                </span>
                <span>FINALIZAR REGISTRO</span>
              </button>
            </section>

            <section class="text-center pt-4">
              <p class="text-gray-600 mb-1">¿Deseas volver?</p>
              <NuxtLink to="/"
                class="inline-block text-indigo-600 font-bold hover:text-indigo-800 transition duration-300 cursor-pointer hover:underline">
                Ir al panel principal
              </NuxtLink>
            </section>

            <transition name="fade">
              <aside v-if="errorMsg"
                class="mt-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-center text-sm"
                role="alert" aria-live="assertive">
                {{ errorMsg }}
              </aside>
            </transition>

            <transition name="fade">
              <aside v-if="successMsg"
                class="mt-4 p-3 bg-green-100 border border-green-200 text-green-600 rounded-lg text-center text-sm"
                role="alert" aria-live="polite">
                {{ successMsg }}
              </aside>
            </transition>
          </form>
        </section>
      </article>
    </main>
  </section>
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
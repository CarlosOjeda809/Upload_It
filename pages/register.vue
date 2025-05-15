<script setup>
const client = useSupabaseClient();
const errorMsg = ref('');
const successMsg = ref('');
const users = ref([]);
const nombreData = ref('');
const emailData = ref('');
const contraseñaData = ref('');
const newContraseñaData = ref('');
const isLoading = ref(false);

const signup = async (nombre, email, contraseña, repetirContraseña) => {
    if (!nombre?.trim() || !email?.trim() || !contraseña?.trim() || !repetirContraseña?.trim()) {
        errorMsg.value = 'Rellena todos los campos';
        successMsg.value = '';
        return false;
    }

    if (contraseña !== repetirContraseña) {
        errorMsg.value = 'Las contraseñas no coinciden';
        successMsg.value = '';
        return false;
    }

    isLoading.value = true;
    
    try {
        const { data, error: authError } = await client.auth.signUp({
            email: email,
            password: contraseña,
        });

        if (authError) {
            console.error('Error al registrarse en Supabase', authError);
            errorMsg.value = authError.message;
            successMsg.value = '';
            return false;
        }

        const userId = data.user?.id;

        if (!userId) {
            errorMsg.value = 'No se ha podido obtener el ID del usuario';
            successMsg.value = '';
            return false;
        }

        const { error: insertError } = await client.from('users').insert([
            {
                id: userId,
                nombre: nombre,
                email: email,
            },
        ]);

        if (insertError) {
            console.error(insertError);
            errorMsg.value = insertError.message;
            successMsg.value = '';
            return false;
        }

        errorMsg.value = '';
        successMsg.value = 'Te has registrado con éxito. Revisa tu correo para verificar tu cuenta.';
        nombreData.value = '';
        emailData.value = '';
        contraseñaData.value = '';
        newContraseñaData.value = '';
        return true;
    } catch (error) {
        console.error('Error inesperado', error);
        errorMsg.value = 'Error inesperado. Inténtalo de nuevo.';
        successMsg.value = '';
        return false;
    } finally {
        isLoading.value = false;
    }
};  
</script>

<template>
  <div class="flex flex-col bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 h-full">
    <main class="flex-grow container mx-auto p-4 flex justify-center items-center flex-col">
      <div class="w-full max-w-md mx-auto">
       
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>

        <div class="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white">
          <h2 class="text-3xl font-bold text-center mb-6 text-purple-600">
            Crear Cuenta
          </h2>

          <form @submit.prevent="signup(nombreData, emailData, contraseñaData, newContraseñaData)" class="space-y-5">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input v-model="nombreData" type="text" placeholder="Nombre"
                class="w-full p-4 pl-10 bg-purple-50 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-300 text-gray-700" />
            </div>
            
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input v-model="emailData" type="email" placeholder="Email"
                class="w-full p-4 pl-10 bg-purple-50 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-300 text-gray-700" />
            </div>
            
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input v-model="contraseñaData" type="password" placeholder="Contraseña"
                class="w-full p-4 pl-10 bg-purple-50 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-300 text-gray-700" />
            </div>
            
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <input v-model="newContraseñaData" type="password" placeholder="Repetir Contraseña"
                class="w-full p-4 pl-10 bg-purple-50 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-300 text-gray-700" />
            </div>
            
            <div>
              <button type="submit"
                class="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition duration-300 cursor-pointer flex items-center justify-center shadow-md">
                <span v-if="isLoading" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span>CREAR CUENTA</span>
              </button>
            </div>
            
            <div class="text-center pt-4">
              <p class="text-gray-600 mb-1">¿Ya tienes una cuenta?</p>
              <NuxtLink to="/login"
                class="inline-block text-purple-600 font-bold hover:text-purple-800 transition duration-300 cursor-pointer hover:underline">
                Iniciar sesión
              </NuxtLink>
            </div>

            <transition name="fade">
              <div v-if="errorMsg" class="mt-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-center text-sm">
                {{ errorMsg }}
              </div>
            </transition>

            <transition name="fade">
              <div v-if="successMsg" class="mt-4 p-3 bg-green-100 border border-green-200 text-green-600 rounded-lg text-center text-sm">
                {{ successMsg }}
              </div>
            </transition>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
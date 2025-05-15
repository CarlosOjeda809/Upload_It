<script setup>
const config = useRuntimeConfig(); 

const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const emailData = ref('')
const contraseñaData = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const loginDatos = async () => {
    if (!emailData.value || !contraseñaData.value) {
        errorMsg.value = 'Rellena todos los campos';
        return false;
    }

    isLoading.value = true;
    
    try {
        const { data, error } = await client.auth.signInWithPassword({
            email: emailData.value,
            password: contraseñaData.value,
        });

        if (error) {
            console.error('Error al iniciar sesión:', error);
            errorMsg.value = error.message;
            return false;
        }

        errorMsg.value = ''
        
        const { data: userData, error: userError } = await client
            .from('users')
            .select('birth')
            .eq('id', data.user.id)
            .single();
            
        if (userError) {
            console.error('Error al verificar datos de usuario:', userError);
        }
        
        if (!userData || !userData.birth) {
            router.push('/end-register');
        } else {
            router.push('/');
        }
    } catch (e) {
        errorMsg.value = 'Error inesperado. Inténtalo de nuevo.'
    } finally {
        isLoading.value = false;
    }
}


const loginConGoogle = async () => {
    isLoading.value = true;
    try {
        const { error } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: config.public.BASE_URL + '/end-register'
            }
        });

        if (error) {
            console.error('Error al iniciar sesión con Google:', error);
            errorMsg.value = error.message;
            return false;
        }

        errorMsg.value = ''
    } catch (e) {
        errorMsg.value = 'Error inesperado. Inténtalo de nuevo.'
    } finally {
        isLoading.value = false;
    }
}


const loginConGithub = async () => {
    isLoading.value = true;
    try {
        const { error } = await client.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: config.public.BASE_URL + '/end-register'
            }
        });
        
        if (error) {
            console.error('Error al iniciar sesión con Github:', error);
            errorMsg.value = error.message;
            return false;
        }

        errorMsg.value = ''
    } catch (e) {
        errorMsg.value = 'Error inesperado. Inténtalo de nuevo.'
    } finally {
        isLoading.value = false;
    }
}

</script>

<template>
    <div class="flex flex-col bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 h-full">
        <main class="flex-grow container mx-auto p-4 flex justify-center items-center flex-col">
            <div class="w-full max-w-md mx-auto">
               
                <div class="flex justify-center mb-6">
                    <div class="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>
                </div>

                <div class="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white">
                    <h2 class="text-3xl font-bold text-center mb-6 text-pink-600 flex items-center justify-center">
                        <span>Bienvenido</span>
                    </h2>

                    <form @submit.prevent="loginDatos" class="space-y-5">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input v-model="emailData" type="email" placeholder="Email"
                                class="w-full p-4 pl-10 bg-pink-50 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-pink-300 text-gray-700" />
                        </div>
                        
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input v-model="contraseñaData" type="password" placeholder="Contraseña"
                                class="w-full p-4 pl-10 bg-pink-50 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-pink-300 text-gray-700" />
                        </div>

                        <div class="text-right">
                            <a href="#" class="text-sm text-pink-600 hover:text-pink-800 font-medium">¿Olvidaste tu contraseña?</a>
                        </div>
                        
                        <div>
                            <button type="submit"
                                class="w-full p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:opacity-90 transition duration-300 cursor-pointer flex items-center justify-center shadow-md">
                                <span v-if="isLoading" class="mr-2">
                                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                                <span>INICIAR SESIÓN</span>
                            </button>
                        </div>

                        <div class="flex justify-center space-x-4 my-4 ">
                            <button @click="loginConGoogle"
                                class="w-full p-4 bg-white cursor-pointer border border-pink-300 text-pink-600 rounded-lg hover:bg-pink-100 transition duration-300 flex items-center justify-center shadow-md">
                                <Icon name="ion:logo-google" class="mr-1"/>
                                Iniciar con Google
                            </button>
                        </div>
                        <div class="flex justify-center space-x-4 my-4 ">
                            <button @click="loginConGithub"
                                class="w-full p-4  cursor-pointer border border-pink-300 text-pink-600 rounded-lg hover:bg-pink-100 transition duration-300 flex items-center justify-center shadow-md">
                                <Icon name="tabler:brand-github" class="mr-1"/>
                                Iniciar con Github
                            </button>
                        </div>

                        <div class="text-center pt-4">
                            <p class="text-gray-600 mb-1">¿No tienes cuenta?</p>
                            <NuxtLink to="/register"
                                class="inline-block text-pink-600 font-bold hover:text-pink-800 transition duration-300 cursor-pointer hover:underline">
                                Crear una cuenta
                            </NuxtLink>
                        </div>

                        <transition name="fade">
                            <div v-if="errorMsg" class="mt-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-center text-sm">
                                {{ errorMsg }}
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
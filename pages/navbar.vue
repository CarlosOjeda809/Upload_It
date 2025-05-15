<script setup>


const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();
const birth = ref(null);

const { logout } = auth();

async function checkBirth() {
    if (user.value?.id) {
        const { data, error } = await client
            .from('users')
            .select('birth')
            .eq('id', user.value.id)
            .single();

        if (error) {
            console.error("Error fetching user data:", error);
            return;
        }

        birth.value = data?.birth;

        if (!birth.value) {
            router.push('/end-register');
        } else {
            router.push('/profile');
        }
    }
}


</script>

<template>
    <nav
        class="text-pink-800 px-6 py-4 bg-white/80 backdrop-blur-md flex justify-between items-center shadow-md sticky top-0 z-10">
        <NuxtLink to="/" class="flex items-center space-x-2 cursor-pointer">
            <div
                class="bg-gradient-to-r from-pink-500 to-purple-600  text-white p-2 rounded-lg shadow-md">
                <Icon name="material-symbols:cloud-upload" class="text-xl icon-margin-fix" />
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent">
                UPLOAD IT</h1>
        </NuxtLink>
        <div class="flex items-center space-x-3">
            <NuxtLink v-if="!user" to='/login'
                class="bg-gradient-to-r from-pink-500 to-purple-600 cursor-pointer text-white py-2 px-4 rounded-md font-medium hover:shadow-lg transition duration-200">
                INICIAR SESIÓN
            </NuxtLink>
            <NuxtLink to="/profile" v-if="user" 
                class="bg-pink-100 text-pink-700 py-2 px-3 rounded-md cursor-pointer font-medium hover:bg-pink-200 transition duration-200 flex items-center">
                <Icon name="material-symbols:person" class="text-xl" />
            </NuxtLink>
            <button v-if="user" @click="logout()"
                class="bg-purple-100 text-purple-700 p-2 cursor-pointer rounded-md font-medium hover:bg-purple-200 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
        </div>
    </nav>
</template>
<script>

</script>

<template>
    <div class="flex justify-center">
        <Icon name="material-symbols:lock" class="text-5xl text-pink-600 mb-4 leading-none" />
    </div>
    <h2 class="text-2xl font-bold text-gray-800 mb-3">Inicia sesión para gestionar tus archivos</h2>
    <p class="text-gray-600 mb-6">Necesitas iniciar sesión para subir y administrar tus archivos.</p>
    <NuxtLink to="/login"
        class="bg-gradient-to-r from-pink-500 to-purple-600 cursor-pointer text-white py-3 px-6 rounded-md font-medium hover:shadow-xl hover:-translate-y-0.5 transition duration-200">
        INICIAR SESIÓN
    </NuxtLink>
</template>
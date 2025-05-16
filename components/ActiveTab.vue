<script setup>

</script>

<template>
    <div class="flex border-b border-gray-200">
        <button @click="activeTab = 'upload'"
            :class="['flex-1 py-4 text-center cursor-pointer font-medium transition duration-200',
                activeTab === 'upload' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-600 hover:text-pink-500']">
            <div class="flex items-center justify-center">
                <Icon name="material-symbols:upload" class="mr-2 flex-shrink-0 leading-none" />
                <span>Subir Archivos</span>
            </div>
        </button>
        <button @click="activeTab = 'files'"
            :class="['flex-1 py-4 text-center  font-medium transition duration-200',
                activeTab === 'files' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-600 hover:text-pink-500']">
            <div class="flex items-center cursor-pointer justify-center">
                <Icon name="material-symbols:folder" class="mr-2 flex-shrink-0 leading-none" />
                <span>Mis Archivos</span>
            </div>
        </button>
    </div>
</template>

<style lang="postcss" scoped></style>

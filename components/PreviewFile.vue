<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    file: {
        type: Object,
        required: true 
    },
    onClose: {
        type: Function,
        required: true
    },
    onDelete: {
        type: Function,
        required: true
    },
    onArchive: {
        type: Function,
        required: true
    },
    onRestore: {
        type: Function,
        required: true
    }
});

</script>

<template>
    <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full overflow-auto">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="font-semibold text-lg text-gray-700">{{ file?.name }}</h3>
            <button @click="onClose()"
                class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <Icon name="material-symbols:close" class="text-2xl cursor-pointer leading-none" />
            </button>
        </div>

        <div class="p-6 flex justify-center bg-gray-50">
            <img v-if="file?.type === 'image'" :src="file?.url" :alt="file?.name"
                class="max-h-96 max-w-full object-contain rounded-md shadow-md" />

            <audio v-if="file?.type === 'audio'" controls class="w-full">
                <source :src="file?.url" type="audio/mpeg">
                Tu navegador no soporta la reproducción de audio.
            </audio>

            <video v-if="file?.type === 'video'" controls class="max-h-96 max-w-full rounded-md shadow-md">
                <source :src="file?.url" type="video/mp4">
                Tu navegador no soporta la reproducción de video.
            </video>
            
        </div>


        <div class="p-4 border-t border-gray-200 flex justify-end space-x-3">
            <button @click="onDelete(file); onClose()"
                class="px-4 py-2 border border-red-200 text-red-600 rounded-md cursor-pointer hover:bg-red-50 flex items-center transition">
                <Icon name="material-symbols:delete" class="mr-2" />
                Eliminar
            </button>

            <button v-if="file?.category === 'archivados'" @click="onRestore(file); onClose()"
                class="px-4 py-2 border border-green-200 text-green-600 rounded-md cursor-pointer hover:bg-green-50 flex items-center transition">
                <Icon name="material-symbols:restore" class="mr-2" />
                Restaurar
            </button>
            <button v-else @click="onArchive(file); onClose()"
                class="px-4 py-2 border border-purple-200 text-purple-600 rounded-md cursor-pointer hover:bg-purple-50 flex items-center transition">
                <Icon name="material-symbols:archive" class="mr-2" />
                Archivar
            </button>

            <a :href="file?.url" download
                class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md hover:shadow-md transition flex items-center">
                <Icon name="material-symbols:download" class="mr-2" />
                Descargar
            </a>
        </div>
    </div>
</template>
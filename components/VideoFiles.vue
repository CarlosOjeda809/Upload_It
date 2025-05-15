<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    videos: {
        type: Array,
        default: () => []
    },
    fileType: {
        type: Object,
        required: true
    },
    formatSizeFn: {
        type: Function,
        required: true
    },
    archiveFileFn: {
        type: Function,
        required: true
    },
    deleteFileFn: {
        type: Function,
        required: true
    },
    openPreviewFn: {
        type: Function,
        required: true
    }
});
</script>

<template>
    <div class="flex items-center mb-4">
        <div class="mr-3 flex items-center justify-center">
            <Icon :name="fileType.icon" class="text-blue-700 text-xl leading-none" />
        </div>
        <h3 class="font-semibold text-lg text-gray-800">{{ fileType.name }}</h3>
    </div>

    <div class="space-y-4">
        <div v-for="file in videos" :key="file.name" class="bg-gray-50 rounded-lg overflow-hidden">
            <div class="relative group cursor-pointer" @click="openPreviewFn(file)">
                <video class="w-full object-cover h-40 cursor-pointer" @click="openPreviewFn(file)">
                    <source :src="file.url" type="video/mp4">
                    Tu navegador no soporta la reproducción de video.
                </video>
                <div class="absolute inset-0 flex items-center justify-center group-hover:bg-black/30 transition">
                    <button
                        class="bg-white/90 p-3 rounded-full text-blue-600 transform scale-90 group-hover:scale-100 transition flex items-center justify-center"
                        @click.stop="openPreviewFn(file)">
                        <Icon name="material-symbols:play-arrow" class="text-xl cursor-pointer leading-none" />
                    </button>
                </div>
            </div>
            <div class="p-3 flex justify-between items-center">
                <span class="font-medium text-gray-800 truncate max-w-xs">{{ file.name }}</span>
                <div class="flex space-x-1">
                    <a :href="file.url" target="_blank" download
                        class="p-1.5 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition flex items-center justify-center">
                        <Icon name="material-symbols:download" class="text-sm leading-none" />
                    </a>
                    <button @click="archiveFileFn(file)"
                        class="p-1.5 text-gray-600 hover:text-purple-600 cursor-pointer hover:bg-purple-50 rounded-full transition flex items-center justify-center"
                        title="Archivar">
                        <Icon name="material-symbols:archive" class="text-sm leading-none" />
                    </button>
                    <button @click="deleteFileFn(file)"
                        class="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer rounded-full transition flex items-center justify-center">
                        <Icon name="material-symbols:delete" class="text-sm leading-none" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

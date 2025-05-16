<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    images: {
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
        <div class="p-2 bg-purple-100 rounded-lg mr-3 flex items-center justify-center">

            <Icon :name="fileType.icon" class="text-purple-700 text-xl leading-none" />

        </div>
        <h3 class="font-semibold text-lg text-gray-800">{{ fileType.name }}</h3>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div v-for="file in images" :key="file.name"
            class="group relative rounded-lg cursor-pointer overflow-hidden shadow-sm border border-gray-100">
            <img :src="file.url" :alt="file.name"
                class="h-32 w-full object-cover transition-transform group-hover:scale-105"
                @click="openPreviewFn(file)" />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p class="text-white text-xs truncate">{{ file.name }}</p>
            </div>
            <div class="absolute top-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click.stop="openPreviewFn(file)"
                    class="p-1 bg-white/80 text-purple-600 m-1 cursor-pointer rounded-full hover:bg-white transition flex items-center justify-center">

                    <Icon name="material-symbols:preview" class="text-sm leading-none" />

                </button>
                <a :href="file.url" target="_blank" download @click.stop
                    class="p-1 bg-white/80 text-pink-600 m-1 rounded-full hover:bg-white transition flex items-center justify-center">

                    <Icon name="material-symbols:download" class="text-sm leading-none" />

                </a>
                <button @click.stop="archiveFileFn(file)"
                    class="p-1 bg-white/80 text-purple-600 m-1 cursor-pointer rounded-full hover:bg-white transition flex items-center justify-center"
                    title="Archivar">

                    <Icon name="material-symbols:archive" class="text-sm leading-none" />

                </button>
                <button @click.stop="deleteFileFn(file)"
                    class="p-1 bg-white/80 text-red-600 m-1 rounded-full cursor-pointer hover:bg-white transition flex items-center justify-center">

                    <Icon name="material-symbols:delete" class="text-sm leading-none" />

                </button>

            </div>

        </div>
    </div>
</template>
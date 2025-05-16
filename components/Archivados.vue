<script setup>

const props = defineProps({
    
    file: {
        type: Object,
        required: true 
    },
    getFileTypeFn: {
        type: Function,
        required: true
    },
   
    formatSizeFn: {
        type: Function,
        required: true
    },
    
    openPreviewFn: {
        type: Function,
        required: true
    },
    
    restoreFileFn: {
        type: Function,
        required: true
    },
    
    deleteFileFn: {
        type: Function,
        required: true
    }
});


</script>

<template>
    <div class="flex items-center space-x-3 flex-1 min-w-0">
        <div class="p-2 bg-gray-200 rounded-md flex items-center justify-center">
            <Icon v-if="getFileTypeFn(file.name) === 'image'" name="material-symbols:image"
                class="text-purple-600 leading-none" />
            <Icon v-else-if="getFileTypeFn(file.name) === 'audio'" name="material-symbols:audio-file"
                class="text-indigo-600 leading-none" />
            <Icon v-else-if="getFileTypeFn(file.name) === 'video'" name="material-symbols:video-file"
                class="text-blue-600 leading-none" />
            <Icon v-else name="material-symbols:description" class="text-pink-600 leading-none" />
        </div>
        <div class="min-w-0">
            <p class="font-medium text-gray-800 truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatSizeFn(file.size) }}</p>
        </div>
    </div>
    <div class="flex items-center space-x-1">
        <button @click="openPreviewFn(file)"
            class="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition flex items-center justify-center">
            <Icon name="material-symbols:preview" class="leading-none" />
        </button>
        <a :href="file.url" target="_blank" download
            class="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition flex items-center justify-center">
            <Icon name="material-symbols:download" class="leading-none" />
        </a>
        <button @click="restoreFileFn(file)"
            class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 cursor-pointer rounded-full transition flex items-center justify-center"
            title="Restaurar archivo">
            <Icon name="material-symbols:restore-page-rounded" class="leading-none" />
        </button>
        <button @click="deleteFileFn(file)"
            class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer rounded-full transition flex items-center justify-center">
            <Icon name="material-symbols:delete" class="leading-none" />
        </button>
    </div>
</template>
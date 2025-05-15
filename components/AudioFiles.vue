<script setup>

const props = defineProps({
  audios: {
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
  }
});

</script>

<template>
    <div class="flex items-center mb-4">
        <div class="p-2 bg-indigo-100 rounded-lg mr-3 flex items-center justify-center">
            <Icon :name="fileTypes[2].icon" class="text-indigo-700 text-xl leading-none" />
        </div>
        <h3 class="font-semibold text-lg text-gray-800">{{ fileTypes[2].name }}</h3>
    </div>

    <div class="divide-y divide-gray-100">
        <div v-for="file in fileCategories.audios" :key="file.name" class="py-4 first:pt-1">
            <div class="flex justify-between items-center mb-2">
                <div class="flex items-center space-x-3">
                    <div class="p-2 bg-indigo-100 rounded-md flex items-center justify-center">
                        <Icon name="material-symbols:audio-file" class="text-indigo-600 leading-none" />
                    </div>
                    <span class="font-medium text-gray-800 truncate max-w-xs">{{
                        file.name }}</span>
                </div>
                <div class="flex items-center space-x-1">
                    <button @click="openPreview(file)"
                        class="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition flex items-center justify-center">
                        <Icon name="material-symbols:play-circle" class="leading-none" />
                    </button>
                    <a :href="file.url" target="_blank" download
                        class="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition flex items-center justify-center">
                        <Icon name="material-symbols:download" class="leading-none" />
                    </a>
                    <button @click="archiveFile(file)"
                        class="p-2 text-gray-600 hover:text-purple-600 cursor-pointer hover:bg-purple-50 rounded-full transition flex items-center justify-center"
                        title="Archivar">
                        <Icon name="material-symbols:archive" class="leading-none" />
                    </button>
                    <button @click="deleteFile(file)"
                        class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 cursor-pointer rounded-full transition flex items-center justify-center">
                        <Icon name="material-symbols:delete" class="leading-none" />
                    </button>
                </div>
            </div>

            <audio controls class="w-full h-10 mt-2">
                <source :src="file.url" type="audio/mpeg">
                Tu navegador no soporta la reproducción de audio.
            </audio>
        </div>
    </div>
</template>
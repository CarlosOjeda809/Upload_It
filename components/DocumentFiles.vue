<script setup>

const props = defineProps({
    documents: {
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
        <div class="p-2 bg-pink-100 rounded-lg mr-3 flex items-center justify-center">
            <Icon :name="fileType.icon" class="text-pink-700 text-xl leading-none" />
        </div>
        <h3 class="font-semibold text-lg text-gray-800">{{ fileType.name }}</h3>
    </div>

    <div class="divide-y divide-gray-100">
        <div v-for="file in documents" :key="file.name"
            class="py-4 first:pt-1 hover:bg-pink-50/50 transition duration-200 rounded-md px-2">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3 flex-1 min-w-0">
                    <div class="p-2 bg-pink-100 rounded-md flex items-center justify-center">
                        <Icon name="material-symbols:description" class="text-pink-600 leading-none" />
                    </div>
                    <div class="min-w-0">
                        <p class="font-medium text-gray-800 truncate">{{ file.name }}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-1">
                    <a :href="file.url" target="_blank" download
                        class="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition flex items-center justify-center">
                        <Icon name="material-symbols:download" class="leading-none" />
                    </a>
                    <button @click="archiveFileFn(file)"
                        class="p-2 text-gray-600 hover:text-purple-600 cursor-pointer hover:bg-purple-50 rounded-full transition flex items-center justify-center"
                        title="Archivar">
                        <Icon name="material-symbols:archive" class="leading-none" />
                    </button>
                    <button @click="deleteFileFn(file)"
                        class="p-2 text-gray-600 hover:text-red-600 cursor-pointer hover:bg-red-50 rounded-full transition flex items-center justify-center">
                        <Icon name="material-symbols:delete" class="leading-none" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { auth } from '@/composables/auth';
import { filemanager } from '@/composables/filemanager';
import { filepreview } from '@/composables/filepreview';
import { fileupload } from '@/composables/fileupload';

const { user, userName, getUserName, logout: logoutUser } = auth();
const {
    fileCategories,
    loadingFiles,
    listUserFiles,
    archiveFile,
    deleteFile,
    restoreFile,
    getCategoryCount,
    formatFileSize,
    getFileType
} = filemanager(user);

const { previewFile, showPreview, openPreview, closePreview } = filepreview();

const {
    documentFile,
    isUploadingDocument,
    documentUploadError,
    uploadDocument: uploadFile
} = fileupload(user, listUserFiles);

const router = useRouter();
const activeTab = ref('upload');
const fileTypes = [
    { name: 'Documentos', value: 'documents', icon: 'material-symbols:description' },
    { name: 'Imágenes', value: 'images', icon: 'material-symbols:image' },
    { name: 'Audios', value: 'audios', icon: 'material-symbols:audio-file' },
    { name: 'Videos', value: 'videos', icon: 'material-symbols:video-file' },
    { name: 'Archivados', value: 'archivados', icon: 'material-symbols:archive' }
];

const handleDocumentUpload = (event) => {
    documentFile.value = event.target.files[0];
};

const uploadDocument = async () => {
    await uploadFile();
    if (!documentUploadError.value) {
        activeTab.value = 'files';
    }
};

const totalFiles = computed(() => {
    let count = 0;
    if (fileCategories.value) {

        count += fileCategories.value.documents?.length || 0;
        count += fileCategories.value.images?.length || 0;
        count += fileCategories.value.audios?.length || 0;
        count += fileCategories.value.videos?.length || 0;

    }
    return count;
});


onMounted(async () => {
    await getUserName();
    if (user.value) {
        await listUserFiles();
    }
});


</script>

<template>
    <div class="flex flex-col bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 h-full">
        <main class="flex-grow container mx-auto p-4 md:p-6 xl:max-w-6xl">
            <div v-if="!user" class="mt-10 bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 text-center">
                <NoUserPage />
                <div v-if="user">
                    <div class="bg-white/70 rounded-xl shadow-lg mt-6 overflow-hidden">
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

                        <div v-if="activeTab === 'upload'" class="p-6">
                            <div class="text-center mb-6">
                                <h2 class="text-2xl font-bold text-gray-800 mb-2">Sube tus archivos</h2>
                                <p class="text-gray-600">Arrastra aquí tu archivo o selecciónalo desde tu dispositivo
                                </p>
                            </div>

                            <div
                                class="border-2 border-dashed border-pink-300 rounded-xl p-8 bg-pink-50/50 flex flex-col items-center justify-center">
                                <div class="flex justify-center">
                                    <Icon name="material-symbols:cloud-upload"
                                        class="text-6xl text-pink-400 mb-4 leading-none" />
                                </div>

                                <div class="flex flex-col items-center w-full max-w-md">
                                    <input type="file" class="hidden" id="document-upload"
                                        @change="handleDocumentUpload($event)" />
                                    <label for="document-upload"
                                        class="w-full mt-4 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg cursor-pointer hover:shadow-lg transition duration-200 text-center flex items-center justify-center space-x-2">
                                        <Icon name="material-symbols:attach-file"
                                            class="mr-2 flex-shrink-0 leading-none" />
                                        <span>Seleccionar Archivo</span>
                                    </label>

                                    <div v-if="documentFile"
                                        class="mt-4 p-4 bg-white/80 rounded-lg w-full flex items-center justify-between">
                                        <div class="flex items-center">
                                            <Icon name="material-symbols:insert-drive-file"
                                                class="text-pink-500 mr-2 flex-shrink-0 leading-none" />
                                            <div>
                                                <p class="font-medium text-gray-800 truncate max-w-xs">{{
                                                    documentFile.name
                                                    }}</p>
                                                <p class="text-sm text-gray-500">{{ formatFileSize(documentFile.size) }}
                                                </p>
                                            </div>
                                        </div>
                                        <button @click="documentFile = null" class="text-gray-500 hover:text-red-500">
                                            <Icon name="material-symbols:close" class="cursor-pointer leading-none" />
                                        </button>
                                    </div>

                                    <button @click="uploadDocument" :disabled="isUploadingDocument || !documentFile"
                                        class="mt-6 py-3 px-8 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center w-64">
                                        <span v-if="isUploadingDocument" class="flex items-center">
                                            <Icon name="eos-icons:loading"
                                                class="animate-spin mr-2 flex-shrink-0 leading-none" />
                                            <span>Subiendo...</span>
                                        </span>
                                        <span v-else class="flex items-center cursor-pointer">
                                            <Icon name="material-symbols:upload-file"
                                                class="mr-2 flex-shrink-0 leading-none" />
                                            <span>Subir Archivo</span>
                                        </span>
                                    </button>

                                    <p v-if="documentUploadError"
                                        class="text-red-500 text-sm mt-4 bg-red-50 p-3 rounded-md w-full text-center">
                                        {{ documentUploadError }}
                                    </p>
                                </div>
                            </div>

                            <div class="mt-6 bg-white/80 rounded-lg p-4">
                                <h3 class="font-medium text-gray-700 mb-2">Secciones:</h3>
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div v-for="type in fileTypes" :key="type.value"
                                        class="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex items-center">
                                        <Icon :name="type.icon" class="text-pink-600 mr-2 flex-shrink-0 leading-none" />
                                        <span class="text-gray-700">{{ type.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="activeTab === 'files'" class="p-6">
                            <div class="mb-6">
                                <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                                    Mis Archivos
                                    <span v-if="totalFiles > 0"
                                        class="ml-3 bg-pink-100 text-pink-700 text-sm px-3 py-1 rounded-full">
                                        {{ totalFiles }} archivos
                                    </span>
                                </h2>
                                <p class="text-gray-600">Gestiona todos tus archivos subidos</p>
                            </div>

                            <div v-if="loadingFiles" class="flex justify-center items-center py-12">
                                <Icon name="eos-icons:loading"
                                    class="animate-spin text-4xl text-pink-600 flex-shrink-0 leading-none" />
                                <span class="ml-3 text-gray-600">Cargando tus archivos...</span>
                            </div>

                            <div v-else-if="totalFiles === 0" class="bg-white/80 rounded-xl p-8 text-center">
                                <div class="flex justify-center">
                                    <Icon name="material-symbols:folder-off"
                                        class="text-5xl text-gray-400 mb-4 leading-none" />
                                </div>
                                <h3 class="text-xl font-medium text-gray-700 mb-2">No tienes archivos aún</h3>
                                <p class="text-gray-500 mb-6">¡Comienza a subir tus archivos para verlos aquí!</p>
                                <button @click="activeTab = 'upload'"
                                    class="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-6 rounded-md hover:shadow-lg transition duration-200">
                                    Subir ahora
                                </button>
                            </div>

                            <div v-else>
                                <div class="border-b border-gray-200 mb-6 flex flex-wrap">
                                    <button v-for="type in fileTypes" :key="type.value"
                                        :class="['mr-6 py-2 px-3 font-medium flex items-center transition duration-200',

                                            getCategoryCount(type.value) > 0 ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-400']">
                                        <Icon :name="type.icon" class="mr-2 flex-shrink-0 leading-none" />
                                        <span>{{ type.name }}</span>
                                        <span v-if="getCategoryCount(type.value) > 0"
                                            class="ml-2 bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full">
                                            {{ getCategoryCount(type.value) }}
                                        </span>
                                    </button>
                                </div>


                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div v-if="fileCategories.documents?.length > 0"
                                        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                        <DocumentFiles :documents="fileCategories.documents" :file-type="fileTypes[0]"
                                            :format-size-fn="formatFileSize" :archive-file-fn="archiveFile"
                                            :delete-file-fn="deleteFile" />
                                    </div>


                                    <div v-if="fileCategories.images?.length > 0"
                                        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                        <ImageFiles :images="fileCategories.images" :file-type="fileTypes[1]"
                                            :format-size-fn="formatFileSize" :archive-file-fn="archiveFile"
                                            :delete-file-fn="deleteFile" :open-preview-fn="openPreview" />
                                    </div>


                                    <div v-if="fileCategories.audios?.length > 0"
                                        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                        <AudioFiles :audios="fileCategories.audios" :file-type="fileTypes[2]"
                                            :format-size-fn="formatFileSize" :archive-file-fn="archiveFile"
                                            :delete-file-fn="deleteFile" />
                                    </div>

                                    <div v-if="fileCategories.videos?.length > 0"
                                        class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                        <VideoFiles :videos="fileCategories.videos" :file-type="fileTypes[3]"
                                            :format-size-fn="formatFileSize" :archive-file-fn="archiveFile"
                                            :delete-file-fn="deleteFile" :open-preview-fn="openPreview" />
                                    </div>

                                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                        <div class="flex items-center mb-4">
                                            <div
                                                class="p-2 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">

                                                <Icon :name="fileTypes[4].icon"
                                                    class="text-gray-700 text-xl leading-none" />

                                            </div>
                                            <h3 class="font-semibold text-lg text-gray-800">{{ fileTypes[4].name }}
                                            </h3>
                                        </div>

                                        <div v-if="fileCategories.archivados?.length > 0"
                                            class="grid grid-cols-1 gap-3">
                                            <div v-for="file in fileCategories.archivados" :key="file.name"
                                                class="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition">

                                                <Archivados :file="file" :get-file-type-fn="getFileType"
                                                    :format-size-fn="formatFileSize" :open-preview-fn="openPreview"
                                                    :restore-file-fn="restoreFile" :delete-file-fn="deleteFile" />

                                            </div>
                                        </div>
                                        <div v-else>
                                            <p class="text-gray-500">No hay archivos archivados</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="showPreview"
                    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <PreviewFile :file="previewFile" :on-close="closePreview" :on-delete="deleteFile"
                        :on-archive="archiveFile" :on-restore="restoreFile" />
                </div>
            </div>
        </main>
    </div>
</template>
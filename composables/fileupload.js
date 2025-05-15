
export function fileupload(user, listUserFiles) {
    const client = useSupabaseClient();
    const documentFile = ref('');
    const isUploadingDocument = ref(false);
    const documentUploadError = ref(null);

    const uploadDocument = async () => {
        if (!documentFile.value) {
            documentUploadError.value = 'Por favor, selecciona un archivo.';
            return;
        }

        const userId = unref(user)?.id;

        if (!userId) {
            documentUploadError.value = 'Debes iniciar sesión';
            return;
        }

        isUploadingDocument.value = true;
        documentUploadError.value = null;

        const typeMap = {
            image: 'images',
            application: 'documents',
            text: 'documents',
            audio: 'audios',
            video: 'videos'
        };

        const fileType = documentFile.value.type.split('/')[0];
        const storageName = typeMap[fileType];

        if (!storageName) {
            documentUploadError.value = 'No se pudo determinar la categoría del archivo.';
            isUploadingDocument.value = false;
            return;
        }

        const { error } = await client
            .storage
            .from(storageName)
            .upload(`${userId}/${documentFile.value.name}`, documentFile.value, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            documentUploadError.value = `Error al subir el archivo: ${error.message}`;
        } else {
            await listUserFiles();
        }

        isUploadingDocument.value = false;
        documentFile.value = null;
    };

    return {
        documentFile,
        isUploadingDocument,
        documentUploadError,
        uploadDocument,
    };
}
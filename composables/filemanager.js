

export function filemanager() {
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const router = useRoute()
    const fileCategories = ref({
        documents: [],
        images: [],
        audios: [],
        videos: [],
        archivados: []
    });
    const loadingFiles = ref(false);

    const getFileType = (fileName) => {
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        const map = {
            image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'avif'],
            audio: ['mp3', 'wav', 'ogg', 'aac', 'm4a'],
            video: ['mp4', 'webm', 'mov', 'avi', 'mkv']
        };

        if (map.image.includes(extension)) return 'image';
        if (map.audio.includes(extension)) return 'audio';
        if (map.video.includes(extension)) return 'video';
        return 'document';
    };

    const listUserFiles = async () => {
        if (!user.value) return;
        loadingFiles.value = true;

        const fileTypes = [
            { name: 'Documentos', value: 'documents' },
            { name: 'Imágenes', value: 'images' },
            { name: 'Audios', value: 'audios' },
            { name: 'Videos', value: 'videos' },
            { name: 'Archivados', value: 'archivados' }
        ];

        fileCategories.value = {
            documents: [],
            images: [],
            audios: [],
            videos: [],
            archivados: []
        };

        await Promise.all(fileTypes.map(async ({ value }) => {
            const { data, error } = await client
                .storage
                .from(value)
                .list(`${user.value?.id}/`);

            if (!error && data?.length) {
                const files = await Promise.all(data.map(async file => {
                    const { data: urlData } = client
                        .storage
                        .from(value)
                        .getPublicUrl(`${user.value?.id}/${file.name}`);

                    return {
                        ...file,
                        url: urlData.publicUrl,
                        type: getFileType(file.name),
                        category: value
                    };
                }));

                fileCategories.value[value] = files;
            }
        }));

        loadingFiles.value = false;
    };

    const archiveFile = async (file) => {
        if (!user.value) return;

        const { name, category: sourceCategory } = file;
        const path = `${user.value.id}/${name}`;

        const { data: fileData, error: downloadError } = await client
            .storage
            .from(sourceCategory)
            .download(path);

        if (downloadError) return console.error('Error al descargar', downloadError.message);

        const { error: uploadError } = await client
            .storage
            .from('archivados')
            .upload(path, fileData, { cacheControl: '3600', upsert: true });

        if (uploadError) return console.error('Error al archivar', uploadError.message);

        await client
            .storage
            .from(sourceCategory)
            .remove([path]);

        fileCategories.value[sourceCategory] = fileCategories.value[sourceCategory].filter(f => f.name !== name);

        const { data: urlData } = client
            .storage
            .from('archivados')
            .getPublicUrl(path);

        fileCategories.value.archivados.push({
            ...file,
            url: urlData.publicUrl,
            category: 'archivados'
        });
    };

    const deleteFile = async (file) => {
        if (!user.value) return;

        const filePath = `${user.value.id}/${file.name}`;

        const { error } = await client
            .storage
            .from(file.category)
            .remove([filePath]);

        if (!error) {
            fileCategories.value[file.category] = fileCategories.value[file.category].filter(f => f.name !== file.name);
        } else {
            console.error('Error al eliminar archivo', error.message);
        }
    };

    const getCategoryCount = (category) => fileCategories.value[category]?.length || 0;

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    };


    const restoreFile = async (file) => {
        if (!user.value) return;

        const fileType = getFileType(file.name);
        let targetBucket = 'documents';

        if (fileType === 'image') targetBucket = 'images';
        else if (fileType === 'audio') targetBucket = 'audios';
        else if (fileType === 'video') targetBucket = 'videos';

        const path = `${user.value.id}/${file.name}`;

        const { data: fileData, error: downloadError } = await client
            .storage
            .from('archivados')
            .download(path);

        if (downloadError) return console.error('Error al descargar', downloadError.message);

        const { error: uploadError } = await client
            .storage
            .from(targetBucket)
            .upload(path, fileData, { cacheControl: '3600', upsert: true });

        if (uploadError) return console.error('Error al restaurar', uploadError.message);


        await client
            .storage
            .from('archivados')
            .remove([path]);


        fileCategories.value.archivados = fileCategories.value.archivados.filter(f => f.name !== file.name);


        const { data: urlData } = client
            .storage
            .from(targetBucket)
            .getPublicUrl(path);


        fileCategories.value[targetBucket].push({
            ...file,
            url: urlData.publicUrl,
            category: targetBucket
        });
    };

    return {
        fileCategories,
        loadingFiles,
        listUserFiles,
        archiveFile,
        restoreFile,
        deleteFile,
        getCategoryCount,
        formatFileSize,
        getFileType
    };
}
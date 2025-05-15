export function filepreview() {
    const previewFile = ref(null);
    const showPreview = ref(false);
  
    const openPreview = (file) => {
      previewFile.value = file;
      showPreview.value = true;
    };
  
    const closePreview = () => {
      showPreview.value = false;
      previewFile.value = null;
    };
  
    return {
      previewFile,
      showPreview,
      openPreview,
      closePreview
    };
  }
  
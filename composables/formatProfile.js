

export function profile() {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  
  const userDataRef = ref(null); 
  const isLoading = ref(true); 
  const errorMsg = ref(null);

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return 'No especificado';
    }
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const fetchUserProfile = async () => {
    isLoading.value = true;
    errorMsg.value = null; 

    if (!user.value) {
      errorMsg.value = 'Usuario no autenticado.';
      isLoading.value = false;
      userDataRef.value = null;
      return;
    }

    try {
      const { data, error } = await client
        .from('users') 
        .select('id, nombre, email, birth')
        .eq('id', user.value.id)
        .single();

      if (error && error.code === 'PGRST116') { 
        console.warn('No se encontraron datos de perfil existentes para el usuario, intentando crear uno nuevo.');
       
        const userDataFallback = {
          id: user.value.id,
          nombre: user.value.user_metadata?.full_name ||
                  user.value.user_metadata?.name ||
                  user.value.email?.split('@')[0] ||
                  'Usuario',
          email: user.value.email,
          birth: null
        };

        const { data: insertData, error: insertError } = await client
          .from('users')
          .insert(userDataFallback)
          .select('*');

        if (insertError) {
          errorMsg.value = 'Error al crear perfil de usuario: ' + insertError.message;
          console.error('Error al insertar usuario:', insertError);
          userDataRef.value = null;
        } else {
          userDataRef.value = insertData[0]; 
          console.log('Perfil de usuario creado exitosamente:', userDataRef.value);
        }

      } else if (error) {
        
        console.error('Error al obtener datos del usuario:', error);
        errorMsg.value = 'Error al cargar tu perfil: ' + error.message;
        userDataRef.value = null;
      } else {
        
        userDataRef.value = data;
      }
    } catch (unexpectedError) {
      console.error('Error inesperado al obtener o crear datos del usuario:', unexpectedError);
      errorMsg.value = 'Ocurrió un error inesperado al cargar tu perfil.';
      userDataRef.value = null;
    } finally {
      isLoading.value = false; 
    }
  };

  const checkBirthStatus = async () => {
    if (!user.value?.id) {
      return { hasBirth: false, error: 'Usuario no autenticado' };
    }

    try {
      const { data, error } = await client
        .from('users')
        .select('birth')
        .eq('id', user.value.id)
        .single();

      if (error && error.code === 'PGRST116') {
    
        return { hasBirth: false, error: null };
      } else if (error) {
        console.error("Error fetching birth data:", error);
        return { hasBirth: false, error: error.message };
      }

     
      return { hasBirth: !!data?.birth, error: null };
    } catch (e) {
      console.error('Error checking birth:', e);
      return { hasBirth: false, error: e.message };
    }
  };

  return {
    userData: userDataRef, 
    isLoading,           
    errorMsg,            
    formatDate,
    fetchUserProfile,    
    checkBirthStatus     
  };
}
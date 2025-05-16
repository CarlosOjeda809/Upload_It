export function profile() {
    const formatDate = (timestamp) => {
      if (!timestamp) {
        return 'No especificado';
      }
      const date = new Date(timestamp);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };
    
    const userData = async () => {
      isLoading.value = true;
      errorMsg.value = null;
      try {
        const { data, error } = await client
          .from('users')
          .select('nombre, email, birth')
          .eq('id', user.value?.id)
          .single();
    
        if (error) {
          console.error('Error al obtener datos del usuario:', error);
    
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
            .select();
    
          if (insertError) {
            errorMsg.value = 'Error al crear perfil de usuario.';
            console.error('Error al insertar usuario:', insertError);
          } else {
            users.value = userDataFallback;
          }
    
        } else {
          users.value = data;
        }
      } catch (error) {
        console.error('Error inesperado al obtener datos del usuario:', error);
        errorMsg.value = 'Ocurrió un error inesperado.';
      } finally {
        isLoading.value = false;
      }
    };
    
    
    async function checkBirth() {
      if (user.value?.id) {
        const { data, error } = await client
          .from('users')
          .select('birth')
          .eq('id', user.value.id)
          .single();
    
        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }
    
    
    
        if (!data?.birth) {
          router.push('/end-register');
        } else {
          router.push('/profile');
        }
      }
    }
    return {
        formatDate,
        userData,
        checkBirth,
        
    }
}
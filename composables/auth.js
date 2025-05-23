

export function auth() {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const userName = ref('');
  const isLoading = ref(false);
  const errorMsg = ref('');
  const emailData = ref('');
  const contraseñaData = ref('');
  const config = useRuntimeConfig();
  const router = useRouter();

  const getUserName = async () => {
    if (user.value) {
      const { data, error } = await client
        .from('users')
        .select('nombre')
        .eq('id', user.value.id)
        .single();

      if (!error) userName.value = data.nombre;
    }
  };

  const logout = async () => {
    const { error } = await client.auth.signOut();
    if (!error) userName.value = '';
  };

  const loginDatos = async () => {
    if (!emailData.value || !contraseñaData.value) {
      errorMsg.value = 'Rellena todos los campos';
      return false;
    }

    isLoading.value = true;

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: emailData.value,
        password: contraseñaData.value,
      });

      if (error) {
        console.error('Error al iniciar sesión:', error);
        errorMsg.value = error.message;
        return false;
      }

      errorMsg.value = ''

      const { data: userData, error: userError } = await client
        .from('users')
        .select('birth')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        console.error('Error al verificar datos de usuario:', userError);
      }

      if (!userData || !userData.birth) {
        router.push('/end-register');
      } else {
        router.push('/');
      }
    } catch (e) {
      errorMsg.value = 'Error inesperado. Inténtalo de nuevo.'
    } finally {
      isLoading.value = false;
    }
  }

  const getBaseUrl = () => {
    if (process.client) {
      const isLocalhost = window.location.hostname === 'localhost';
      return isLocalhost
        ? 'http://localhost:3000'
        : 'https://uploadit.ojedacarlos.com';
    }
    return '';
  };

  const loginConGoogle = async () => {
    isLoading.value = true;
    try {
      const baseUrl = getBaseUrl();

      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/end-register`
        }
      });

      if (error) {
        console.error('Error al iniciar sesión con Google:', error);
        errorMsg.value = error.message;
        return false;
      }

      errorMsg.value = '';
    } catch (e) {
      errorMsg.value = 'Error inesperado. Inténtalo de nuevo.';
    } finally {
      isLoading.value = false;
    }
  };



  const loginConGithub = async () => {
    isLoading.value = true;
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: config.public.BASE_URL + '/end-register'
        }
      });

      if (error) {
        console.error('Error al iniciar sesión con Github:', error);
        errorMsg.value = error.message;
        return false;
      }

      errorMsg.value = ''
    } catch (e) {
      errorMsg.value = 'Error inesperado. Inténtalo de nuevo.'
    } finally {
      isLoading.value = false;
    }
  }

  return { user, userName, getUserName, logout, loginDatos, loginConGoogle, loginConGithub, isLoading, errorMsg, emailData, contraseñaData };


}





export function auth() {
  const client = useSupabaseClient();
  const user = useSupabaseUser();
  const userName = ref('');

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

  return { user, userName, getUserName, logout };

  
}



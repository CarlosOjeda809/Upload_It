export function register() {
    const signup = async (nombre, email, contraseña, repetirContraseña) => {
    if (!nombre?.trim() || !email?.trim() || !contraseña?.trim() || !repetirContraseña?.trim()) {
        errorMsg.value = 'Rellena todos los campos';
        successMsg.value = '';
        return false;
    }

    if (contraseña !== repetirContraseña) {
        errorMsg.value = 'Las contraseñas no coinciden';
        successMsg.value = '';
        return false;
    }

    isLoading.value = true;
    
    try {
        const { data, error: authError } = await client.auth.signUp({
            email: email,
            password: contraseña,
        });

        if (authError) {
            console.error('Error al registrarse en Supabase', authError);
            errorMsg.value = authError.message;
            successMsg.value = '';
            return false;
        }

        const userId = data.user?.id;

        if (!userId) {
            errorMsg.value = 'No se ha podido obtener el ID del usuario';
            successMsg.value = '';
            return false;
        }

        const { error: insertError } = await client.from('users').insert([
            {
                id: userId,
                nombre: nombre,
                email: email,
            },
        ]);

        if (insertError) {
            console.error(insertError);
            errorMsg.value = insertError.message;
            successMsg.value = '';
            return false;
        }

        errorMsg.value = '';
        successMsg.value = 'Te has registrado con éxito. Revisa tu correo para verificar tu cuenta.';
        nombreData.value = '';
        emailData.value = '';
        contraseñaData.value = '';
        newContraseñaData.value = '';
        return true;
    } catch (error) {
        console.error('Error inesperado', error);
        errorMsg.value = 'Error inesperado. Inténtalo de nuevo.';
        successMsg.value = '';
        return false;
    } finally {
        isLoading.value = false;
    }
}; 
return {
    signup
} 
}
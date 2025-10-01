-- Crear usuarios de prueba con credenciales de autenticación
-- Nota: Estos usuarios se crearán con contraseñas temporales

-- Para crear usuarios en Supabase Auth, necesitas usar la función auth.users
-- Estos son los usuarios de prueba que puedes crear manualmente:

/*
USUARIOS DE PRUEBA PARA EL SISTEMA:

1. Profesor 1:
   Email: profesor1@universidad.edu
   Contraseña: Profesor123!
   Rol: profesor
   Nombre: Dr. Juan Pérez

2. Administrador:
   Email: admin@universidad.edu  
   Contraseña: Admin123!
   Rol: admin
   Nombre: Administrador Sistema

3. Profesor 2:
   Email: ing.garcia@universidad.edu
   Contraseña: Garcia123!
   Rol: profesor
   Nombre: Ing. María García

INSTRUCCIONES:
- Usa estos emails y contraseñas para hacer login
- Los usuarios se crearán automáticamente en la tabla public.users al hacer login
- Si necesitas crear más usuarios, usa el formulario de registro del sistema
*/

-- Actualizar la función para crear usuarios automáticamente al hacer login
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'profesor')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para usuarios nuevos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

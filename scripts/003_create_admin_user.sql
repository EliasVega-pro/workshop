-- Script para crear el usuario administrador en Supabase Auth y en la tabla de usuarios
-- El administrador será creado con un email y contraseña específicos

-- Primero verificar si el usuario admin ya existe en la tabla users
INSERT INTO public.users (email, name, role)
VALUES ('admin@taller.edu', 'Administrador del Sistema', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Nota: Para crear el usuario en Supabase Auth, debes usar la interfaz de v0 o ejecutar
-- el siguiente comando desde la consola de Supabase:
-- 
-- SELECT auth.uid() FROM auth.users WHERE email = 'admin@taller.edu'
--
-- O usa la API de Supabase para crear usuarios:
-- curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/auth/v1/admin/users' \
--   -H 'apikey: YOUR_SERVICE_ROLE_KEY' \
--   -H 'Content-Type: application/json' \
--   -d '{
--     "email": "admin@taller.edu",
--     "password": "Admin123!@",
--     "email_confirm": true
--   }'

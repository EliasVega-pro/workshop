-- Crear usuarios de prueba en auth.users y public.users
-- Nota: Estos usuarios necesitarán confirmar su email para poder hacer login

-- Insertar usuarios de prueba en la tabla pública
INSERT INTO public.users (email, name, role) VALUES
('profesor1@universidad.edu', 'Dr. Juan Pérez', 'profesor'),
('admin@universidad.edu', 'Administrador Sistema', 'admin'),
('ing.garcia@universidad.edu', 'Ing. María García', 'profesor')
ON CONFLICT (email) DO NOTHING;

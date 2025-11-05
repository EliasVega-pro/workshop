-- Insertar usuario administrador en la tabla de usuarios
INSERT INTO public.users (email, name, role)
VALUES ('admin@taller.edu', 'Administrador del Sistema', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

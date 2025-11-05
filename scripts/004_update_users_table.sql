-- Agregar columna de contraseña a la tabla users si no existe
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT '';

-- Insertar usuario administrador
INSERT INTO users (email, name, password, role) 
VALUES ('admin@taller.edu', 'Administrador', 'navojoa2026', 'admin')
ON CONFLICT (email) DO UPDATE SET password = 'navojoa2026';

-- Insertar usuario profesor de prueba
INSERT INTO users (email, name, password, role) 
VALUES ('profesor1@universidad.edu', 'Profesor 1', 'Profesor123!', 'profesor')
ON CONFLICT (email) DO NOTHING;

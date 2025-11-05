-- Crear tabla de usuarios (profesores)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'profesor' CHECK (role IN ('profesor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de materias
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de reservaciones
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  reservation_date DATE NOT NULL,
  usage_date DATE NOT NULL,
  status TEXT DEFAULT 'activa' CHECK (status IN ('activa', 'completada', 'cancelada')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de materiales
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  available_quantity INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'unidad',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de materiales por reservación
CREATE TABLE IF NOT EXISTS public.reservation_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_materials ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores si existen
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Users can view their own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can create their own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can update their own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admins can view all reservations" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can view materials" ON public.materials;
DROP POLICY IF EXISTS "Admins can manage materials" ON public.materials;
DROP POLICY IF EXISTS "Users can manage materials for their reservations" ON public.reservation_materials;
DROP POLICY IF EXISTS "Admins can view all reservation materials" ON public.reservation_materials;

-- Políticas simples para usuarios
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Anyone can insert users" ON public.users FOR INSERT WITH CHECK (true);

-- Políticas para materias
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert subjects" ON public.subjects FOR INSERT WITH CHECK (true);

-- Políticas para reservaciones
CREATE POLICY "Users can view their own reservations" ON public.reservations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own reservations" ON public.reservations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own reservations" ON public.reservations FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert any reservation" ON public.reservations FOR INSERT WITH CHECK (true);

-- Políticas para materiales
CREATE POLICY "Anyone can view materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Anyone can insert materials" ON public.materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update materials" ON public.materials FOR UPDATE USING (true);

-- Políticas para materiales de reservación
CREATE POLICY "Anyone can view reservation materials" ON public.reservation_materials FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reservation materials" ON public.reservation_materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete reservation materials" ON public.reservation_materials FOR DELETE USING (true);

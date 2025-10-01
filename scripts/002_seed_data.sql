-- Insertar materias de ejemplo
INSERT INTO public.subjects (name, description) VALUES
('Mecánica de Fluidos', 'Estudio del comportamiento de fluidos en reposo y movimiento'),
('Termodinámica', 'Estudio de las relaciones entre calor, trabajo y energía'),
('Resistencia de Materiales', 'Análisis de esfuerzos y deformaciones en estructuras'),
('Circuitos Eléctricos', 'Análisis y diseño de circuitos eléctricos'),
('Programación', 'Desarrollo de software y algoritmos')
ON CONFLICT DO NOTHING;

-- Insertar materiales de ejemplo
INSERT INTO public.materials (name, description, available_quantity, unit) VALUES
('Multímetro Digital', 'Instrumento de medición eléctrica', 15, 'unidad'),
('Protoboard', 'Placa de pruebas para circuitos', 25, 'unidad'),
('Resistencias 1kΩ', 'Resistencias de 1 kilohmio', 100, 'unidad'),
('LEDs Rojos', 'Diodos emisores de luz rojos', 50, 'unidad'),
('Cables Jumper', 'Cables de conexión', 200, 'unidad'),
('Osciloscopio', 'Instrumento de medición de señales', 5, 'unidad'),
('Fuente de Alimentación', 'Suministro de energía regulable', 8, 'unidad'),
('Computadora', 'Equipo de cómputo para programación', 20, 'unidad'),
('Proyector', 'Equipo de proyección', 3, 'unidad'),
('Pizarra Digital', 'Pizarra interactiva', 2, 'unidad')
ON CONFLICT DO NOTHING;

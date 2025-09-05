-- Limpiar datos existentes del 2026
DELETE FROM activities WHERE scheduled_date >= '2026-01-01' AND scheduled_date < '2027-01-01';

-- Insertar actividades completas del 2026 comenzando el lunes 2 de febrero
-- CICLO 1: Febrero-Marzo 2026
INSERT INTO activities (name, type, scheduled_date, duration, priority, status, planned_hectares) VALUES

-- ===== FEBRERO 2026 =====
-- Primera vuelta (Febrero 2-14)
('Aplicación Preventiva Biológicos - Bloque 11 Parte 1 (15 ha)', 'aplicacion_biologicos', '2026-02-02 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 1 (28 ha)', 'aplicacion_biologicos', '2026-02-03 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 1 (60 ha)', 'aplicacion_biologicos', '2026-02-04 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 1 (22 ha)', 'aplicacion_biologicos', '2026-02-05 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 1 (54 ha)', 'aplicacion_biologicos', '2026-02-06 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 1 (43 ha)', 'aplicacion_biologicos', '2026-02-07 08:00:00', 344, 'alta', 'programada', 43),

-- Saltamos domingo 8
('Aplicación Preventiva Biológicos - Bloque 6 Parte 1 (38 ha)', 'aplicacion_biologicos', '2026-02-09 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 1 (30 ha)', 'aplicacion_biologicos', '2026-02-10 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 1 (23 ha)', 'aplicacion_biologicos', '2026-02-11 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 2 (15 ha)', 'aplicacion_biologicos', '2026-02-12 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 2 (28 ha)', 'aplicacion_biologicos', '2026-02-13 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 2 (60 ha)', 'aplicacion_biologicos', '2026-02-14 08:00:00', 480, 'alta', 'programada', 60),

-- Saltamos domingo 15
-- Segunda vuelta (Febrero 16-28)
('Aplicación Preventiva Biológicos - Bloque 3 Parte 2 (22 ha)', 'aplicacion_biologicos', '2026-02-16 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 2 (54 ha)', 'aplicacion_biologicos', '2026-02-17 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 2 (43 ha)', 'aplicacion_biologicos', '2026-02-18 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 2 (38 ha)', 'aplicacion_biologicos', '2026-02-19 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 2 (30 ha)', 'aplicacion_biologicos', '2026-02-20 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 2 (23 ha)', 'aplicacion_biologicos', '2026-02-21 08:00:00', 184, 'alta', 'programada', 23),

-- Saltamos domingo 22
('Aplicación Preventiva Biológicos - Bloque 11 Parte 3 (15 ha)', 'aplicacion_biologicos', '2026-02-23 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 3 (28 ha)', 'aplicacion_biologicos', '2026-02-24 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 3 (60 ha)', 'aplicacion_biologicos', '2026-02-25 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 3 (22 ha)', 'aplicacion_biologicos', '2026-02-26 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 3 (54 ha)', 'aplicacion_biologicos', '2026-02-27 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 3 (43 ha)', 'aplicacion_biologicos', '2026-02-28 08:00:00', 344, 'alta', 'programada', 43),

-- ===== MARZO 2026 =====
-- Saltamos domingo 1 marzo
('Aplicación Preventiva Biológicos - Bloque 6 Parte 3 (38 ha)', 'aplicacion_biologicos', '2026-03-02 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 3 (30 ha)', 'aplicacion_biologicos', '2026-03-03 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 3 (23 ha)', 'aplicacion_biologicos', '2026-03-04 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 4 (15 ha)', 'aplicacion_biologicos', '2026-03-05 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 4 (28 ha)', 'aplicacion_biologicos', '2026-03-06 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 4 (60 ha)', 'aplicacion_biologicos', '2026-03-07 08:00:00', 480, 'alta', 'programada', 60),

-- Saltamos domingo 8
('Aplicación Preventiva Biológicos - Bloque 3 Parte 4 (22 ha)', 'aplicacion_biologicos', '2026-03-09 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 4 (54 ha)', 'aplicacion_biologicos', '2026-03-10 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 4 (43 ha)', 'aplicacion_biologicos', '2026-03-11 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 4 (38 ha)', 'aplicacion_biologicos', '2026-03-12 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 4 (30 ha)', 'aplicacion_biologicos', '2026-03-13 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 4 (23 ha)', 'aplicacion_biologicos', '2026-03-14 08:00:00', 184, 'alta', 'programada', 23),

-- Saltamos domingo 15
('Aplicación Preventiva Biológicos - Bloque 11 Parte 5 (15 ha)', 'aplicacion_biologicos', '2026-03-16 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 5 (28 ha)', 'aplicacion_biologicos', '2026-03-17 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 5 (60 ha)', 'aplicacion_biologicos', '2026-03-18 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 5 (22 ha)', 'aplicacion_biologicos', '2026-03-19 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 5 (54 ha)', 'aplicacion_biologicos', '2026-03-20 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 5 (43 ha)', 'aplicacion_biologicos', '2026-03-21 08:00:00', 344, 'alta', 'programada', 43),

-- Saltamos domingo 22
('Aplicación Preventiva Biológicos - Bloque 6 Parte 5 (38 ha)', 'aplicacion_biologicos', '2026-03-23 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 5 (30 ha)', 'aplicacion_biologicos', '2026-03-24 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 5 (23 ha)', 'aplicacion_biologicos', '2026-03-25 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 6 (15 ha)', 'aplicacion_biologicos', '2026-03-26 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 6 (28 ha)', 'aplicacion_biologicos', '2026-03-27 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 6 (60 ha)', 'aplicacion_biologicos', '2026-03-28 08:00:00', 480, 'alta', 'programada', 60),

-- Saltamos domingo 29
('Aplicación Preventiva Biológicos - Bloque 3 Parte 6 (22 ha)', 'aplicacion_biologicos', '2026-03-30 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 6 (54 ha)', 'aplicacion_biologicos', '2026-03-31 08:00:00', 432, 'alta', 'programada', 54),

-- ===== CICLO 2: Mayo-Junio 2026 =====
-- ===== MAYO 2026 =====
('Aplicación Preventiva Biológicos - Bloque 11 Parte 1 (15 ha)', 'aplicacion_biologicos', '2026-05-01 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 1 (28 ha)', 'aplicacion_biologicos', '2026-05-02 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 1 (60 ha)', 'aplicacion_biologicos', '2026-05-03 08:00:00', 480, 'alta', 'programada', 60),

-- Saltamos domingo 4
('Aplicación Preventiva Biológicos - Bloque 3 Parte 1 (22 ha)', 'aplicacion_biologicos', '2026-05-05 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 1 (54 ha)', 'aplicacion_biologicos', '2026-05-06 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 1 (43 ha)', 'aplicacion_biologicos', '2026-05-07 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 1 (38 ha)', 'aplicacion_biologicos', '2026-05-08 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 1 (30 ha)', 'aplicacion_biologicos', '2026-05-09 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 1 (23 ha)', 'aplicacion_biologicos', '2026-05-10 08:00:00', 184, 'alta', 'programada', 23),

-- Saltamos domingo 11
('Aplicación Preventiva Biológicos - Bloque 11 Parte 2 (15 ha)', 'aplicacion_biologicos', '2026-05-12 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 2 (28 ha)', 'aplicacion_biologicos', '2026-05-13 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 2 (60 ha)', 'aplicacion_biologicos', '2026-05-14 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 2 (22 ha)', 'aplicacion_biologicos', '2026-05-15 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 2 (54 ha)', 'aplicacion_biologicos', '2026-05-16 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 2 (43 ha)', 'aplicacion_biologicos', '2026-05-17 08:00:00', 344, 'alta', 'programada', 43),

-- Saltamos domingo 18
('Aplicación Preventiva Biológicos - Bloque 6 Parte 2 (38 ha)', 'aplicacion_biologicos', '2026-05-19 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 2 (30 ha)', 'aplicacion_biologicos', '2026-05-20 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 2 (23 ha)', 'aplicacion_biologicos', '2026-05-21 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 3 (15 ha)', 'aplicacion_biologicos', '2026-05-22 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 3 (28 ha)', 'aplicacion_biologicos', '2026-05-23 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 3 (60 ha)', 'aplicacion_biologicos', '2026-05-24 08:00:00', 480, 'alta', 'programada', 60),

-- Saltamos domingo 25
('Aplicación Preventiva Biológicos - Bloque 3 Parte 3 (22 ha)', 'aplicacion_biologicos', '2026-05-26 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 3 (54 ha)', 'aplicacion_biologicos', '2026-05-27 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 3 (43 ha)', 'aplicacion_biologicos', '2026-05-28 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 3 (38 ha)', 'aplicacion_biologicos', '2026-05-29 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 3 (30 ha)', 'aplicacion_biologicos', '2026-05-30 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 3 (23 ha)', 'aplicacion_biologicos', '2026-05-31 08:00:00', 184, 'alta', 'programada', 23),

-- ===== JUNIO 2026 =====
-- Saltamos domingo 1 junio
('Aplicación Preventiva Biológicos - Bloque 11 Parte 4 (15 ha)', 'aplicacion_biologicos', '2026-06-02 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 4 (28 ha)', 'aplicacion_biologicos', '2026-06-03 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 4 (60 ha)', 'aplicacion_biologicos', '2026-06-04 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 4 (22 ha)', 'aplicacion_biologicos', '2026-06-05 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 4 (54 ha)', 'aplicacion_biologicos', '2026-06-06 08:00:00', 432, 'alta', 'programada', 54),

-- Saltamos domingo 7
('Aplicación Preventiva Biológicos - Bloque 5 Parte 4 (43 ha)', 'aplicacion_biologicos', '2026-06-08 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 4 (38 ha)', 'aplicacion_biologicos', '2026-06-09 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 4 (30 ha)', 'aplicacion_biologicos', '2026-06-10 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 4 (23 ha)', 'aplicacion_biologicos', '2026-06-11 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 5 (15 ha)', 'aplicacion_biologicos', '2026-06-12 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 5 (28 ha)', 'aplicacion_biologicos', '2026-06-13 08:00:00', 224, 'alta', 'programada', 28),

-- Saltamos domingo 14
('Aplicación Preventiva Biológicos - Bloque 2 Parte 5 (60 ha)', 'aplicacion_biologicos', '2026-06-15 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 5 (22 ha)', 'aplicacion_biologicos', '2026-06-16 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 5 (54 ha)', 'aplicacion_biologicos', '2026-06-17 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 5 (43 ha)', 'aplicacion_biologicos', '2026-06-18 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 5 (38 ha)', 'aplicacion_biologicos', '2026-06-19 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 5 (30 ha)', 'aplicacion_biologicos', '2026-06-20 08:00:00', 240, 'alta', 'programada', 30),

-- Saltamos domingo 21
('Aplicación Preventiva Biológicos - Bloque 90 Parte 5 (23 ha)', 'aplicacion_biologicos', '2026-06-22 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 6 (15 ha)', 'aplicacion_biologicos', '2026-06-23 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 6 (28 ha)', 'aplicacion_biologicos', '2026-06-24 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 6 (60 ha)', 'aplicacion_biologicos', '2026-06-25 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 6 (22 ha)', 'aplicacion_biologicos', '2026-06-26 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 6 (54 ha)', 'aplicacion_biologicos', '2026-06-27 08:00:00', 432, 'alta', 'programada', 54),

-- Saltamos domingo 28
('Aplicación Preventiva Biológicos - Bloque 5 Parte 6 (43 ha)', 'aplicacion_biologicos', '2026-06-29 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 6 (38 ha)', 'aplicacion_biologicos', '2026-06-30 08:00:00', 304, 'alta', 'programada', 38),

-- ===== CICLO 3: Agosto-Septiembre 2026 =====
-- ===== AGOSTO 2026 =====
('Aplicación Preventiva Biológicos - Bloque 11 Parte 1 (15 ha)', 'aplicacion_biologicos', '2026-08-01 08:00:00', 120, 'alta', 'programada', 15),

-- Saltamos domingo 2
('Aplicación Preventiva Biológicos - Bloque 9 Parte 1 (28 ha)', 'aplicacion_biologicos', '2026-08-03 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 1 (60 ha)', 'aplicacion_biologicos', '2026-08-04 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 1 (22 ha)', 'aplicacion_biologicos', '2026-08-05 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 1 (54 ha)', 'aplicacion_biologicos', '2026-08-06 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 1 (43 ha)', 'aplicacion_biologicos', '2026-08-07 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 1 (38 ha)', 'aplicacion_biologicos', '2026-08-08 08:00:00', 304, 'alta', 'programada', 38),

-- Saltamos domingo 9
('Aplicación Preventiva Biológicos - Bloque 7 Parte 1 (30 ha)', 'aplicacion_biologicos', '2026-08-10 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 1 (23 ha)', 'aplicacion_biologicos', '2026-08-11 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 2 (15 ha)', 'aplicacion_biologicos', '2026-08-12 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 2 (28 ha)', 'aplicacion_biologicos', '2026-08-13 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 2 (60 ha)', 'aplicacion_biologicos', '2026-08-14 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 2 (22 ha)', 'aplicacion_biologicos', '2026-08-15 08:00:00', 176, 'alta', 'programada', 22),

-- Saltamos domingo 16
('Aplicación Preventiva Biológicos - Bloque 4 Parte 2 (54 ha)', 'aplicacion_biologicos', '2026-08-17 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 2 (43 ha)', 'aplicacion_biologicos', '2026-08-18 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 2 (38 ha)', 'aplicacion_biologicos', '2026-08-19 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 2 (30 ha)', 'aplicacion_biologicos', '2026-08-20 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 2 (23 ha)', 'aplicacion_biologicos', '2026-08-21 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 3 (15 ha)', 'aplicacion_biologicos', '2026-08-22 08:00:00', 120, 'alta', 'programada', 15),

-- Saltamos domingo 23
('Aplicación Preventiva Biológicos - Bloque 9 Parte 3 (28 ha)', 'aplicacion_biologicos', '2026-08-24 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 3 (60 ha)', 'aplicacion_biologicos', '2026-08-25 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 3 (22 ha)', 'aplicacion_biologicos', '2026-08-26 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 3 (54 ha)', 'aplicacion_biologicos', '2026-08-27 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 3 (43 ha)', 'aplicacion_biologicos', '2026-08-28 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 3 (38 ha)', 'aplicacion_biologicos', '2026-08-29 08:00:00', 304, 'alta', 'programada', 38),

-- Saltamos domingo 30
('Aplicación Preventiva Biológicos - Bloque 7 Parte 3 (30 ha)', 'aplicacion_biologicos', '2026-08-31 08:00:00', 240, 'alta', 'programada', 30),

-- ===== SEPTIEMBRE 2026 =====
('Aplicación Preventiva Biológicos - Bloque 90 Parte 3 (23 ha)', 'aplicacion_biologicos', '2026-09-01 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 4 (15 ha)', 'aplicacion_biologicos', '2026-09-02 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 4 (28 ha)', 'aplicacion_biologicos', '2026-09-03 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 4 (60 ha)', 'aplicacion_biologicos', '2026-09-04 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 4 (22 ha)', 'aplicacion_biologicos', '2026-09-05 08:00:00', 176, 'alta', 'programada', 22),

-- Saltamos domingo 6
('Aplicación Preventiva Biológicos - Bloque 4 Parte 4 (54 ha)', 'aplicacion_biologicos', '2026-09-07 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 4 (43 ha)', 'aplicacion_biologicos', '2026-09-08 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 4 (38 ha)', 'aplicacion_biologicos', '2026-09-09 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 4 (30 ha)', 'aplicacion_biologicos', '2026-09-10 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 4 (23 ha)', 'aplicacion_biologicos', '2026-09-11 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 5 (15 ha)', 'aplicacion_biologicos', '2026-09-12 08:00:00', 120, 'alta', 'programada', 15),

-- Saltamos domingo 13
('Aplicación Preventiva Biológicos - Bloque 9 Parte 5 (28 ha)', 'aplicacion_biologicos', '2026-09-14 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 5 (60 ha)', 'aplicacion_biologicos', '2026-09-15 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 5 (22 ha)', 'aplicacion_biologicos', '2026-09-16 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 5 (54 ha)', 'aplicacion_biologicos', '2026-09-17 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 5 (43 ha)', 'aplicacion_biologicos', '2026-09-18 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 5 (38 ha)', 'aplicacion_biologicos', '2026-09-19 08:00:00', 304, 'alta', 'programada', 38),

-- Saltamos domingo 20
('Aplicación Preventiva Biológicos - Bloque 7 Parte 5 (30 ha)', 'aplicacion_biologicos', '2026-09-21 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 5 (23 ha)', 'aplicacion_biologicos', '2026-09-22 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 6 (15 ha)', 'aplicacion_biologicos', '2026-09-23 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 6 (28 ha)', 'aplicacion_biologicos', '2026-09-24 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 6 (60 ha)', 'aplicacion_biologicos', '2026-09-25 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 6 (22 ha)', 'aplicacion_biologicos', '2026-09-26 08:00:00', 176, 'alta', 'programada', 22),

-- Saltamos domingo 27
('Aplicación Preventiva Biológicos - Bloque 4 Parte 6 (54 ha)', 'aplicacion_biologicos', '2026-09-28 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 6 (43 ha)', 'aplicacion_biologicos', '2026-09-29 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 6 (38 ha)', 'aplicacion_biologicos', '2026-09-30 08:00:00', 304, 'alta', 'programada', 38),

-- ===== CICLO 4: Noviembre-Diciembre 2026 =====
-- ===== NOVIEMBRE 2026 =====
-- Domingo 1 noviembre - EMPEZAMOS LUNES 2
('Aplicación Preventiva Biológicos - Bloque 11 Parte 1 (15 ha)', 'aplicacion_biologicos', '2026-11-02 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 1 (28 ha)', 'aplicacion_biologicos', '2026-11-03 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 1 (60 ha)', 'aplicacion_biologicos', '2026-11-04 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 1 (22 ha)', 'aplicacion_biologicos', '2026-11-05 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 1 (54 ha)', 'aplicacion_biologicos', '2026-11-06 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 1 (43 ha)', 'aplicacion_biologicos', '2026-11-07 08:00:00', 344, 'alta', 'programada', 43),

-- Saltamos domingo 8
('Aplicación Preventiva Biológicos - Bloque 6 Parte 1 (38 ha)', 'aplicacion_biologicos', '2026-11-09 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 1 (30 ha)', 'aplicacion_biologicos', '2026-11-10 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 1 (23 ha)', 'aplicacion_biologicos', '2026-11-11 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 2 (15 ha)', 'aplicacion_biologicos', '2026-11-12 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 2 (28 ha)', 'aplicacion_biologicos', '2026-11-13 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 2 (60 ha)', 'aplicacion_biologicos', '2026-11-14 08:00:00', 480, 'alta', 'programada', 60),

-- Saltamos domingo 15
('Aplicación Preventiva Biológicos - Bloque 3 Parte 2 (22 ha)', 'aplicacion_biologicos', '2026-11-16 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 2 (54 ha)', 'aplicacion_biologicos', '2026-11-17 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 2 (43 ha)', 'aplicacion_biologicos', '2026-11-18 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 2 (38 ha)', 'aplicacion_biologicos', '2026-11-19 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 2 (30 ha)', 'aplicacion_biologicos', '2026-11-20 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 2 (23 ha)', 'aplicacion_biologicos', '2026-11-21 08:00:00', 184, 'alta', 'programada', 23),

-- Saltamos domingo 22
('Aplicación Preventiva Biológicos - Bloque 11 Parte 3 (15 ha)', 'aplicacion_biologicos', '2026-11-23 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 3 (28 ha)', 'aplicacion_biologicos', '2026-11-24 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 3 (60 ha)', 'aplicacion_biologicos', '2026-11-25 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 3 (22 ha)', 'aplicacion_biologicos', '2026-11-26 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 3 (54 ha)', 'aplicacion_biologicos', '2026-11-27 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 3 (43 ha)', 'aplicacion_biologicos', '2026-11-28 08:00:00', 344, 'alta', 'programada', 43),

-- Saltamos domingo 29
('Aplicación Preventiva Biológicos - Bloque 6 Parte 3 (38 ha)', 'aplicacion_biologicos', '2026-11-30 08:00:00', 304, 'alta', 'programada', 38),

-- ===== DICIEMBRE 2026 =====
('Aplicación Preventiva Biológicos - Bloque 7 Parte 3 (30 ha)', 'aplicacion_biologicos', '2026-12-01 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 3 (23 ha)', 'aplicacion_biologicos', '2026-12-02 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 4 (15 ha)', 'aplicacion_biologicos', '2026-12-03 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 4 (28 ha)', 'aplicacion_biologicos', '2026-12-04 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 4 (60 ha)', 'aplicacion_biologicos', '2026-12-05 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 4 (22 ha)', 'aplicacion_biologicos', '2026-12-06 08:00:00', 176, 'alta', 'programada', 22),

-- Saltamos domingo 7
('Aplicación Preventiva Biológicos - Bloque 4 Parte 4 (54 ha)', 'aplicacion_biologicos', '2026-12-08 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 4 (43 ha)', 'aplicacion_biologicos', '2026-12-09 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 4 (38 ha)', 'aplicacion_biologicos', '2026-12-10 08:00:00', 304, 'alta', 'programada', 38),
('Aplicación Preventiva Biológicos - Bloque 7 Parte 4 (30 ha)', 'aplicacion_biologicos', '2026-12-11 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 4 (23 ha)', 'aplicacion_biologicos', '2026-12-12 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 5 (15 ha)', 'aplicacion_biologicos', '2026-12-13 08:00:00', 120, 'alta', 'programada', 15),

-- Saltamos domingo 14
('Aplicación Preventiva Biológicos - Bloque 9 Parte 5 (28 ha)', 'aplicacion_biologicos', '2026-12-15 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 5 (60 ha)', 'aplicacion_biologicos', '2026-12-16 08:00:00', 480, 'alta', 'programada', 60),
('Aplicación Preventiva Biológicos - Bloque 3 Parte 5 (22 ha)', 'aplicacion_biologicos', '2026-12-17 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 5 (54 ha)', 'aplicacion_biologicos', '2026-12-18 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 5 (43 ha)', 'aplicacion_biologicos', '2026-12-19 08:00:00', 344, 'alta', 'programada', 43),
('Aplicación Preventiva Biológicos - Bloque 6 Parte 5 (38 ha)', 'aplicacion_biologicos', '2026-12-20 08:00:00', 304, 'alta', 'programada', 38),

-- Saltamos domingo 21
('Aplicación Preventiva Biológicos - Bloque 7 Parte 5 (30 ha)', 'aplicacion_biologicos', '2026-12-22 08:00:00', 240, 'alta', 'programada', 30),
('Aplicación Preventiva Biológicos - Bloque 90 Parte 5 (23 ha)', 'aplicacion_biologicos', '2026-12-23 08:00:00', 184, 'alta', 'programada', 23),
('Aplicación Preventiva Biológicos - Bloque 11 Parte 6 (15 ha)', 'aplicacion_biologicos', '2026-12-24 08:00:00', 120, 'alta', 'programada', 15),
('Aplicación Preventiva Biológicos - Bloque 9 Parte 6 (28 ha)', 'aplicacion_biologicos', '2026-12-26 08:00:00', 224, 'alta', 'programada', 28),
('Aplicación Preventiva Biológicos - Bloque 2 Parte 6 (60 ha)', 'aplicacion_biologicos', '2026-12-27 08:00:00', 480, 'alta', 'programada', 60),

-- Saltamos domingo 28
('Aplicación Preventiva Biológicos - Bloque 3 Parte 6 (22 ha)', 'aplicacion_biologicos', '2026-12-29 08:00:00', 176, 'alta', 'programada', 22),
('Aplicación Preventiva Biológicos - Bloque 4 Parte 6 (54 ha)', 'aplicacion_biologicos', '2026-12-30 08:00:00', 432, 'alta', 'programada', 54),
('Aplicación Preventiva Biológicos - Bloque 5 Parte 6 (43 ha)', 'aplicacion_biologicos', '2026-12-31 08:00:00', 344, 'alta', 'programada', 43);

-- Verificar que las actividades se insertaron correctamente y comienzan en días laborales
SELECT 
  name, 
  scheduled_date, 
  EXTRACT(DOW FROM scheduled_date) as dia_semana, -- 0=Domingo, 1=Lunes, 6=Sábado
  CASE EXTRACT(DOW FROM scheduled_date)
    WHEN 0 THEN 'DOMINGO ⚠️'
    WHEN 1 THEN 'Lunes ✅'
    WHEN 2 THEN 'Martes ✅'
    WHEN 3 THEN 'Miércoles ✅'
    WHEN 4 THEN 'Jueves ✅'
    WHEN 5 THEN 'Viernes ✅'
    WHEN 6 THEN 'Sábado ✅'
  END as nombre_dia,
  planned_hectares,
  status
FROM activities 
WHERE scheduled_date >= '2026-02-01' 
AND scheduled_date < '2026-04-01'
ORDER BY scheduled_date
LIMIT 20;

-- Estadísticas por ciclo
SELECT 
  CASE 
    WHEN EXTRACT(MONTH FROM scheduled_date) IN (2, 3) THEN 'Ciclo 1: Feb-Mar'
    WHEN EXTRACT(MONTH FROM scheduled_date) IN (5, 6) THEN 'Ciclo 2: May-Jun'
    WHEN EXTRACT(MONTH FROM scheduled_date) IN (8, 9) THEN 'Ciclo 3: Aug-Sep'
    WHEN EXTRACT(MONTH FROM scheduled_date) IN (11, 12) THEN 'Ciclo 4: Nov-Dec'
  END as ciclo,
  COUNT(*) as total_actividades,
  SUM(planned_hectares) as hectares_totales,
  MIN(scheduled_date) as fecha_inicio,
  MAX(scheduled_date) as fecha_fin
FROM activities 
WHERE scheduled_date >= '2026-01-01' 
AND scheduled_date < '2027-01-01'
GROUP BY 
  CASE 
    WHEN EXTRACT(MONTH FROM scheduled_date) IN (2, 3) THEN 'Ciclo 1: Feb-Mar'
    WHEN EXTRACT(MONTH FROM scheduled_date) IN (5, 6) THEN 'Ciclo 2: May-Jun'
    WHEN EXTRACT(MONTH FROM scheduled_date) IN (8, 9) THEN 'Ciclo 3: Aug-Sep'
    WHEN EXTRACT(MONTH FROM scheduled_date) IN (11, 12) THEN 'Ciclo 4: Nov-Dec'
  END
ORDER BY MIN(scheduled_date);

-- Verificar que NO hay actividades en domingos
SELECT 
  COUNT(*) as actividades_en_domingo
FROM activities 
WHERE scheduled_date >= '2026-01-01' 
AND scheduled_date < '2027-01-01'
AND EXTRACT(DOW FROM scheduled_date) = 0; -- Debería ser 0

-- Contar actividades por bloque
SELECT 
  CASE 
    WHEN name LIKE '%Bloque 11%' THEN 'Bloque 11'
    WHEN name LIKE '%Bloque 90%' THEN 'Bloque 90'
    WHEN name LIKE '%Bloque 9%' THEN 'Bloque 9'
    WHEN name LIKE '%Bloque 2%' THEN 'Bloque 2'
    WHEN name LIKE '%Bloque 3%' THEN 'Bloque 3'
    WHEN name LIKE '%Bloque 4%' THEN 'Bloque 4'
    WHEN name LIKE '%Bloque 5%' THEN 'Bloque 5'
    WHEN name LIKE '%Bloque 6%' THEN 'Bloque 6'
    WHEN name LIKE '%Bloque 7%' THEN 'Bloque 7'
  END as bloque,
  COUNT(*) as actividades,
  SUM(planned_hectares) as hectares_totales
FROM activities 
WHERE scheduled_date >= '2026-01-01' 
AND scheduled_date < '2027-01-01'
GROUP BY 
  CASE 
    WHEN name LIKE '%Bloque 11%' THEN 'Bloque 11'
    WHEN name LIKE '%Bloque 90%' THEN 'Bloque 90'
    WHEN name LIKE '%Bloque 9%' THEN 'Bloque 9'
    WHEN name LIKE '%Bloque 2%' THEN 'Bloque 2'
    WHEN name LIKE '%Bloque 3%' THEN 'Bloque 3'
    WHEN name LIKE '%Bloque 4%' THEN 'Bloque 4'
    WHEN name LIKE '%Bloque 5%' THEN 'Bloque 5'
    WHEN name LIKE '%Bloque 6%' THEN 'Bloque 6'
    WHEN name LIKE '%Bloque 7%' THEN 'Bloque 7'
  END
ORDER BY hectares_totales DESC;
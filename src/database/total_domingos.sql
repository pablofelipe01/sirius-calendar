-- ========================================
-- CONSULTAS DE VERIFICACIÓN (Ejecutar después)
-- ========================================

-- 1. Verificar que NO hay actividades en domingo
SELECT 
    COUNT(*) as total_domingos,
    CASE 
        WHEN COUNT(*) > 0 THEN 'ERROR: Hay actividades programadas en domingo'
        ELSE 'OK: No hay actividades en domingo'
    END as mensaje
FROM activities 
WHERE EXTRACT(DOW FROM scheduled_date) = 0;

-- 2. Resumen por ciclo
SELECT 
    CASE 
        WHEN EXTRACT(MONTH FROM scheduled_date) IN (2,3) THEN 'CICLO 1'
        WHEN EXTRACT(MONTH FROM scheduled_date) IN (5,6) THEN 'CICLO 2'
        WHEN EXTRACT(MONTH FROM scheduled_date) IN (8,9) THEN 'CICLO 3'
        WHEN EXTRACT(MONTH FROM scheduled_date) IN (11,12) THEN 'CICLO 4'
    END as ciclo,
    COUNT(*) as total_actividades,
    MIN(DATE(scheduled_date)) as fecha_inicio,
    MAX(DATE(scheduled_date)) as fecha_fin
FROM activities 
WHERE EXTRACT(YEAR FROM scheduled_date) = 2026
GROUP BY ciclo
ORDER BY ciclo;

-- 3. Verificar primeras 20 actividades
SELECT 
    ROW_NUMBER() OVER (ORDER BY scheduled_date) as orden,
    DATE(scheduled_date) as fecha,
    TO_CHAR(scheduled_date, 'Day') as dia_semana,
    name
FROM activities 
WHERE EXTRACT(YEAR FROM scheduled_date) = 2026
ORDER BY scheduled_date
LIMIT 20;
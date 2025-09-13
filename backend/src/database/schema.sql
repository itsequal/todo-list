CREATE DATABASE IF NOT EXISTS gestion_tareas;
USE gestion_tareas;
-- Tabla para almacenar las tareas

CREATE TABLE tareas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'en progreso', 'completada')),
    fecha_vencimiento DATE NOT NULL,
    prioridad INT(12)
);

-- Ejemplo de inserción de datos:
-- INSERT INTO tareas (titulo,descripcion,estado,fecha_vencimiento,prioridad) VALUES ('Comprar víveres','Comprar leche, pan y huevos','pendiente','2024-07-01',2);


-- Representación en JSON:
-- {
--   (ID automatico, no entra en el JSON)"id": 1,
--   "titulo": "Comprar víveres",
--   "descripcion": "Comprar leche, pan y huevos",
--   "estado": "pendiente",
--   "fecha_vencimiento": "2024-07-01",
--   "prioridad": 2
-- }


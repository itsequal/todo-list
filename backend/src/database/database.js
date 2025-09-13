import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


async function getTareas() {
    try{
         const rows = await pool.query("SELECT * FROM tareas");
         return rows;
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        throw error;
    }
}

async function getTarea(id){
    const rows = await pool.query("SELECT * FROM tareas WHERE id = ?", [id]);
    if (rows.length === 0) {
        throw new Error(`Tarea with id ${id} not found`);
    }
    return rows;
}

async function getTareaByEstado(estado) {
    const rows = await pool.query("SELECT * FROM tareas WHERE estado = ?", [estado]);
    return rows;
}

async function getTareaByTitulo(titulo) {
    const rows = await pool.query("SELECT * FROM tareas WHERE titulo = ?", [titulo]);
    if (rows.length === 0) {
        throw new Error(`Tarea with titulo ${titulo} not found`);
    }
    return rows;
}

async function createTarea(titulo, descripcion, estado, fecha_vencimiento, prioridad) {
    const query = "INSERT INTO tareas (titulo, descripcion, estado, fecha_vencimiento, prioridad) VALUES (?, ?, ?, ?, ?)";
    const result = await pool.query(query, [titulo, descripcion, estado, fecha_vencimiento, prioridad]);
    const id = result.insertId;
    return getTarea(id);
}

async function updateTarea(id, titulo, descripcion, estado, fecha_vencimiento, prioridad) {
    const query = "UPDATE tareas SET titulo = ?, descripcion = ?, estado = ?, fecha_vencimiento = ?, prioridad = ? WHERE id = ?";
    await pool.query(query, [titulo, descripcion, estado, fecha_vencimiento, prioridad, id]);
    return getTarea(id);
}

async function deleteTarea(id) {
    const query = "DELETE FROM tareas WHERE id = ?";
    const result = await pool.query(query, [id]);
    if (result.affectedRows === 0) {
        throw new Error(`Tarea with id ${id} not found`);
    }
    return { message: `Tarea with id ${id} deleted successfully` };
}

export { getTareas, getTarea, createTarea, updateTarea, deleteTarea, getTareaByEstado, getTareaByTitulo };
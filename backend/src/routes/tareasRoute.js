import express from 'express';
import { getTareas, getTarea, createTarea, updateTarea, deleteTarea, getTareaByEstado, getTareaByTitulo } from '../database/database.js';
const router = express.Router();

router.get('/api/', (req, res) => {
  res.status(200).send({ msg: 'Tareas endpoint is working!' });
});

router.get('/api/tareas', async (req, res) => {
  try {
    const tareas = await getTareas();
    res.status(200).send(tareas);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/api/tareas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tarea = await getTarea(id);
    res.status(200).send(tarea);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.get('/api/tareas/estado/:estado', async (req, res) => {
  const { estado } = req.params;
  if (!['pendiente', 'en progreso', 'completada'].includes(estado)) {
    return res.status(404).send({ error: 'Estado inválido' });
  }
  try {
    const tareas = await getTareaByEstado(estado);
    res.status(200).send(tareas);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.get('/api/tareas/titulo/:titulo', async (req, res) => {
    const { titulo } = req.params;
    if (!titulo) {
        return res.status(400).send({ error: 'Título es requerido' });
    }
  try {
    const tareas = await getTareaByTitulo(titulo);
    res.status(200).send(tareas);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.post('/api/tareas', async (req, res) => {
     if (!req.body.titulo || !req.body.descripcion || !req.body.estado || !req.body.fecha_vencimiento || !req.body.prioridad) {
         return res.status(400).send({ error: 'Faltan datos requeridos' , data: req.body });
     }
    console.log(req.body);
    const { titulo, descripcion, estado, fecha_vencimiento, prioridad } = req.body;
  try {
    const nuevaTarea = await createTarea(titulo, descripcion, estado, fecha_vencimiento, prioridad);
    res.status(201).send(nuevaTarea);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put('/api/tareas/:id', async (req, res) => {
    if (!req.body.titulo || !req.body.descripcion || !req.body.estado || !req.body.fecha_vencimiento || !req.body.prioridad) {
        return res.status(400).send({ error: 'Faltan datos requeridos' });
    }
  const { id } = req.params;
  const { titulo, descripcion, estado, fecha_vencimiento, prioridad } = req.body;
  try {
    const tareaActualizada = await updateTarea(id, titulo, descripcion, estado, fecha_vencimiento, prioridad);
    res.status(200).send(tareaActualizada);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.delete('/api/tareas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await deleteTarea(id);
    res.status(204).send(resultado);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});



export default router;

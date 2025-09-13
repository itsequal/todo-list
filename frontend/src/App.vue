<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import Modal from './components/Modal.vue'

const showModal = ref(false)
const mostrarFiltros = ref(false)

// Llamada a la API para obtener las tareas

import axios from 'axios'

const input_titulo = ref<string>('')
const input_descripcion = ref<string>('')
const input_estado = ref<'pendiente' | 'en progreso' | 'completada'>('pendiente')
const input_fecha = ref<string>('')
const input_prioridad = ref<number>(1)

// Filtros
const filtroNombre = ref<string>('')
const filtroEstado = ref<string>('')

interface Tarea {
  id?: number
  titulo: string
  descripcion: string
  estado: 'pendiente' | 'en progreso' | 'completada'
  fecha_vencimiento: Date
  prioridad: number
  editando?: boolean
}

const tareas = ref<Tarea[]>([])

const tareaSend = ref<Tarea>({
  titulo: '',
  descripcion: '',
  estado: 'pendiente',
  fecha_vencimiento: new Date(),
  prioridad: 1,
  editando: false,
})

const updateTareas = async () => {
  axios.defaults.baseURL = 'http://localhost:3000/api/tareas'
  try {
    const response = await axios.get('/')
    tareas.value = response.data
  } catch (error) {
    console.error('Error al solicitar tareas:', error)
  }
}

const addTodo = async () => {
  try {
    tareaSend.value = {
      titulo: input_titulo.value,
      descripcion: input_descripcion.value,
      estado: input_estado.value,
      fecha_vencimiento: new Date(input_fecha.value),
      prioridad: input_prioridad.value,
      editando: false,
    }
    const response = await axios.post('/', tareaSend.value)
    console.log('Tarea agregada:', response.data)
    updateTareas()
  } catch (error) {
    console.error('Error al agregar tarea:', error)
    console.log('Tarea enviada:', tareaSend.value)
  }
}

const deleteTodo = (index: number) => {
  try {
    axios.delete(`/${tareas.value[index].id}`)
    console.log('Tarea eliminada:', tareas.value[index].id)
  } catch (error) {
    console.error('Error al eliminar la tarea:', error)
    return
  }
  tareas.value.splice(index, 1)
}
const editTodo = async (index: number, updatedFields: Partial<Tarea>) => {
  const tarea = tareas.value[index]
  if (!tarea.id) {
    console.error('No se puede editar una tarea sin ID')
    console.log('Tarea a editar:', tarea)
    return
  }
  try {
    const response = await axios.put(`/${tarea.id}`, { ...tarea, ...updatedFields })
    tareas.value[index] = response.data
    console.log('Tarea actualizada:', response.data)
    updateTareas()
  } catch (error) {
    console.error('Error al actualizar la tarea:', error)
  }
}
// Computed para filtrar tareas
const tareasFiltradas = computed(() => {
  return tareas.value.filter((tarea) => {
    const coincideNombre =
      filtroNombre.value === '' ||
      tarea.titulo.toLowerCase().includes(filtroNombre.value.toLowerCase())
    const coincideEstado = filtroEstado.value === '' || tarea.estado === filtroEstado.value
    return coincideNombre && coincideEstado
  })
})

// Función para limpiar filtros
const limpiarFiltros = () => {
  filtroNombre.value = ''
  filtroEstado.value = ''
}

// Cargar tareas al abrir la página
onMounted(async () => {
  updateTareas()
})
// Cargar tareas al abrir la página
onMounted(async () => {
  updateTareas()
})
</script>

<template>
  <section class="saludo">
    <h2>Hola, listo para crear tareas?</h2>
  </section>

  <section class="tareas">
    <h3>Crear Tarea:</h3>
    <form @submit.prevent="addTodo">
      <h4>Que deseas hacer?</h4>
      <input type="text" required placeholder="Escribe una tarea" v-model="input_titulo" />
      <h4>Agrega una descripcion</h4>
      <input type="text" placeholder="Escribe una descripcion" v-model="input_descripcion" />
      <h4>Fecha de vencimiento</h4>
      <input type="date" required onkeydown="return false" v-model="input_fecha" />
      <h4>Del 1 al 10 cual es la prioridad de tu tarea?</h4>
      <input
        type="number"
        min="1"
        max="10"
        v-model="input_prioridad"
        @keydown.prevent
        @keydown.up.stop
        @keydown.down.stop
      />
      <button type="submit" value="agregar">Agregar</button>
    </form>
  </section>

  <section class="tareas_pendientes">
    <h2>Tareas:</h2>

    <div class="dropdown-filtros">
      <button class="btn-toggle" @click="mostrarFiltros = !mostrarFiltros">
        {{ mostrarFiltros ? 'Ocultar filtros ▲' : 'Mostrar filtros ▼' }}
      </button>

      <div v-show="mostrarFiltros" class="filter-section">
        <h3>Filtrar Tareas:</h3>
        <div class="filter-controls">
          <div>
            <label for="filter-name">Buscar por nombre:</label>
            <input
              id="filter-name"
              type="text"
              v-model="filtroNombre"
              placeholder="Escribe el nombre de la tarea"
            />
          </div>
          <div>
            <label for="filter-status">Filtrar por estado:</label>
            <select id="filter-status" v-model="filtroEstado">
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>
          <button @click="limpiarFiltros" class="btn-clear">Limpiar filtros</button>
        </div>
      </div>
    </div>

    <div class="grid-tareas">
      <div v-for="(tarea, index) in tareasFiltradas" :key="tarea.id">
        <div
          class="card"
          :class="{
            'prioridad-alta': tarea.prioridad >= 8,
            'prioridad-media': tarea.prioridad >= 5 && tarea.prioridad < 8,
            'prioridad-baja': tarea.prioridad < 5,
          }"
        >
          <span
            class="badge-prioridad"
            :class="{
              'badge-alta': tarea.prioridad >= 8,
              'badge-media': tarea.prioridad >= 5 && tarea.prioridad < 8,
              'badge-baja': tarea.prioridad < 5,
            }"
          >
            Prioridad: {{ tarea.prioridad }}
          </span>

          <h2>{{ tarea.titulo }}</h2>
          <hr />
          <br />
          <p>
            Descripcion: {{ tarea.descripcion }}<br />
            Estado: {{ tarea.estado }}<br />
            Fecha Límite: {{ new Date(tarea.fecha_vencimiento).toLocaleDateString('es-MX') }}<br />
            <br />
          </p>
          <div class="task-actions">
            <button @click="tarea.editando = true">Editar</button>
            <button class="delete" @click="deleteTodo(index)">Eliminar</button>
          </div>
        </div>

        <Modal v-if="tarea.editando" @close="tarea.editando = false">
          <template #header>
            <h2>{{ tarea.titulo }}</h2>
          </template>
          <form @submit.prevent="editTodo(index, tarea)">
            <h4>Titulo</h4>
            <input type="text" v-model="tarea.titulo" /><br />
            <h4>Descripcion</h4>
            <input type="text" v-model="tarea.descripcion" /><br />
            <h4>Fecha de Vencimiento</h4>
            <input type="date" v-model="tarea.fecha_vencimiento" /><br />
            <h4>Estado</h4>
            <select v-model="tarea.estado">
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En progreso</option>
              <option value="completada">Completada</option></select
            ><br />
            <h4>Prioridad</h4>
            <input type="number" min="1" max="11" v-model="tarea.prioridad" />
          </form>
          <template #footer>
            <button @click="editTodo(index, tarea)">Guardar</button>
          </template>
        </Modal>
      </div>
    </div>
  </section>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  line-height: 1.6;
}

.saludo {
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  margin-bottom: 2rem;
}

.saludo h2 {
  font-size: 3rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.saludo::after {
  content: 'Organiza tu día de manera eficiente';
  display: block;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 400;
}

.tareas {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  font-size: 2rem;
}

.tareas h3 {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tareas h3::before {
  content: '+';
  background: #1e293b;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  padding-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.tareas form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: end;
}

.tareas h4 {
  font-size: 1.2rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  grid-column: span 1;
}

.tareas input[type='text'],
.tareas input[type='date'],
.tareas input[type='number'] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.2s ease;
  grid-column: span 1;
}

.tareas input[type='text']:focus,
.tareas input[type='date']:focus,
.tareas input[type='number']:focus {
  outline: none;
  border-color: #64748b;
  box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.1);
}

.tareas input[type='number'] {
  width: 80px;
}

.tareas button[type='submit'] {
  background: #64748b;
  color: white;
  border: none;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  grid-column: span 2;
  justify-self: center;
}

.tareas button[type='submit']:hover {
  background: #475569;
}

.tareas_pendientes {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.tareas_pendientes h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tareas_pendientes h2::before {
  content: '⏰';
  font-size: 2rem;
}

.tareas_pendientes ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tareas_pendientes li {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
}

.container {
  width: 85%;
  margin: 100px auto;
  display: flex;
  justify-content: center;
}

.card {
  width: 325px;
  padding: 25px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card h2 {
  font-size: 1.7rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 1.2rem;
  color: #4b5563;
  margin-bottom: 1rem;
}

.tareas_pendientes button {
  background: none;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1.7rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.tareas_pendientes button:hover {
  background: #f1f5f9;
  border-color: #64748b;
}

.tareas_pendientes button.delete {
  color: #dc2626;
  border-color: #fecaca;
}

.tareas_pendientes button.delete:hover {
  background: #fef2f2;
  border-color: #dc2626;
}

/* Status and Priority Badges */
.tareas_pendientes li[data-status='completada']::before {
  content: 'completada';
  background: #dcfce7;
  color: #166534;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  align-self: flex-start;
  order: -1;
}

.tareas_pendientes li[data-status='en progreso']::before {
  content: 'en progreso';
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  align-self: flex-start;
  order: -1;
}

.tareas_pendientes li[data-status='pendiente']::before {
  content: 'pendiente';
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  align-self: flex-start;
  order: -1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tareas form {
    grid-template-columns: 1fr;
  }

  .tareas h4,
  .tareas input,
  .tareas button {
    grid-column: span 1;
  }

  .tareas button[type='submit'] {
    justify-self: stretch;
  }
}

.task-info {
  flex: 1;
  font-size: 1.4rem;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

/* */

/* Enhanced input styling */
input[type='text'],
input[type='number'],
input[type='date'],
input[type='email'],
input[type='password'],
select,
textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
  outline: none;
  box-sizing: border-box;
}

/* Focus states */
input[type='text']:focus,
input[type='number']:focus,
input[type='date']:focus,
input[type='email']:focus,
input[type='password']:focus,
select:focus,
textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background-color: #fefefe;
}

/* Hover states */
input[type='text']:hover,
input[type='number']:hover,
input[type='date']:hover,
input[type='email']:hover,
input[type='password']:hover,
select:hover,
textarea:hover {
  border-color: #cbd5e1;
}

/* Disabled states */
input[type='text']:disabled,
input[type='number']:disabled,
input[type='date']:disabled,
input[type='email']:disabled,
input[type='password']:disabled,
select:disabled,
textarea:disabled {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

/* Select dropdown specific styling */
select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
  appearance: none;
}

/* Form group spacing */
.form-group,
div:has(input),
div:has(select) {
  margin-bottom: 16px;
}

/* Label styling */
label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* Button styling enhancement */
button[type='submit'],
.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
}

button[type='submit']:hover,
.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

button[type='submit']:active,
.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

/* Error states */
input.error,
select.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Placeholder styling */
input::placeholder,
textarea::placeholder {
  color: #9ca3af;
  opacity: 1;
}

.badge-prioridad {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
}

.badge-alta {
  background-color: #dc2626;
}

.badge-media {
  background-color: #f59e0b;
}

.badge-baja {
  background-color: #3b82f6;
}

.prioridad-alta {
  border-left: 6px solid #dc2626;
}

.prioridad-media {
  border-left: 6px solid #f59e0b;
}

.prioridad-baja {
  border-left: 6px solid #3b82f6;
}

.grid-tareas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding-top: 2rem;
}

.dropdown-filtros {
  margin-bottom: 1rem;
}

.btn-toggle {
  background-color: #1e293b;
  color: black;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease-in-out;
}

.btn-toggle:hover {
  background-color: #334155;
}
</style>

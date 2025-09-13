<script setup>
defineProps(['show'])
const emit = defineEmits(['close'])
function close() {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <header class="modal-header">
        <button class="close-button" @click="close">×</button>
        <slot name="header"> Modal Header </slot>
      </header>
      <section class="modal-body">
        <slot> Modal Body </slot>
      </section>
      <footer class="modal-footer">
        <slot name="footer">
          <button @click="close">Cerrar</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  padding: 1rem;
  background: #f5f5f5;
}

.modal-footer {
  padding: 1rem;
  background: #f5f5f5;
}

.modal-body {
  padding: 1rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  float: right;
  cursor: pointer;
}
</style>

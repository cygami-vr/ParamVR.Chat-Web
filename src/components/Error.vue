<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import * as bootstrap from 'bootstrap'

const state = reactive({ error: '' })
const modalEl = ref(null as unknown as Element)
let modal: bootstrap.Modal

window.addEventListener('unhandledrejection', (evt) => {
  state.error = evt.reason
  modal.show()
})

onMounted(() => {
  modal = new bootstrap.Modal(modalEl.value)
})
</script>

<template>
  <div
    id="error"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="errorLabel"
    aria-hidden="true"
    ref="modalEl"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-body" id="errorLabel">An error occurred</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" />
        </div>
        <div class="modal-body">
          <div class="alert alert-danger" role="alert">
            {{ state.error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

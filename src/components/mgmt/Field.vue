<script setup lang="ts">
import { reactive, ref, nextTick, type Ref } from 'vue'
import ThemedButton from '@/components/theme/ThemedButton.vue'

const props = defineProps(['editable', 'value', 'label', 'type'])
const state = reactive({ editing: false, value: props.value || '' })
const emit = defineEmits(['change'])
const input = ref(null as unknown as Ref)

async function edit() {
  state.editing = true
  await nextTick()
  focus()
}

function focus() {
  if (input.value && input.value instanceof HTMLInputElement) {
    input.value.focus()
  }
}

function save() {
  if (props.value == state.value) {
    state.editing = false
  } else {
    if (validate()) {
      state.editing = false
      emit('change', state.value)
    } else {
      alert('Value is invalid')
      focus()
    }
  }
}

function validate() {
  if (props.type) {
    switch (props.type) {
      case 'float':
        return validateFloat()
    }
  }
  return true
}

function validateFloat() {
  const asFloat = Number(state.value)
  if (isNaN(asFloat)) {
    return false
  }
  return asFloat >= 0 && asFloat <= 1
}

function saveOrEdit() {
  if (state.editing) {
    save()
  } else {
    edit()
  }
}
</script>

<template>
  <input
    type="text"
    class="form-control"
    v-model="state.value"
    :placeholder="label"
    ref="input"
    :disabled="!state.editing"
    :readonly="!props.editable"
  />
  <ThemedButton v-if="editable" @click="saveOrEdit">
    {{ state.editing ? 'Save' : 'Edit' }}
  </ThemedButton>
</template>

<style></style>

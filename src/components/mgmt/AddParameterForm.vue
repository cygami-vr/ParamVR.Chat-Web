<script setup lang="ts">
import { reactive } from 'vue'
import fetchw from '@/fetchWrapper'

const props = defineProps(['avatarId'])
const state = reactive({
  parameter: {
    name: '',
    type: 0,
    dataType: 0,
    avatarId: 0,
  },
})
const emit = defineEmits(['parameter-added'])

function addParameter() {
  state.parameter.avatarId = props.avatarId

  if (!state.parameter.avatarId || state.parameter.avatarId == 0) {
    alert('You must select an avatar')
    return
  }

  if (!state.parameter.name) {
    alert('Name is required')
    return
  }

  if (state.parameter.type == 0) {
    alert('Type is required')
    return
  }

  if (state.parameter.dataType == 0) {
    alert('Data type is required')
    return
  }

  fetchw('/parameter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state.parameter),
  }).then(() => {
    emit('parameter-added')
  })

  state.parameter.name = ''
}

function onTypeChange() {
  if (state.parameter.type == 2) {
    // toggle type only supports bool data type
    state.parameter.dataType = 3
  } else if (state.parameter.type == 3) {
    // slider type only supports float data type
    state.parameter.dataType = 2
  } else {
    state.parameter.dataType = 0
  }
}
</script>

<template>
  <div class="row h5"><div class="col">Add a parameter</div></div>
  <div class="row">
    <div class="col-4">
      <input
        class="form-control"
        v-model="state.parameter.name"
        name="name"
        type="text"
        placeholder="parameter name"
      />
    </div>
    <div class="col-3">
      <select class="form-select" v-model="state.parameter.type" name="type" @change="onTypeChange">
        <option value="0" selected>Type</option>
        <option value="1">List of values</option>
        <option value="2">Toggle on/off</option>
        <option value="3">Slider</option>
        <option value="4">Button</option>
      </select>
    </div>
    <div class="col-3">
      <select class="form-select" v-model="state.parameter.dataType" name="dataType">
        <option value="0" selected>Data type</option>
        <option v-if="state.parameter.type == 1 || state.parameter.type == 4" value="1">
          Integer
        </option>
        <option
          v-if="state.parameter.type == 1 || state.parameter.type == 3 || state.parameter.type == 4"
          value="2"
        >
          Decimal
        </option>
        <option v-if="state.parameter.type == 2 || state.parameter.type == 4" value="3">
          Boolean
        </option>
      </select>
    </div>
    <div class="col-2">
      <button type="button" class="btn btn-primary" @click="addParameter">Add Parameter</button>
    </div>
  </div>
</template>

<style></style>

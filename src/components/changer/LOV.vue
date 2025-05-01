<script setup lang="ts">
import { reactive } from 'vue'
import LockButton from '@/components/changer/LockButton.vue'
import ThemedRadioButton from '@/components/theme/ThemedRadioButton.vue'
import ThemedButton from '@/components/theme/ThemedButton.vue'

const pageSize = 10
const props = defineProps(['param'])
const state = reactive({ page: 1, pages: Math.ceil(props.param.values.length / pageSize) })
const emit = defineEmits(['change', 'lock'])

function onChange(evt: Event) {
  if (evt && evt.target && evt.target instanceof HTMLInputElement) {
    emit('change', props.param.name, evt.target.value)
  }
}

function getPage() {
  if (state.pages == 1) {
    return props.param.values
  }
  const start = (state.page - 1) * pageSize
  const end = Math.min(start + pageSize, props.param.values.length)
  return props.param.values.slice(start, end)
}

function prevPage() {
  state.page--
}

function nextPage() {
  state.page++
}
</script>

<template>
  <div class="row">
    <div v-if="param.lockable == 'Y'" class="col-4"></div>
    <div class="col-4 flex-grow-1 h5 text-body">{{ param.description }}</div>
    <LockButton :param="param" @lock="$emit('lock')" />
  </div>
  <div class="text-center mb-2" v-if="param.image">
    <img :src="param.image" class="rounded-3" />
  </div>
  <div class="lov-scroll">
    <template v-for="value in getPage()" :key="value.value">
      <div class="form-check text-start">
        <label :for="param.name + value.value" class="row justify-content-center text-body">
          <div class="col-1">
            <ThemedRadioButton
              :disabled="param.locked"
              :id="param.name + value.value"
              :name="param.name"
              @change="onChange"
              :value="value.value"
              :checked="props.param.value == value.value"
            />
          </div>
          <div class="col-9 form-check-label text-center">{{ value.description }}</div>
          <div class="col-1" />
        </label>
      </div>
    </template>
  </div>
  <div class="mt-2 row justify-content-evenly" v-if="param.values.length > pageSize">
    <ThemedButton
      defaultClass="btn-sm material-icons btn-primary-outline col-3 col-md-2 col-lg-1"
      :disabled="state.page == 1"
      @click="prevPage"
      >arrow_left</ThemedButton
    >
    <ThemedButton
      defaultClass="btn-sm material-icons btn-primary-outline col-3 col-md-2 col-lg-1"
      :disabled="state.page == state.pages"
      @click="nextPage"
      >arrow_right</ThemedButton
    >
  </div>
</template>

<style>
.lov-scroll {
  max-height: 150px;
  overflow-y: auto;
  overflow-x: clip;
}
</style>

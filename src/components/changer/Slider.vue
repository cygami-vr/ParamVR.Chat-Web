<script setup lang="ts">
import ThemedSlider from '@/components/theme/ThemedSlider.vue'
import LockButton from '@/components/changer/LockButton.vue'
import { reactive, watch } from 'vue'

const props = defineProps(['param'])
const state = reactive({
  current: 0,
})
const emit = defineEmits(['change', 'lock'])

watch(
  () => props.param.value,
  (val) => {
    if (typeof val == 'number') {
      state.current = Number(val.toFixed(2))
    } else {
      state.current = 0
    }
  },
  { immediate: true }
)

const min = parseFloat(props.param.minValue) || 0
const max = parseFloat(props.param.maxValue) || 1
const range = max - min

function onInput(evt: Event) {
  if (evt && evt.target && evt.target instanceof HTMLInputElement) {
    state.current = getValue(evt.target)
  }
}

function onChange(evt: Event) {
  if (evt && evt.target && evt.target instanceof HTMLInputElement) {
    state.current = getValue(evt.target)
    emit('change', props.param.name, state.current)
  }
}

function getValue(input: HTMLInputElement) {
  const value = (parseFloat(input.value) / 100) * range + min
  return Number(value.toFixed(2))
}
</script>

<template>
  <div class="row">
    <div v-if="param.lockable == 'Y'" class="col-4"></div>
    <div class="col-4 flex-grow-1 h5 text-body">{{ param.description }}</div>
    <LockButton :param="param" @lock="$emit('lock')" />
  </div>
  <div class="text-center mb-1" v-if="param.image">
    <img :src="param.image" class="rounded-3" />
  </div>
  <div class="text-center text-body mb-1">{{ state.current }}</div>
  <ThemedSlider
    defaultClass="w-75"
    :disabled="param.locked"
    :value="((param.value - min) / range) * 100"
    :name="param.name"
    @input="onInput"
    @change="onChange"
  />
</template>

<style></style>

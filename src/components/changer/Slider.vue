<script setup lang="ts">
import ThemedSlider from '@/components/theme/ThemedSlider.vue'
import LockButton from '@/components/changer/LockButton.vue'

const props = defineProps(['param'])
const emit = defineEmits(['change', 'lock'])

const min = parseFloat(props.param.minValue) || 0
const max = parseFloat(props.param.maxValue) || 1
const range = max - min

function onChange(evt: Event) {
  if (evt && evt.target && evt.target instanceof HTMLInputElement) {
    emit('change', props.param.name, getValue(evt.target))
  }
}

function getValue(input: HTMLInputElement) {
  return (parseFloat(input.value) / 100) * range + min
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
  <ThemedSlider
    defaultClass="w-75"
    :disabled="param.locked"
    :value="((param.value - min) / range) * 100"
    :name="param.name"
    @change="onChange"
  />
</template>

<style></style>

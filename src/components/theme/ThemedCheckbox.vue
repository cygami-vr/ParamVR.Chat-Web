<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
const props = defineProps(['defaultClass', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function getClasses() {
  let classes = props['defaultClass'] || 'form-check-input'
  if (theme.colorPrimary) {
    classes += ' themed-checkbox'
  }
  return classes
}
</script>

<template>
  <input :class="getClasses()" type="checkbox" v-model="model" />
</template>

<style>
.themed-checkbox:checked {
  background-color: v-bind('theme.colorPrimary') !important;
  border-color: v-bind('theme.colorPrimary') !important;
}
.themed-checkbox:focus {
  box-shadow: v-bind('theme.boxShadow') !important;
  border-color: v-bind('theme.lightHslCss') !important;
}
</style>

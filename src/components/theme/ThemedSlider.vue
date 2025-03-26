<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
const props = defineProps(['defaultClass'])

function getClasses() {
  let classes = 'form-range ' + (props['defaultClass'] || '')
  if (theme.colorPrimary) {
    classes += ' themed-slider'
  }
  return classes
}
</script>

<template>
  <input :class="getClasses()" type="range" />
</template>

<style>
.themed-slider.form-range:focus::-webkit-slider-thumb {
  box-shadow: v-bind('theme.boxShadow') !important;
}
.themed-slider.form-range:focus::-moz-range-thumb {
  box-shadow: v-bind('theme.boxShadow') !important;
}

.themed-slider.form-range::-webkit-slider-thumb {
  background-color: v-bind('theme.colorPrimary') !important;
}
.themed-slider.form-range::-webkit-slider-thumb:active {
  background-color: v-bind('theme.lightHslCss') !important;
}
.themed-slider.form-range::-webkit-slider-runnable-track {
  background-color: v-bind('theme.colorPrimary') !important;
}
.themed-slider.form-range::-moz-range-thumb {
  background-color: v-bind('theme.colorPrimary') !important;
}
.themed-slider.form-range::-moz-range-thumb:active {
  background-color: v-bind('theme.lightHslCss') !important;
}
</style>

<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
const props = defineProps(['defaultClass'])

function getClasses() {
  let classes = props['defaultClass'] || 'form-check-input'
  if (theme.colorPrimary) {
    classes += ' themed-lov'
  }
  return classes
}
</script>

<template>
  <input :class="getClasses()" type="radio" />
</template>

<style>
.themed-lov:checked {
  background-color: v-bind('theme.colorPrimary') !important;
  border-color: v-bind('theme.colorPrimary') !important;
}
.themed-lov:focus {
  box-shadow: v-bind('theme.boxShadow') !important;
}
</style>

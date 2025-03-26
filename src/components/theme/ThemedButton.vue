<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
const props = defineProps(['defaultClass'])

function getClasses() {
  let classes = 'btn ' + (props['defaultClass'] || 'btn-primary')
  if (theme.colorPrimary) {
    if (props.defaultClass?.includes('outline')) {
      classes += ' border-primary-theme theme-focus color-theme outline-hover'
    } else {
      classes += ' bg-primary-theme theme-focus border-primary-theme'
    }
  }
  return classes
}
</script>

<template>
  <button :class="getClasses()" type="button"><slot /></button>
</template>

<style>
.outline-hover:hover {
  background-color: v-bind('theme.colorPrimary') !important;
  color: #212529 !important;
}
</style>

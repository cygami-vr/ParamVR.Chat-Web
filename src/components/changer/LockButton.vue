<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
const props = defineProps(['param'])
defineEmits(['lock'])

function getClasses() {
  let classes = 'btn btn-primary-outline material-icons text-center'
  if (theme.colorPrimary) {
    classes += ' theme-focus'
  }
  if (props.param.locked) {
    if (props.param.lockKey) {
      classes += ' text-primary'
      if (theme.colorPrimary) {
        classes += ' color-theme'
      }
    } else {
      classes += ' text-danger'
    }
  } else {
    classes += ' text-muted'
  }
  return classes
}
</script>

<template>
  <div v-if="param.lockable == 'Y'" class="col-4 text-end">
    <button type="button" :class="getClasses()" @click="$emit('lock')">
      {{ param.locked ? 'lock' : 'lock_open' }}
    </button>
  </div>
</template>

<style></style>

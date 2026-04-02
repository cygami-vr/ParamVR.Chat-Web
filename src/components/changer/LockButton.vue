<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore'

const theme = useThemeStore()
const props = defineProps(['param'])
defineEmits(['lock'])

function getClasses() {
  let classes = 'btn btn-primary-outline material-icons text-center'
  if (theme.effectiveColorPrimary) {
    classes += ' theme-focus'
  }
  if (props.param.locked) {
    if (props.param.lockKey) {
      classes += ' text-primary'
      if (theme.effectiveColorPrimary) {
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

function getTitle() {
  if (props.param.locked) {
    if (props.param.lockKey) {
      return 'Unlock ' + props.param.description
    }
    return 'Locked by another user'
  }
  return 'Lock ' + props.param.description
}
</script>

<template>
  <div v-if="param.lockable == 'Y'" class="col-4 text-end material-icons">
    <button type="button" :class="getClasses()" @click="$emit('lock')" :title="getTitle()">
      {{ param.locked ? 'lock' : 'lock_open' }}
    </button>
  </div>
</template>

<style></style>

<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
const props = defineProps(['muteLocked', 'muteLockedByOther'])
defineEmits(['lock'])

function getClasses() {
  let classes = 'btn material-icons fs-6'
  if (theme.effectiveColorPrimary) {
    classes += ' theme-focus'
  }
  if (props.muteLocked) {
    if (!props.muteLockedByOther) {
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
  if (props.muteLocked) {
    if (!props.muteLockedByOther) {
      return 'Mute locked'
    }
    return 'Locked by another user'
  }
  return 'Mute lock'
}
</script>

<template>
  <button
    type="button"
    :class="getClasses()"
    @click="$emit('lock')"
    :title="getTitle()"
    id="muteLockBtn"
  >
    {{ muteLocked ? 'lock' : 'lock_open' }}
  </button>
</template>

<style>
#muteLockBtn {
  position: relative;
  left: -15px;
  top: 10px;
}
</style>

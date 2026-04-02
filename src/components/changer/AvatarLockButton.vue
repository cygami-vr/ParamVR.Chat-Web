<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
const props = defineProps(['avatarLocked', 'avatarLockedByOther'])
defineEmits(['lock'])

function getClasses() {
  let classes = 'btn fs-4'
  if (theme.effectiveColorPrimary) {
    classes += ' theme-focus'
  }
  if (props.avatarLocked) {
    if (!props.avatarLockedByOther) {
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
  if (props.avatarLocked) {
    if (!props.avatarLockedByOther) {
      return 'Avatar locked'
    }
    return 'Locked by another user'
  }
  return 'Avatar lock'
}
</script>

<template>
  <button
    type="button"
    :class="getClasses()"
    @click="$emit('lock')"
    :title="getTitle()"
    id="avatarLockBtn"
  >
    {{ avatarLocked ? 'lock' : 'lock_open' }}
  </button>
</template>

<style></style>

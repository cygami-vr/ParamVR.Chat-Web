<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()

const props = defineProps(['icon_on', 'icon_off', 'status', 'on_status', 'off_status', 'invert'])

const invert = props.invert == 'true'

function title() {
  const status = invert ? !props.status : props.status
  return status ? props.on_status : props.off_status
}

function getClasses() {
  let classes = 'col-2 material-icons'
  if (props.status === invert) {
    classes += ' text-muted'
  } else {
    classes += ' text-primary'
    if (theme.colorPrimary) {
      classes += ' color-theme'
    }
  }
  return classes
}
</script>

<template>
  <span v-if="props.status != null" :class="getClasses()" :title="title()">
    {{ props.status === invert ? props.icon_off : props.icon_on }}
  </span>
</template>

<style></style>

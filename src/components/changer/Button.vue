<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
const props = defineProps(['param'])
defineEmits(['click', 'lock', 'release'])

function getButtonClass() {
  return theme.colorPrimary ? 'themedButton' : ''
}

function getClasses() {
  let classes = ''
  if (props.param.locked) {
    if (props.param.lockKey) {
      classes = 'text-primary'
      if (theme.colorPrimary) {
        classes += ' color-theme'
      }
    } else {
      classes = 'text-danger'
    }
  } else {
    classes = 'text-muted'
  }
  if (theme.colorPrimary) {
    classes += ' theme-focus'
  }
  return classes
}
</script>

<template>
  <div class="text-center mb-2" v-if="param.image">
    <img :src="param.image" class="rounded-3" />
  </div>
  <div class="row align-items-center justify-content-between">
    <div class="col-4 flex-grow-1">
      <button
        :class="`btn btn-primary ${getButtonClass()}`"
        :disabled="param.locked"
        type="button"
        @mousedown="() => $emit('click', param.name)"
        @click="() => $emit('release', param.name)"
      >
        {{ param.description }}
      </button>
    </div>
    <div v-if="param.lockable == 'Y'" class="col-4 text-end">
      <button
        type="button"
        :class="`btn btn-primary-outline material-icons
             ${getClasses()}`"
        @click="$emit('lock')"
      >
        {{ param.locked ? 'lock' : 'lock_open' }}
      </button>
    </div>
  </div>
</template>

<style>
.themedButton {
  background-color: v-bind('theme.colorPrimary') !important;
  border-color: v-bind('theme.colorPrimary') !important;
}
.themedButton:focus {
  box-shadow: v-bind('theme.boxShadow') !important;
}
</style>

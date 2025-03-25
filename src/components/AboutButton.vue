<script setup lang="ts">
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()

function getThemeClass() {
  return theme.colorPrimary ? 'bg-primary-theme theme-focus border-primary-theme' : ''
}
</script>

<template>
  <button
    :class="`btn btn-info ${getThemeClass()}`"
    type="button"
    data-bs-toggle="modal"
    data-bs-target="#about"
  >
    About
  </button>
</template>

<style></style>

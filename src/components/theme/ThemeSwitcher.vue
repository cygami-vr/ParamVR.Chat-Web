<script setup lang="ts">
import ThemedButton from '@/components/theme/ThemedButton.vue'
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()

function getButtonText() {
  return theme.darkMode ? 'Use light theme' : 'Use dark theme'
}

function swapTheme() {
  theme.setDarkMode(!theme.darkMode)
}
</script>

<template>
  <ThemedButton defaultClass="btn-info" @click="swapTheme">{{ getButtonText() }}</ThemedButton>
</template>

<style></style>

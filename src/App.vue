<script setup lang="ts">
import Error from '@/components/Error.vue'
import VrcParamMgmtDashboard from '@/components/mgmt/VrcParamMgmtDashboard.vue'
import VrcParamChanger from '@/components/changer/VrcParamChanger.vue'
import AboutModal from '@/components/AboutModal.vue'
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
let targetType: string
let target: string

if (location.pathname.startsWith('/nv')) {
  target = location.pathname.substring(4)
  targetType = 'invite'
} else if (location.pathname.startsWith('/p')) {
  target = location.pathname.substring(3).toLowerCase()
  targetType = 'user'
} else {
  target = ''
  targetType = ''
}
console.log(`Target type: ${targetType}`)
console.log(`Target: ${target}`)

function getBgClasses() {
  let classes = 'bg-primary bg-gradient'
  if (theme.colorPrimary) {
    classes += ' bg-primary-theme'
  }
  return classes
}
</script>

<template>
  <div id="bg" :class="getBgClasses()">
    <Error />
    <AboutModal />
    <VrcParamChanger v-if="target" :target="target" :targetType="targetType" />
    <VrcParamMgmtDashboard v-else />
  </div>
</template>

<style>
html,
body,
#app,
#bg {
  min-height: 100vh;
}

.bg-primary-theme {
  background-color: v-bind('theme.colorPrimary') !important;
}

.border-primary-theme {
  border-color: v-bind('theme.colorPrimary') !important;
}

.color-theme {
  color: v-bind('theme.colorPrimary') !important;
}

.theme-focus:focus {
  box-shadow: v-bind('theme.boxShadow') !important;
}
</style>

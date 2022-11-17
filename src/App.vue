<script setup lang='ts'>
import VrcParamMgmtDashboard from '@/components/mgmt/VrcParamMgmtDashboard.vue'
import VrcParamChanger from '@/components/changer/VrcParamChanger.vue'
import AboutModal from '@/components/AboutModal.vue'

const targetUser = (location.pathname.substring(3) || location.search.substring(1)).toLowerCase()
console.log(`Target user: ${targetUser}`)

</script>

<template>
    <AboutModal />
    <VrcParamChanger v-if='targetUser' :targetUser='targetUser' />
    <VrcParamMgmtDashboard v-else />
</template>

<style>
html, body, #app {
    min-height: 100vh;
}
</style>

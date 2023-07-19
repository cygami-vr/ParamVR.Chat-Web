<script setup lang='ts'>
import Error from '@/components/Error.vue'
import VrcParamMgmtDashboard from '@/components/mgmt/VrcParamMgmtDashboard.vue'
import VrcParamChanger from '@/components/changer/VrcParamChanger.vue'
import AboutModal from '@/components/AboutModal.vue'

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

</script>

<template>
    <Error />
    <AboutModal />
    <VrcParamChanger v-if='target' :target='target' :targetType='targetType' />
    <VrcParamMgmtDashboard v-else />
</template>

<style>
html, body, #app {
    min-height: 100vh;
}
</style>

<script setup lang='ts'>
import About from '@/components/About.vue'
import VrcParamMgmtDashboard from '@/components/mgmt/VrcParamMgmtDashboard.vue'
import VrcParamChanger from '@/components/changer/VrcParamChanger.vue'

const targetUser = (location.search.substring(1) || location.pathname.substring(3)).toLowerCase()

console.log(`Target user: ${targetUser}`)

</script>

<template>
    <About />
    <VrcParamChanger v-if='targetUser' :targetUser='targetUser' />
    <VrcParamMgmtDashboard v-else />
</template>

<style>
@import '@/assets/base.css';

.avatar {
    max-height: 100px;
    max-width: 100px;
}
.clickable {
    cursor: pointer;
    user-select: none;
}
.clickable:hover {
    background-color: rgba(200, 200, 200, 0.25);
    border-radius: 10px;
}
.delete-button {
    float: right;
}
</style>

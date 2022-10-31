<script setup lang='ts'>
defineProps(['msg'])
defineEmits(['ack'])
</script>

<template>
    <div v-if="msg" class="header">
        <span>{{ msg }}</span>
        <button @click="() => $emit('ack')">Ok</button>
    </div>
</template>

<style>
.header {
    position: fixed;
    top: 0px;
    left: 0px;
    color: red;
    z-index: 20;
    background:rgba(0,0,0,1);
    width: 100%;
}
</style>

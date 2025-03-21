<script setup lang='ts'>

defineProps(['param'])
defineEmits(['click', 'lock', 'release'])

</script>

<template>
    <div class="text-center mb-2" v-if="param.image"><img :src="param.image" class="rounded-3" /></div>
    <div class="row align-items-center justify-content-between">
        <div class="col-4 flex-grow-1">
            <button class="btn btn-primary" :disabled="param.locked" type="button"
                @mousedown="() => $emit('click', param.name)"
                @click="() => $emit('release', param.name)">
                {{param.description}}
            </button>
        </div>
        <div v-if="param.lockable == 'Y'" class="col-4 text-end">
            <button type="button" :class="`btn btn-primary-outline material-icons
             ${param.locked ? (param.lockKey ? 'text-primary' : 'text-danger') : 'text-muted'}`" @click="$emit('lock')">
                {{param.locked ? 'lock' : 'lock_open'}}
            </button>
        </div>
    </div>
</template>

<style>
</style>

<script setup lang='ts'>

const props = defineProps(['name', 'icon_on', 'icon_off', 'status', 'on_status', 'off_status', 'invert'])
const unknownStatus = `We're not sure of the ${props.name} status right now.`

const invert = props.invert == 'true'

function title() {
    if (props.status == null) {
        return unknownStatus
    }
    const status = invert ? !props.status : props.status
    return status ? props.on_status : props.off_status
}
</script>

<template>
    <span class="material-icons" :title="title()">
        {{ props.status === invert ? props.icon_off : props.icon_on }}
        <span v-if="props.status == null" class="material-icons question-mark">question_mark</span>
    </span>
</template>

<style>
.question-mark {
    font-size: 15px;
    top: -14px;
    left: -10px;
}
</style>

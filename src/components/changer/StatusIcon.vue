<script setup lang='ts'>
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()

const props = defineProps(['icon_on', 'icon_off', 'status', 'on_status', 'off_status', 'invert'])

const invert = props.invert == 'true'

function title() {
    const status = invert ? !props.status : props.status
    return status ? props.on_status : props.off_status
}

function getClass() {
    return props.status === invert ? 'text-muted' : 'text-primary'
}

function getStyleOverride() {
    return props.status === invert ? '' : theme.textPrimary
}

</script>

<template>
    <span :style="getStyleOverride()" v-if="props.status != null" :class="`col-2 material-icons ${getClass()}`" :title="title()">
        {{ props.status === invert ? props.icon_off : props.icon_on }}
    </span>
</template>

<style>
</style>

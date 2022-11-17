<script setup lang='ts'>

const props = defineProps(['param'])
const emit = defineEmits(['change'])

const min = parseFloat(props.param.minValue) || 0
const max = parseFloat(props.param.maxValue) || 1
const range = max - min

function onChange(evt: InputEvent) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement) {
        emit('change', props.param.name, getValue(evt.target))
    }
}

function getValue(input: HTMLInputElement) {
    return parseFloat(input.value) / 100 * range + min
}

</script>

<template>
    <div class="h5">{{param.description}}</div>
    <div class="text-center mb-1" v-if="param.image"><img :src="param.image" class="rounded-3" /></div>
    <input class="w-75 form-range" :value="(param.value - min) / range * 100" type="range" :name="param.name" @change="onChange"/>
</template>

<style>
</style>

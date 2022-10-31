<script setup lang='ts'>

const props = defineProps(['name', 'value', 'min', 'max'])
const emit = defineEmits(['change'])

const min = parseFloat(props.min) || 0
const max = parseFloat(props.max) || 1
const range = max - min

function onChange(evt: InputEvent) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement) {
        emit('change', props.name, getValue(evt.target))
    }
}

function getValue(input: HTMLInputElement) {
    return parseFloat(input.value) / 100 * range + min
}

</script>

<template>
    <input class="slider" :value="(props.value - min) / range * 100" type="range" :name="name" @change="onChange"/>
</template>

<style>
input.slider {
    margin-left: 5px;
}
</style>

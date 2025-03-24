<script setup lang='ts'>
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
const props = defineProps(['param'])
const emit = defineEmits(['change', 'lock'])

const min = parseFloat(props.param.minValue) || 0
const max = parseFloat(props.param.maxValue) || 1
const range = max - min

function onChange(evt: Event) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement) {
        emit('change', props.param.name, getValue(evt.target))
    }
}

function getValue(input: HTMLInputElement) {
    return parseFloat(input.value) / 100 * range + min
}

function getSliderClass() {
  return theme.colorPrimary ? 'themedSlider' : '';
}

function getClasses() {
    let classes = ''
    if (props.param.locked) {
        if (props.param.lockKey) {
            classes = 'text-primary'
            if (theme.colorPrimary) {
                classes += ' color-theme'
            }
        } else {
            classes = 'text-danger'
        }
    } else {
        classes = 'text-muted'
    }
    if (theme.colorPrimary) {
        classes += ' theme-focus'
    }
    return classes
}

</script>

<template>
    <div class="row">
        <div v-if="param.lockable == 'Y'" class="col-4"></div>
        <div class="col-4 flex-grow-1 h5">{{param.description}}</div>
        <div v-if="param.lockable == 'Y'" class="col-4 text-end">
            <button type="button" :class="`btn btn-primary-outline material-icons text-center
             ${getClasses()}`" @click="$emit('lock')">
                {{param.locked ? 'lock' : 'lock_open'}}
            </button>
        </div>
    </div>
    <div class="text-center mb-1" v-if="param.image"><img :src="param.image" class="rounded-3" /></div>
    <input :class="`w-75 form-range ${getSliderClass()}`" :disabled="param.locked" :value="(param.value - min) / range * 100" type="range" :name="param.name" @change="onChange"/>
</template>

<style>

.themedSlider.form-range:focus::-webkit-slider-thumb {
    box-shadow: v-bind('theme.boxShadow') !important;
}
.themedSlider.form-range:focus::-moz-range-thumb {
    box-shadow: v-bind('theme.boxShadow') !important;
}

.themedSlider.form-range::-webkit-slider-thumb {
    background-color: v-bind('theme.colorPrimary') !important;
}
.themedSlider.form-range::-webkit-slider-thumb:active {
    background-color: v-bind('theme.lightHslCss') !important;
}
.themedSlider.form-range::-webkit-slider-runnable-track {
    background-color: v-bind('theme.colorPrimary') !important;
}
.themedSlider.form-range::-moz-range-thumb {
    background-color: v-bind('theme.colorPrimary') !important;
}
.themedSlider.form-range::-moz-range-thumb:active {
    background-color: v-bind('theme.lightHslCss') !important;
}

</style>

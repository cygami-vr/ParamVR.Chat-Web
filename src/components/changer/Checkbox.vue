<script setup lang='ts'>
import { ref, watch } from 'vue'

const props = defineProps(['param'])
const emit = defineEmits(['change'])
const input = ref(null as unknown as HTMLInputElement)

function onChange(evt: Event) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement) {
        emit('change', props.param.name, evt.target.checked)
    }
}

function isTrue(val: any) {
    return val === true || val === 'true'
}

// The "checked" attribute can only control the initial value, so we need to update it this way.
watch(() => props.param.value, after => {
    input.value.checked = isTrue(after)
})

</script>

<template>
    <div class="text-center mb-2" v-if="param.image"><img :src="param.image" class="rounded-3" /></div>
    <label class="form-check form-switch" :for="param.name">
        <div class="align-items-center justify-content-between">
            <input class="form-check-input" :checked="isTrue(param.value)" type="checkbox" :name="param.name" :id="param.name" @change="onChange" ref="input" />
            <div class="form-check-label h5" :title="param.description">{{param.description}}</div>
        </div>
    </label>
</template>

<style>
</style>

<script setup lang='ts'>
import { ref, watch } from 'vue'

const props = defineProps(['name', 'value'])
const emit = defineEmits(['change'])
const input = ref(null as unknown as HTMLInputElement)

function onChange(evt: InputEvent) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement) {
        emit('change', props.name, evt.target.checked)
    }
}

// The "checked" attribute can only control the initial value, so we need to update it this way.
watch(() => props.value, (before, after) => {
    input.value.checked = after
})

</script>

<template>
    <input class="checkbox" :checked="props.value" type="checkbox" :name="name" @change="onChange" ref="input" />
</template>

<style>
input.checkbox {
    margin-left: 5px;
}
</style>

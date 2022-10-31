<script setup lang='ts'>
import { reactive, ref, nextTick } from 'vue'

const props = defineProps(['editable', 'value', 'label', 'type'])
const state = reactive({editing: false, value: props.value || ''})
const emit = defineEmits(['change'])
const input = ref(null as any)

async function edit() {
    state.editing = true
    await nextTick()
    focus()
}

function focus() {
    if (input.value && input.value instanceof HTMLInputElement) {
        input.value.focus()
    }
}

function save() {
    if (props.value == state.value) {
        state.editing = false
    } else {
        if (validate()) {
            state.editing = false
            emit('change', state.value)
        } else {
            alert('Value is invalid')
            focus()
        }
    }
}

function validate() {
    if (props.type) {
        switch (props.type) {
            case 'float': return validateFloat()
        }
    }
    return true
}

function validateFloat() {
    const asFloat = Number(state.value)
    if (isNaN(asFloat)) {
        return false
    }
    return asFloat >= 0 && asFloat <= 1
}

</script>

<template>
    <template v-if="state.editing">
        <input v-model="state.value" type="text" :placeholder="label" ref="input" />
        <span class="material-icons clickable" @click="save">save</span>
    </template>
    <template v-else>
        <!-- TODO would rather not have the field class on the label. Seems to be needed due to inline-block. -->
        <span class="field" v-if="label">{{label}}:</span>
        <span class="field" v-if="!state.editing" :title="value">{{value}}</span>
        <span v-if="editable" class="material-icons clickable" @click="edit">edit</span>
    </template>
</template>

<style>
.field {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100px;
    display: inline-block;
}
</style>

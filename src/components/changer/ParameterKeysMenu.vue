<script setup lang='ts'>
import { reactive } from 'vue'

const state = reactive({
    open: false,
    parameterKeys: localStorage.getItem('parameterKeys') || '',
    parameterKey: ''
})
const emit = defineEmits(['change'])

function addParameterKey() {
    state.parameterKeys += `${state.parameterKey},`
    localStorage.setItem('parameterKeys', state.parameterKeys)
    state.parameterKey = ''
    emit('change')
}

</script>

<template>
    <div id="param-keys">
        <template v-if="state.open">
            <div>
                You can unlock hidden parameters if you have the correct parameter password.
                Please enter any of these passwords here.
            </div>
            <div>
                Parameter passwords: {{ state.parameterKeys }}
            </div>
            <div>
                <input v-model="state.parameterKey" type="text" name="parameterKey" />
                <button @click="addParameterKey">Add key</button>
            </div>
            <a href="#" @click.prevent="state.open = false">Hide this.</a>
        </template>
        <a v-else href="#" @click.prevent="state.open = true">Manage parameter passwords...</a>
    </div>
</template>

<style>

#param-keys {
    float: right;
    z-index: 10;
    overflow-wrap: break-word;
    width: 20%;
    position: fixed;
    top: 0px;
    right: 0px;
    color: lightgray;
    background-color: rgba(64, 64, 64, 1);
    border-radius: 0 0 0 10px;
    padding-left: 10px;
    padding-right: 10px;
}

</style>

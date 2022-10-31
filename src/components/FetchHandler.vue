<script setup lang='ts'>
import { reactive } from 'vue'

const state = reactive({ error: '' })
const emit = defineEmits(['ok'])

const props = defineProps({
    url: String,
    type: String,
    init: {} as any
})

const isDev = window.origin.indexOf('localhost') === 7 || window.origin.indexOf('127.0.0.1') === 7

if (props.url) {

    if (isDev) {
        props.init.credentials = 'include'
    }

    fetch(`http://localhost:8093${props.url}`, props.init).then(resp => {

        if (resp.ok) {

            if (props.type == 'json') {
                resp.json().then(data => {
                    emit('ok', data)
                }).catch(err => {
                    state.error = `Error: ${err}`
                })

            } else {
                emit('ok', resp)
            }

        } else {
            state.error = `Error: ${resp.statusText}`
        }
    }).catch(err => {
        state.error = `Error: ${err}`
    })
}

</script>

<template>
    <div v-if="state.error" class="header">
        <span>{{ state.error }}</span>
        <button @click="() => state.error = ''">Ok</button>
    </div>
</template>

<style>
.header {
    position: fixed;
    top: 0px;
    left: 0px;
    color: red;
    z-index: 20;
    background:rgba(0,0,0,1);
    width: 100%;
}
</style>
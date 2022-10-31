<script setup lang='ts'>
import { reactive } from 'vue'
import fetchw from '@/fetchWrapper'

const state = reactive({ file: null as unknown as File, error: ''})
const props = defineProps(['idProperty', 'idValue', 'url'])
const emit = defineEmits(['image-uploaded'])

function uploadImage() {

    const formData = new FormData()
    formData.append('image', state.file)
    formData.append(props.idProperty, props.idValue)

    fetchw(props.url, {
        method: 'POST',
        body: formData
    }).then(resp => {
        if (resp.ok) {
            emit('image-uploaded')
        } else {
            state.error = `Error: ${resp.statusText}`
        }
    }).catch(err => {
        state.error = `Error: ${err}`
    })
}

function onFileChange(evt: Event) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement && evt.target.files && evt.target.files.length > 0) {
        state.file = evt.target.files[0]
    }
}

</script>

<template>
    <Header :msg="state.error" @ack="() => state.error = ''" />
    <input name="image" type="file" @change="onFileChange" accept="image/*" />
    <button @click="uploadImage">Upload</button>
</template>

<style>
</style>

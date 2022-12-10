<script setup lang='ts'>
import { reactive } from 'vue'
import fetchw from '@/fetchWrapper'

const state = reactive({ file: null as unknown as File })
const props = defineProps(['idProperty', 'idValue', 'url'])
const emit = defineEmits(['image-changed', 'error'])

function uploadImage() {

    if (!state.file || !props.idValue) {
        console.log('File or id value missing')
        return
    }

    const formData = new FormData()
    formData.append('image', state.file)
    formData.append(props.idProperty, props.idValue)

    fetchw(props.url, {
        method: 'POST',
        body: formData
    }).then(resp => {
        if (resp.ok) {
            emit('image-changed')
        } else {
            emit('error', `Error: ${resp.statusText}`)
        }
    }).catch(err => {
        emit('error', `Error: ${err}`)
    })
}

function deleteImage() {
    fetchw(props.url, {
        method: 'DELETE',
        body: props.idValue
    }).then(resp => {
        if (resp.ok) {
            emit('image-changed')
        } else {
            emit('error', `Error: ${resp.statusText}`)
        }
    }).catch(err => {
        emit('error', `Error: ${err}`)
    })
}

function onFileChange(evt: Event) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement && evt.target.files && evt.target.files.length > 0) {
        state.file = evt.target.files[0]
    }
}

</script>

<template>
    <input class="form-control" accept="image/*" type="file" @change="onFileChange" />
    <button type="button" class="btn btn-primary" @click="uploadImage">Upload</button>
    <button type="button" class="btn btn-outline-danger" @click="deleteImage">Delete</button>
</template>

<style>
</style>

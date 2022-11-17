<script setup lang='ts'>
import { reactive } from 'vue'
import fetchw from '@/fetchWrapper'

const state = reactive({ username: '', password: '', msg: null, error: '' })
const emit = defineEmits(['logged-in'])

let firstTry = true
function login() {

    let formData = new FormData()
    formData.append('username', state.username)
    formData.append('password', state.password)

    fetchw('/login', {
        method: 'POST',
        body: formData
    })
    .then(async resp => {
        if (resp.ok) {
            let json = await resp.json()
            emit('logged-in', json.userName)
        } else if (firstTry) {
            firstTry = false
        } else {
            state.error = `Login failed: ${resp.statusText}`
        }
    }).catch(err => {
        state.error = `Error: ${err}`
    })
}

// try Quick-Auth with no user info
login()

</script>

<template>
    <div class="row g-3 justify-content-start">
        <div class="col-12 h4">
            Please log in to manage your account
        </div>
        <div v-if="state.error" class="col-12 alert alert-danger">
            {{state.error}}
        </div>
        <div class="col-6">
            <input class="form-control" v-model="state.username" name="username" type="text" placeholder="username" />
        </div>
        <div class="col-6">
            <input class="form-control" v-model="state.password" name="password" type="password" placeholder="password" />
        </div>
        <div class="col-12">
            <button type="button" class="btn btn-primary" @click="login">Log in</button>
        </div>
    </div>
</template>

<style>
</style>

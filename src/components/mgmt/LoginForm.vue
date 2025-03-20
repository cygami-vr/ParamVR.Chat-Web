<script setup lang='ts'>
import { reactive } from 'vue'
import fetchw from '@/fetchWrapper'

const state = reactive({ username: '', password: '', msg: null })
const emit = defineEmits(['logged-in'])

function login() {

    const formData = new FormData()
    formData.append('username', state.username)
    formData.append('password', state.password)

    return fetchw('/login', {
        method: 'POST',
        body: formData
    })
    .then(async resp => {
        const json = await resp.json()
        emit('logged-in', json.userName)
    })
}

// try Quick-Auth with no user info
login().catch(() => {
    console.warn("Quick-Auth login attempt failed")
})

function userLogin() {
    login().catch(() => {
        throw new Error('Login failed')
    })
}

</script>

<template>
    <div class="row g-3 justify-content-start">
        <div class="col-12 h4">
            Please log in to manage your account
        </div>
        <div class="col-6">
            <input class="form-control" v-model="state.username" name="username" type="text" placeholder="username" />
        </div>
        <div class="col-6">
            <input class="form-control" v-model="state.password" name="password" type="password" placeholder="password" />
        </div>
        <div class="col-12">
            <button type="button" class="btn btn-primary" @click="userLogin">Log in</button>
        </div>
    </div>
</template>

<style>
</style>

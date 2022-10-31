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
    <Header :msg="state.error" @ack="() => state.error = ''" />
    <input v-model="state.username" name="username" type="text" placeholder="username" />
    <input v-model="state.password" name="password" type="password" placeholder="password" />
    <button @click="login">Log in</button>
    <div v-if="state.msg">{{state.msg}}</div>
</template>

<style>
</style>

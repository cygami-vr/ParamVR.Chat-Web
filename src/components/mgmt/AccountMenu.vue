<script setup lang='ts'>
import { reactive } from 'vue'
import fetchw from '@/fetchWrapper'

const state = reactive({
    open: false, changingPw: false,
    password: '', confirmPassword: '',
    error: ''
})
const emit = defineEmits(['logged-out'])
defineProps(['name'])

function logout() {
    fetchw('/logout', {
        method: 'POST'
    }).then(resp => {
        if (resp.ok) {
            emit('logged-out')
        } else {
            state.error = `Error: ${resp.statusText}`
        }
    }).catch(err => {
        state.error = `Error: ${err}`
    })
}

function generateListenKey() {
    // To the user: Please copy this key down. If lost you must generate a new one. 
    // The listen key is required to authenticate the VrcParameter client to receive VRC parameter changes.
    // Do not give this key to others.
    // Confirm the user wants to proceed
    fetchw('/parameter/listen-key', {
        method: 'POST'
    }).then(async resp => {
        if (resp.ok) {
            let key = await resp.text()
            // remove the quotes
            key = key.substring(1, key.length - 1)
            alert('Your key is (save this somewhere): ' + key)
            // TODO proper modal dialog with new key
        } else {
            state.error = `Error: ${resp.statusText}`
        }
    }).catch(err => {
        state.error = `Error: ${err}`
    })
}

function changePassword() {
    if (state.password == state.confirmPassword) {
        state.changingPw = false
        fetchw('/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({newPassword: state.password })
        }).then(resp => {
            if (resp.ok) {
                alert('Password changed.')
            } else {
                state.error = `Error: ${resp.statusText}`
            }
        }).catch(err => {
            state.error = `Error: ${err}`
        })
    } else {
        state.error = 'Passwords do not match!'
    }
}

</script>

<template>
    <div id="account-menu">
        <Header :msg="state.error" @ack="() => state.error = ''" />
        <div hidden>
            <a target="_blank" href="/client/ParamVR.Chat-Client.jnlp">Launch client</a>
            (Requires <a target="_blank" href="https://openwebstart.com/download/">Open Web Start</a>)
        </div>
        <div class="clickable" @click="() => state.open = !state.open">
            <span class="material-icons">menu</span>
            You are logged in as {{ name }}
        </div>
        <template v-if="state.open">
            <menu>
                <li class="clickable" @click="() => state.changingPw = true">Change password</li>
                <li class="clickable" @click="generateListenKey">Generate a new listen key</li>
                <li class="clickable" @click="logout">Log out</li>
            </menu>
            <template v-if="state.changingPw">
                <input type="password" v-model="state.password" name="password" placeholder="password" />
                <input type="password" v-model="state.confirmPassword" name="password" placeholder="confirm password" />
                <button @click="changePassword">Change password</button>
            </template>
        </template>
    </div>
</template>

<style>

#account-menu {
    position: fixed;
    top: 0px;
    right: 0px;
    z-index: 10;
    color: lightgray;
    background-color: rgba(64, 64, 64, 1);
    border-radius: 0 0 0 10px;
}

#account-menu menu {
    list-style: none;
}

#account-menu .clickable {
    margin-right: 5px;
}

</style>

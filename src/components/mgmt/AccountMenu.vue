<script setup lang='ts'>
import { reactive, ref } from 'vue'
import AboutButton from '@/components/AboutButton.vue'
import fetchw from '@/fetchWrapper'

const state = reactive({
    password: '', confirmPassword: '', listenKey: '', error: ''
})
const emit = defineEmits(['logged-out'])
const closeBtn = ref(null as unknown as HTMLButtonElement)
defineProps(['name'])

function logout() {
    fetchw('/logout', {
        method: 'POST'
    }).then(() => {
        emit('logged-out')
    })
}

function generateListenKey() {
    fetchw('/parameter/listen-key', {
        method: 'POST'
    }).then(async resp => {
        const key = await resp.text()
        state.listenKey = key
        state.error = ''
    })
}

function changePassword() {
    if (state.password == state.confirmPassword) {
        fetchw('/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword: state.password })
        }).then(() => {
            reset()
            if (closeBtn.value) {
                closeBtn.value.click()
            }
        })
    } else {
        state.error = 'Passwords do not match!'
    }
}

function reset() {
    state.error = ''
    state.password = ''
    state.confirmPassword = ''
}

function copyParameterKey() {
    window.navigator.clipboard.writeText(state.listenKey)
}

</script>

<template>
    <nav class="navbar navbar-expand bg-secondary bg-gradient">
        <div class="container-fluid justify-content-end">
            <div class="me-3"><AboutButton /></div>
            <div class="dropdown text-end">
                <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    You are logged in as {{name}}
                </button>
                <ul class="dropdown-menu">
                    <li><button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#changePassword" @click="reset">Change password</button></li>
                    <li><button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#generateListenKey-confirm">Generate a new listen key</button></li>
                    <li><button type="button" class="dropdown-item" @click="logout">Log out</button></li>
                </ul>
            </div>
        </div>
    </nav>
    <div id="changePassword" class="modal fade" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Change password</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="closeBtn" />
                </div>
                <div class="modal-body">
                    <div class="row g-3 justify-content-start">
                        <div v-if="state.error" class="col-12 alert alert-danger">{{state.error}}</div>
                        <div class="col-6">
                            <input class="form-control" v-model="state.password" name="password" type="password" placeholder="password" />
                        </div>
                        <div class="col-6">
                            <input class="form-control" v-model="state.confirmPassword" name="confirmPassword" type="password" placeholder="confirm password" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="row">
                        <div class="col-12">
                            <button type="button" class="btn btn-primary" @click="changePassword">Change password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="generateListenKey-confirm" class="modal fade" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Really generate a new listen key?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body">
                    <div class="row g-3 justify-content-start">
                        <div class="col-12">This will replace your current listen key.</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="row">
                        <div class="col">
                            <button type="button" class="btn btn-primary" @click="generateListenKey"
                             data-bs-toggle="modal" data-bs-target="#generateListenKey-keyGenerated" data-bs-dismiss="modal">Yes</button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="generateListenKey-keyGenerated" class="modal fade" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Your new listen key</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body">
                    <div class="row g-3 justify-content-start">
                        <div v-if="state.listenKey" class="col-12">
                            Your new key is
                            <div class="col input-group mt-1 mb-1">
                                <input type="text" class="form-control" :value="state.listenKey" readonly />
                                <button type="button" @click="copyParameterKey" class="btn btn-primary">Copy</button>
                            </div>
                            Make sure to save it somewhere.
                            If it is lost, you may need to generate a new key.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
</style>

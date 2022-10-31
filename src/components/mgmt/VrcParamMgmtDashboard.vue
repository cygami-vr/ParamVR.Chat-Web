<script setup lang='ts'>
import { reactive, ref } from 'vue'
import LoginForm from '@/components/mgmt/LoginForm.vue'
import AccountMenu from '@/components/mgmt/AccountMenu.vue'
import AddParameterForm from '@/components/mgmt/AddParameterForm.vue'
import Parameter from '@/components/mgmt/Parameter.vue'
import AvatarList from '@/components/mgmt/AvatarList.vue'
import type ParameterObject from '@/ParameterObject'
import fetchw from '@/fetchWrapper'

const state = reactive({ userName: '', avatarId: 0, error: '' })
const parameters = ref(new Array<ParameterObject>())

function loggedIn(userName: string) {
    state.userName = userName
    reloadParameters()
}

function reloadParameters() {

    fetchw('/parameter', {
        method: 'GET'
    }).then(async resp => {
        if (resp.ok) {
            let json = await resp.json()
            parameters.value = json
        } else {
            state.error = `Error: ${resp.statusText}`
        }
    }).catch(err => {
        state.error = `Error: ${err}`
    })
}

function loggedOut() {
    state.userName = ''
    parameters.value = []
}

</script>

<template>
    <Header :msg="state.error" @ack="() => state.error = ''" />
    <template v-if="state.userName">
        <AccountMenu :name="state.userName" @logged-out="loggedOut" />
        <AvatarList @avatar-selected="id => state.avatarId = id" />
        <AddParameterForm @parameter-added="reloadParameters" :avatarId="state.avatarId" />
    </template>
    <LoginForm v-else @logged-in="loggedIn" />
    <div id="parameters">
        <div v-for="param in parameters" :key="param.name">
            <Parameter :parameter="param" @parameter-changed="reloadParameters" />
        </div>
    </div>
</template>

<style>
#parameters {
    margin: auto;
    width: 80%;
}
</style>

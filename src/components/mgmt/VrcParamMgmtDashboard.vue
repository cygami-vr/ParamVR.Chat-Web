<script setup lang='ts'>
import { reactive, ref, computed } from 'vue'
import LoginForm from '@/components/mgmt/LoginForm.vue'
import AccountMenu from '@/components/mgmt/AccountMenu.vue'
import AddParameterForm from '@/components/mgmt/AddParameterForm.vue'
import Parameter from '@/components/mgmt/Parameter.vue'
import AvatarList from '@/components/mgmt/AvatarList.vue'
import type ParameterObject from '@/ParameterObject'
import fetchw from '@/fetchWrapper'
import type Avatar from '@/Avatar'

const state = reactive({ userName: '', avatar: null as unknown as Avatar, error: '' })
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

const activeParameters = computed(() => {
    return state.avatar ? parameters.value.filter(p => p.avatarVrcUuid == state.avatar.vrcUuid) : []
})

function drop(idA: number, idB: number) {
    console.log(`drop ${idA} to ${idB}`)
    let idxA = parameters.value.findIndex(param => param.parameterId == idA)
    let idxB = parameters.value.findIndex(param => param.parameterId == idB)

    let temp = parameters.value[idxA]
    parameters.value[idxA] = parameters.value[idxB]
    parameters.value[idxB] = temp

    let ids: Array<number> = []

    activeParameters.value.forEach(param => {
        ids.push(param.parameterId)
    })

    fetchw('/parameter/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parameterIds: ids
        })
    }).then(async resp => {
        if (!resp.ok) {
            state.error = `Error: ${resp.statusText}`
        }
        reloadParameters()
    }).catch(err => {
        state.error = `Error: ${err}`
        reloadParameters()
    })
}

</script>

<template>
    <AccountMenu v-if="state.userName" :name="state.userName" @logged-out="loggedOut" />
    <div class="container overflow-hidden">
        <template v-if="state.userName">
            <div v-if="state.error" class="row mt-1">
                <div class="p-3 w-100 alert alert-danger rounded-3">
                    {{state.error}}
                </div>
            </div>
            <div class="row mt-1">
                <div class="p-3 w-100 border bg-light rounded-3">
                    <div class="row">
                        <AvatarList @avatar-selected="avatar => state.avatar = avatar" />
                    </div>
                </div>
            </div>
            <div class="row justify-content-center mt-1">
                <div class="p-3 w-100 border bg-light rounded-3">
                    <div class="row text-start">
                        <AddParameterForm v-if="state.avatar" @parameter-added="reloadParameters" :avatarId="state.avatar.id" />
                        <div v-else>Select an avatar to manage parameters.</div>
                    </div>
                </div>
            </div>
            <div v-if="state.avatar" class="row gy-3 justify-content-center mt-1">
                <div v-if="activeParameters.length == 0" class="p-3 w-100 border bg-light rounded-3">
                    <div class="row justify-content-center text-center">
                        <div class="mb-3">This avatar has no parameters yet.</div>
                    </div>
                </div>
                <Parameter v-for="param in activeParameters" :key="param.name" @drop="drop"
                    :parameter="param" @parameter-changed="reloadParameters" />
            </div>
        </template>

        <div v-else class="row justify-content-center mt-1">
            <div class="p-3 w-50 border bg-light rounded-3">
                <LoginForm @logged-in="loggedIn" />
            </div>
        </div>
    </div>
</template>

<style>
</style>

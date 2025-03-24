<script setup lang='ts'>
import { reactive, ref, computed } from 'vue'
import LoginForm from '@/components/mgmt/LoginForm.vue'
import AccountMenu from '@/components/mgmt/AccountMenu.vue'
import AddParameterForm from '@/components/mgmt/AddParameterForm.vue'
import Parameter from '@/components/mgmt/Parameter.vue'
import AvatarList from '@/components/mgmt/AvatarList.vue'
import InviteList from '@/components/mgmt/InviteList.vue'
import UserSettings from '@/components/mgmt/UserSettings.vue'
import type ParameterObject from '@/model/ParameterObject'
import fetchw from '@/fetchWrapper'
import type Avatar from '@/model/Avatar'
import { type EligibleForInvite } from '@/model/InviteObject.ts'

const state = reactive({
    userName: '',
    avatar: null as unknown as Avatar,
    avatarChangeCooldown: 0,
    eligible: null as unknown as EligibleForInvite
})
const parameters = ref(new Array<ParameterObject>())

function loggedIn(userName: string) {
    state.userName = userName
    reloadParameters()
    getEligible()
}

function reloadParameters() {
    fetchw('/parameter', {
        method: 'GET'
    }).then(async resp => {
        const json = await resp.json()
        parameters.value = json
    })
    getEligible()
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
    const idxA = parameters.value.findIndex(param => param.parameterId == idA)
    const idxB = parameters.value.findIndex(param => param.parameterId == idB)

    const temp = parameters.value[idxA]
    parameters.value[idxA] = parameters.value[idxB]
    parameters.value[idxB] = temp

    const ids: Array<number> = []

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
    }).then(reloadParameters)
}

function getEligible() {
    fetchw('/invite/eligible').then(async resp => {
        state.eligible = await resp.json()
    })
}

</script>

<template>
    <AccountMenu v-if="state.userName" :name="state.userName" @logged-out="loggedOut" />
    <div class="container overflow-hidden">
        <template v-if="state.userName">
            <div class="row mt-1">
                <div class="p-3 w-100 border bg-light rounded-3">
                    <div class="row">
                        <AvatarList @avatar-selected="avatar => state.avatar = avatar" @avatar-changed="getEligible" />
                    </div>
                </div>
            </div>
            <div class="row mt-1">
                <div class="p-3 w-100 border bg-light rounded-3">
                    <UserSettings />
                </div>
            </div>
            <div class="row mt-1">
                <div class="p-3 w-100 border bg-light rounded-3">
                    <div class="row">
                        <InviteList v-if="state.eligible" :eligible="state.eligible" />
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

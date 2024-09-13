<script setup lang='ts'>
import { defineProps, reactive, defineEmits } from 'vue'
import type Invite from '@/model/InviteObject'
import fetchw from '@/fetchWrapper'
import type ParameterObject from '@/model/ParameterObject'

const props = defineProps(['invite', 'avatarId', 'parameters'])
const state = reactive({
    parameterId: -1
})
const emit = defineEmits(['invite-changed'])

function updateInvite(invite: Invite) {

    fetchw('/invite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invite)
    }).then(resp => {
        emit('invite-changed')
    })
}

function addParameter(invite: Invite) {
    invite.parameterIds.push(state.parameterId)
    updateInvite(invite)
}

function getParamName(id: number) {
    return props.parameters.find((p: ParameterObject) => p.parameterId === id).name
}

function deleteInvite(invite: Invite) {
    fetchw('/invite', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: invite.url
        })
    }).then(resp => {
        emit('invite-changed')
    })
}

function copyInviteLink(invite: Invite) {
    window.navigator.clipboard.writeText(`${location.protocol}//${location.host}/nv/${invite.url}`)
}

function getExpiryDate(invite: Invite) {
    if (invite.expires == -1) {
        return 'Never expires'
    } else {
        let date = new Date(invite.expires)
        let formatted = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        return `Exp. ${formatted}`
    }
}

function getExpiryDateTime(invite: Invite) {
    if (invite.expires == -1) {
        return 'Never expires'
    } else {
        let date = new Date(invite.expires)
        let formattedDate = date.toLocaleDateString()
        let formattedTime = date.toLocaleTimeString()
        return `Expires ${formattedDate} ${formattedTime}`
    }
}

function getEligibleParams(invite: Invite) {
    return props.parameters.filter(
        (p: ParameterObject) =>
     p.requiresInvite == 'Y'
     && p.avatarVrcUuid == props.avatarId
     && !invite.parameterIds.includes(p.parameterId)
    )
}

function deleteParameter(invite: Invite, paramId: number) {
    invite.parameterIds.splice(invite.parameterIds.indexOf(paramId))
    updateInvite(invite)
}

</script>

<template>
    <div class="col-4 text-center">      
        <div class="p-3 border border-secondary rounded-3">
            <div class="input-group">
                <button type="button" class="btn btn-outline-primary copy-url-button" @click="() => copyInviteLink(invite)"><span>{{invite.url}}</span></button>
                <input class="form-control" type="text" :value="getExpiryDate(invite)" :title="getExpiryDateTime(invite)" readonly />
                <button type="button" class="btn btn-outline-primary" data-bs-toggle="collapse" :data-bs-target="`#editInvite${invite.url}`">Edit</button>
                <button type="button" class="btn btn-outline-danger" @click="() => deleteInvite(invite)">Delete</button>
            </div>
            <div class="collapse" :id="`editInvite${invite.url}`">
                <div class="row justify-content-center mt-1">
                    <div class="p-2 w-100">
                        <div class="row">
                            <div class="col-5">Select a parameter</div>
                            <div class="col-4"><select class="form-select" v-model="state.parameterId" name="inviteParameterName">
                                <option v-for="param in getEligibleParams(invite)" :value="param.parameterId">{{ param.name }}</option>
                            </select></div>
                            <div class="col-2"><button type="button" class="btn btn-primary" @click="() => addParameter(invite)">Add</button></div>
                        </div>
                        <ul class="mt-2 list-group">
                            <li v-for="paramId in invite.parameterIds" class="list-group-item">
                                <div class="input-group">
                                    <input class="form-control" type="text" readonly :value="getParamName(paramId)" />
                                    <button type="button" class="btn btn-outline-danger" @click="() => deleteParameter(invite, paramId)">Delete</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
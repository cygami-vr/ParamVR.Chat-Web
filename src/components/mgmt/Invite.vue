<script setup lang='ts'>
import { reactive } from 'vue'
import { type InviteObject, type InviteParameter, type InviteAvatarChange } from '@/model/InviteObject'
import fetchw from '@/fetchWrapper'

const props = defineProps(['invite', 'avatarId', 'parameters', 'eligible'])
const state = reactive({
    parameterId: -1, avatarId: -1
})
const emit = defineEmits(['invite-changed'])

function updateInvite(invite: InviteObject) {

    fetchw('/invite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invite)
    }).then(() => {
        emit('invite-changed')
    })
}

function addParameter(invite: InviteObject) {
    invite.parameters.push({parameterId: state.parameterId} as InviteParameter)
    updateInvite(invite)
}

function addAvatarChange(invite: InviteObject) {
    invite.changeableAvatars.push({avatarId: state.avatarId} as InviteAvatarChange)
    updateInvite(invite)
}

function deleteInvite(invite: InviteObject) {
    fetchw('/invite', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: invite.url
        })
    }).then(() => {
        emit('invite-changed')
    })
}

function copyInviteLink(invite: InviteObject) {
    window.navigator.clipboard.writeText(`${location.protocol}//${location.host}/nv/${invite.url}`)
}

function getExpiryDate(invite: InviteObject) {
    if (invite.expires == -1) {
        return 'Never expires'
    } else {
        const date = new Date(invite.expires)
        const formatted = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        return `Exp. ${formatted}`
    }
}

function getExpiryDateTime(invite: InviteObject) {
    if (invite.expires == -1) {
        return 'Never expires'
    } else {
        const date = new Date(invite.expires)
        const formattedDate = date.toLocaleDateString()
        const formattedTime = date.toLocaleTimeString()
        return `Expires ${formattedDate} ${formattedTime}`
    }
}

function getEligibleParams(invite: InviteObject) {
    return props.eligible.parameters.filter( (p: InviteParameter) =>
      !invite.parameters.some(p2 => p.parameterId == p2.parameterId)
    )
}

function getEligibleAvatarChanges(invite: InviteObject) {
    return props.eligible.changeableAvatars.filter( (a: InviteAvatarChange) =>
      !invite.changeableAvatars.some(a2 => a.avatarId == a2.avatarId)
    )
}

function deleteParameter(invite: InviteObject, paramId: number) {
    invite.parameters = invite.parameters.filter(param => param.parameterId != paramId)
    updateInvite(invite)
}

function deleteAvatarChange(invite: InviteObject, avaId: number) {
    invite.changeableAvatars = invite.changeableAvatars.filter(ava => ava.avatarId != avaId)
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
                                <option :key="`eligibleParam ${invite.id} ${param.parameterId}`" v-for="param in getEligibleParams(invite)"
                                    :value="param.parameterId">{{ `${param.avatarName} > ${param.parameterName}` }}</option>
                            </select></div>
                            <div class="col-2"><button type="button" class="btn btn-primary" @click="() => addParameter(invite)">Add</button></div>
                        </div>
                        <ul class="mt-2 list-group">
                            <li :key="`inviteParam ${invite.id} ${param.parameterId}`" v-for="param in invite.parameters" class="list-group-item">
                                <div class="input-group">
                                    <input class="form-control" type="text" readonly :value="`${param.avatarName} > ${param.parameterName}`" />
                                    <button type="button" class="btn btn-outline-danger" @click="() => deleteParameter(invite, param.parameterId)">Delete</button>
                                </div>
                            </li>
                        </ul>
                        <div class="mt-2 row">
                            <div class="col-5">Select an avatar</div>
                            <div class="col-4"><select class="form-select" v-model="state.avatarId" name="inviteAvatarName">
                                <option :key="`eligibleAvatar ${invite.id} ${avatar.avatarId}`" v-for="avatar in getEligibleAvatarChanges(invite)"
                                    :value="avatar.avatarId">{{ avatar.avatarName }}</option>
                            </select></div>
                            <div class="col-2"><button type="button" class="btn btn-primary" @click="() => addAvatarChange(invite)">Add</button></div>
                        </div>
                        <ul class="mt-2 list-group">
                            <li :key="`inviteAva ${invite.id} ${ava.avatarId}`" v-for="ava in invite.changeableAvatars" class="list-group-item">
                                <div class="input-group">
                                    <input class="form-control" type="text" readonly :value=ava.avatarName />
                                    <button type="button" class="btn btn-outline-danger" @click="() => deleteAvatarChange(invite, ava.avatarId)">Delete</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

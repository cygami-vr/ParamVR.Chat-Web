<script setup lang='ts'>
import { reactive, ref, computed } from 'vue'
import type Invite from '@/model/Invite'
import type ParameterObject from '@/model/ParameterObject'
import fetchw from '@/fetchWrapper'

const props = defineProps(['avatarId', 'parameters'])
const state = reactive({
    neverExpires: false, expiryDateTime: '',
    parameterName: ''
})
const invites = ref(new Array<Invite>())

function getInvites() {
    fetchw('/invite', {
        method: 'GET'
    }).then(async resp => {
        let json = await resp.json()
        invites.value = json
    })
}
getInvites()

function createInvite() {

    let expires

    if (state.neverExpires) {
        expires = -1
    } else {

        if (!state.expiryDateTime) {
            alert('You must select a date/time')
            return
        }
        expires = new Date(state.expiryDateTime).getTime()

    }

    fetchw('/invite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            avatarId: props.avatarId,
            expires
        })
    }).then(resp => {
        getInvites()
    })
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
        getInvites()
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

const activeInvites = computed(() => {
    return invites.value.filter((i: Invite) => i.avatarId == props.avatarId)
})

const inviteRequiredParameters = computed(() => {
    return props.parameters.filter((p: ParameterObject) => p.requiresInvite == 'Y')
})

function addParameter(invite: Invite) {
    invite.parameters.push(state.parameterName)
    updateInvite(invite)
}

function deleteParameter(invite: Invite, param: string) {
    invite.parameters.splice(invite.parameters.indexOf(param))
    updateInvite(invite)
}

function updateInvite(invite: Invite) {

    fetchw('/invite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invite)
    }).then(resp => {
        getInvites()
    })
}

</script>

<template>
    <div class="row h5"><div class="col">Invites</div></div>
    <div class="row align-items-center">
        <div class="col-2">
            <div class="form-check">
                <input class="form-check-input" :checked="false" id="neverExpires" v-model="state.neverExpires" name="neverExpires" type="checkbox" />
                <label class="form-check-label" for="neverExpires">Never Expires</label>
            </div>
        </div>
        <div v-if="!state.neverExpires" class="col-2"><input class="form-control" v-model="state.expiryDateTime" name="expiryDateTime" type="datetime-local" /></div>
        <div class="col-2"><button type="button" class="btn btn-primary" @click="createInvite">Create Invite</button></div>
        <div class="row gy-3 justify-content-center mt-1">
            <div class="col-4 text-center" v-for="invite in activeInvites" :key="invite.url">
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
                                    <div class="col-4"><select class="form-select" v-model="state.parameterName" name="inviteParameterName">
                                        <option v-for="param in inviteRequiredParameters" :value="param.name">{{ param.name }}</option>
                                    </select></div>
                                    <div class="col-2"><button type="button" class="btn btn-primary" @click="() => addParameter(invite)">Add</button></div>
                                </div>
                                <ul class="mt-2 list-group">
                                    <li v-for="param in invite.parameters" class="list-group-item">
                                        <div class="input-group">
                                            <input class="form-control" type="text" readonly :value="param" />
                                            <button type="button" class="btn btn-outline-danger" @click="() => deleteParameter(invite, param)">Delete</button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

.copy-url-button:hover:before {
    content: "Click to copy";
}

.copy-url-button:hover span {
    display: none;
}

</style>
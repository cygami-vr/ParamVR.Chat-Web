<script setup lang='ts'>
import { reactive, ref } from 'vue'
import ImageInput from '@/components/mgmt/ImageInput.vue'
import Field from '@/components/mgmt/Field.vue'
import fetchw from '@/fetchWrapper'

class Avatar {

    id: number
    vrcUuid: string
    name: string
    image: string

    constructor(id: number, vrcUuid: string, name: string, image: string) {
        this.id = id
        this.vrcUuid = vrcUuid
        this.name = name
        this.image = image
    }
}

const state = reactive({adding: false, name: '', vrcUuid: '', error: ''})
const avatars = ref(new Array<Avatar>())
defineEmits(['avatar-selected'])

function getAvatars() {
    fetchw('/avatar', {
        method: 'GET'
    }).then(async resp => {
        if (resp.ok) {
            let json = await resp.json()
            avatars.value = json
        } else {
            state.error = `Error: ${resp.statusText}`
        }
    }).catch(err => {
        state.error = `Error: ${err}`
    })
}
getAvatars()

function addAvatar() {
    if (state.adding) {
        fetchw('/avatar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: state.name,
                vrcUuid: state.vrcUuid
            })
        }).then(resp => {
            if (resp.ok) {
                state.adding = false
                getAvatars()
            } else {
                state.error = `Error: ${resp.statusText}`
            }
        }).catch(err => {
            state.error = `Error: ${err}`
        })
    } else {
        state.adding = true
    }
}

function deleteAvatar(id: number) {
    fetchw('/avatar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    }).then(resp => {
        if (resp.ok) {
            getAvatars()
        } else {
            state.error = `Error: ${resp.statusText}`
        }
    }).catch(err => {
        state.error = `Error: ${err}`
    })
}

</script>

<template>
    <div id="avatarList">
        <Header :msg="state.error" @ack="() => state.error = ''" />
        <template v-if="state.adding">
            <input name="name" type="text" v-model="state.name" placeholder="name" />
            <input name="vrcUuid" type="text" v-model="state.vrcUuid" placeholder="VRC UUID" />
        </template>
        <button @click="addAvatar">Add avatar</button>

        <fieldset>
            <legend>Active avatar</legend>
            <div id="avatars">
                <div v-for="avatar in avatars" :key="avatar.id">
                    <img class="avatar" :src="avatar.image" />
                    <input name="avatar" type="radio" :id="avatar.vrcUuid" @change="evt => $emit('avatar-selected', avatar.id)" />
                    <label :for="avatar.vrcUuid">
                        <Field :value="avatar.name" />
                        <Field :value="avatar.vrcUuid" />
                    </label>
                    <ImageInput url="/avatar/image" idProperty="avatarId" :idValue="avatar.id" @image-uploaded="getAvatars" />
                    <span title="Delete avatar" class="clickable delete-button material-icons" @click="() => deleteAvatar(avatar.id)">delete</span>
                </div>
            </div>
        </fieldset>
    </div>
</template>

<style>
#avatarList {
    margin: auto;
    width: 80%;
}
#avatars div:nth-child(odd) {
    background-color: rgba(200, 200, 200, 0.25);
    border-radius: 10px;
}
</style>

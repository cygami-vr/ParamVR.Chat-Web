<script setup lang="ts">
import { reactive, ref } from 'vue'
import Field from '@/components/mgmt/Field.vue'
import ImageInput from '@/components/mgmt/ImageInput.vue'
import ThemedButton from '@/components/theme/ThemedButton.vue'
import ThemedCheckbox from '@/components/theme/ThemedCheckbox.vue'
import ThemedRadioButton from '@/components/theme/ThemedRadioButton.vue'
import fetchw from '@/fetchWrapper'
import type Avatar from '@/model/Avatar'

const state = reactive({
  name: '',
  vrcUuid: '',
  activeAvatar: null as unknown as Avatar,
  deletingAvatar: null as unknown as Avatar,
})
const avatars = ref(new Array<Avatar>())
const emit = defineEmits(['avatar-selected', 'avatar-changed'])

function getAvatars() {
  fetchw('/avatar', {
    method: 'GET',
  }).then(async (resp) => {
    const json = await resp.json()
    avatars.value = json
    if (state.activeAvatar) {
      state.activeAvatar = json.find((avatar: Avatar) => {
        return avatar.id == state.activeAvatar.id
      })
    }
    emit('avatar-changed')
  })
}
getAvatars()

function addAvatar() {
  fetchw('/avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: state.name,
      vrcUuid: state.vrcUuid,
    }),
  }).then(getAvatars)
}

function deleteAvatar() {
  fetchw('/avatar', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: state.deletingAvatar.id }),
  }).then(getAvatars)
}

function updateAvatarName(avatar: Avatar, name: string) {
  const newValue = { ...avatar }
  newValue.name = name
  updateAvatar(newValue)
}

function updateAvatarVrcUuid(avatar: Avatar, vrcUuid: string) {
  const newValue = { ...avatar }
  newValue.vrcUuid = vrcUuid
  updateAvatar(newValue)
}

function updateAvatarTitle(avatar: Avatar, title: string) {
  const newValue = { ...avatar }
  newValue.title = title
  updateAvatar(newValue)
}

function updateAvatarAllowChange(avatar: Avatar, evt: Event) {
  if (evt && evt.target && evt.target instanceof HTMLInputElement) {
    const newValue = { ...avatar }
    newValue.allowChange = evt.target.checked ? 'Y' : 'N'
    updateAvatar(newValue)
  }
}

function updateAvatarChangeRequiresInvite(avatar: Avatar, evt: Event) {
  if (evt && evt.target && evt.target instanceof HTMLInputElement) {
    const newValue = { ...avatar }
    newValue.changeRequiresInvite = evt.target.checked ? 'Y' : 'N'
    updateAvatar(newValue)
  }
}

function updateAvatar(avatar: Avatar) {
  fetchw('/avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(avatar),
  }).then(getAvatars)
}

function onAvatarSelected(avatar: Avatar) {
  emit('avatar-selected', avatar)
  state.activeAvatar = avatar
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12 h5 text-body">Add an avatar</div>
      <div class="col-5">
        <input
          name="name"
          type="text"
          v-model="state.name"
          placeholder="name"
          class="form-control"
        />
      </div>
      <div class="col-5">
        <input
          name="vrcUuid"
          type="text"
          v-model="state.vrcUuid"
          placeholder="VRC Blueprint ID"
          class="form-control"
        />
      </div>
      <div class="col-2">
        <ThemedButton @click="addAvatar">Add Avatar</ThemedButton>
      </div>
    </div>
    <div class="h5 mt-1">Avatars</div>
    <div class="text-body" v-if="avatars.length == 0">
      You have no avatars. Create one to get started.
    </div>
    <div class="input-group mb-2" v-for="avatar in avatars" :key="avatar.id">
      <div class="input-group-text">
        <ThemedRadioButton
          defaultClass="form-check-input mt-0"
          name="avatarList"
          @change="(evt: Event) => onAvatarSelected(avatar)"
        />
      </div>

      <Field
        :value="avatar.name"
        :editable="true"
        @change="(name) => updateAvatarName(avatar, name)"
        label="Avatar name"
      />
      <Field
        :value="avatar.vrcUuid"
        :editable="true"
        @change="(vrcUuid) => updateAvatarVrcUuid(avatar, vrcUuid)"
        label="VRC Blueprint ID"
      />
      <Field
        :value="avatar.title"
        :editable="true"
        @change="(title) => updateAvatarTitle(avatar, title)"
        label="Custom title"
      />
      <div class="input-group-text">
        <div class="form-check">
          <ThemedCheckbox
            :checked="avatar.allowChange == 'Y'"
            :id="`allowChangeCheckbox${avatar.id}`"
            @change="(evt: Event) => updateAvatarAllowChange(avatar, evt)"
          />
          <label class="form-check-label" :for="`allowChangeCheckbox${avatar.id}`"
            >Allow changing</label
          >
        </div>
      </div>
      <div class="input-group-text">
        <div class="form-check">
          <ThemedCheckbox
            :checked="avatar.changeRequiresInvite == 'Y'"
            :disabled="avatar.allowChange == 'N'"
            :id="`changeRequiresInviteCheckbox${avatar.id}`"
            @change="(evt: Event) => updateAvatarChangeRequiresInvite(avatar, evt)"
          />
          <label class="form-check-label" :for="`changeRequiresInviteCheckbox${avatar.id}`"
            >Change requires invite</label
          >
        </div>
      </div>

      <button
        type="button"
        class="btn btn-outline-danger"
        data-bs-toggle="modal"
        data-bs-target="#deleteAvatar-confirm"
        @click="() => (state.deletingAvatar = avatar)"
      >
        Delete
      </button>
    </div>
    <template v-if="state.activeAvatar">
      <div class="h5">Avatar image</div>
      <div v-if="state.activeAvatar.image" class="row justify-content-center">
        <div class="col-4 text-center">
          <img class="img-thumbnail" :src="state.activeAvatar.image" />
        </div>
      </div>
      <div class="input-group mb-2 mt-2">
        <ImageInput
          url="/avatar/image"
          idProperty="avatarId"
          :idValue="state.activeAvatar.id"
          @image-changed="getAvatars"
        />
      </div>
      <div>
        Note: The image will be scaled to have a maximum width/height of 512, preserving aspect
        ratio.
      </div>
    </template>
  </div>
  <div id="deleteAvatar-confirm" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-body">Really delete this avatar?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body">
          <div v-if="state.deletingAvatar" class="row g-3 justify-content-start">
            <div class="col-12 text-body">Avatar name: {{ state.deletingAvatar.name }}</div>
            <div class="col-12 text-body">
              Avatar VRC Blueprint ID: {{ state.deletingAvatar.vrcUuid }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="row">
            <div class="col">
              <button
                type="button"
                class="btn btn-primary"
                @click="deleteAvatar"
                data-bs-dismiss="modal"
              >
                Yes
              </button>
            </div>
            <div class="col">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

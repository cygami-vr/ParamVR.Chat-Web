<script setup lang="ts">
import { reactive, ref } from 'vue'
import { type InviteObject } from '@/model/InviteObject'
import Invite from '@/components/mgmt/Invite.vue'
import fetchw from '@/fetchWrapper'

const props = defineProps(['eligible'])
const state = reactive({
  neverExpires: false,
  expiryDateTime: '',
})
const invites = ref(new Array<InviteObject>())

function getInvites() {
  fetchw('/invite', {
    method: 'GET',
  }).then(async (resp) => {
    const json = await resp.json()
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
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expires }),
  }).then(() => {
    getInvites()
  })
}
</script>

<template>
  <div class="row h5"><div class="col">Invites</div></div>
  <div class="row align-items-center">
    <div class="col-2">
      <div class="form-check">
        <input
          class="form-check-input"
          :checked="false"
          id="neverExpires"
          v-model="state.neverExpires"
          name="neverExpires"
          type="checkbox"
        />
        <label class="form-check-label" for="neverExpires">Never Expires</label>
      </div>
    </div>
    <div v-if="!state.neverExpires" class="col-2">
      <input
        class="form-control"
        v-model="state.expiryDateTime"
        name="expiryDateTime"
        type="datetime-local"
      />
    </div>
    <div class="col-2">
      <button type="button" class="btn btn-primary" @click="createInvite">Create Invite</button>
    </div>
    <div class="row gy-3 justify-content-center mt-1">
      <Invite
        class="col-4 text-center"
        v-for="invite in invites"
        :key="invite.url"
        @invite-changed="getInvites"
        :invite="invite"
        :eligible="props.eligible"
      />
    </div>
  </div>
</template>

<style>
.copy-url-button:hover:before {
  content: 'Click to copy';
}

.copy-url-button:hover span {
  display: none;
}
</style>

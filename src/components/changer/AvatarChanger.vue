<script setup lang="ts">
import { AvatarChange } from '@/model/WebSocketPayloads'
import ThemedButton from '@/components/theme/ThemedButton.vue'
import AvatarLockButton from './AvatarLockButton.vue'

const props = defineProps([
  'changeAvatarCooldownActive',
  'changeableAvatars',
  'allowAvatarLock',
  'avatarLocked',
  'avatarLockedByOther',
])
const emit = defineEmits(['avatar-change', 'avatar-lock'])

function changeAvatar(vrcUuid: string) {
  console.log(`Scheduling avatar change to ${vrcUuid}`)
  emit('avatar-change', new AvatarChange(vrcUuid))
}

function getClasses() {
  let classes = ''
  if (props.changeAvatarCooldownActive) {
    classes += ' btn-outline-primary'
  } else {
    classes += ' btn-primary'
  }
  return classes
}

function getTitle() {
  if (props.avatarLocked) {
    return 'Avatar locked'
  } else if (props.changeAvatarCooldownActive) {
    return 'On cooldown'
  }
}
</script>

<template>
  <div class="row gy-3 justify-content-center mt-1" v-if="changeableAvatars.length > 0">
    <div class="col-10 col-md-8 col-lg-6 p-3 text-center border bg-body rounded-3">
      <span class="text-body h5">Switch to another avatar</span>
      <span class="material-icons">
        <AvatarLockButton
          v-if="allowAvatarLock"
          :avatar-locked="avatarLocked"
          :avatar-locked-by-other="avatarLockedByOther"
          @lock="emit('avatar-lock')"
      /></span>
      <div class="row align-items-center justify-content-between mt-2">
        <div
          class="col-3 flex-grow-1 py-1"
          :key="ava.id"
          v-for="ava in changeableAvatars"
          :title="getTitle()"
        >
          <div class="text-center mb-2" v-if="ava.image">
            <img class="rounded-3 img-fluid change-avatar-thumbnail" :src="ava.image" />
          </div>
          <ThemedButton
            @click="() => changeAvatar(ava.vrcUuid)"
            :disabled="changeAvatarCooldownActive || avatarLocked"
            :defaultClass="getClasses()"
          >
            {{ ava.name }}
          </ThemedButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.change-avatar-thumbnail {
  max-height: 128px;
}
</style>

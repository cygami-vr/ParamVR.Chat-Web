<script setup lang="ts">
import { AvatarChange } from '@/model/WebSocketPayloads'
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()
const props = defineProps(['changeAvatarCooldownActive', 'changeableAvatars'])
const emit = defineEmits(['avatar-change'])

function changeAvatar(vrcUuid: string) {
  console.log(`Scheduling avatar change to ${vrcUuid}`)
  emit('avatar-change', new AvatarChange(vrcUuid))
}

function getClasses() {
  let classes = 'btn'
  if (props.changeAvatarCooldownActive) {
    classes += ' btn-outline-primary'
    if (theme.colorPrimary) {
      classes += ' color-theme border-primary-theme'
    }
  } else {
    classes += ' btn-primary'
    if (theme.colorPrimary) {
      classes += ' bg-primary-theme border-primary-theme'
    }
  }

  if (theme.colorPrimary) {
    classes += ' theme-focus'
  }

  return classes
}
</script>

<template>
  <div class="row gy-3 justify-content-center mt-1" v-if="changeableAvatars.length > 0">
    <div class="p-3 w-50 text-center border bg-light rounded-3 h5">
      Switch to another avatar
      <div class="row align-items-center justify-content-between mt-2">
        <div class="col-3 flex-grow-1 py-1" :key="ava.id" v-for="ava in changeableAvatars">
          <div class="text-center mb-2" v-if="ava.image">
            <img class="rounded-3 changeAvatarThumbnail" :src="ava.image" />
          </div>
          <button
            type="button"
            @click="() => changeAvatar(ava.vrcUuid)"
            :disabled="changeAvatarCooldownActive"
            :class="getClasses()"
          >
            {{ ava.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

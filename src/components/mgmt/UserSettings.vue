<script setup lang="ts">
import { reactive } from 'vue'
import Field from '@/components/mgmt/Field.vue'
import fetchw from '@/fetchWrapper'
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()

interface Settings {
  avatarChangeCooldown: number
  colorPrimary: string
}

const state = reactive({ settings: null as unknown as Settings })

function getSettings() {
  fetchw('/settings', {
    method: 'GET',
  }).then(async (resp) => {
    state.settings = await resp.json()
    theme.setColorPrimary(state.settings.colorPrimary)
  })
}
getSettings()

function updateAvatarChangeCooldown(value: string) {
  state.settings.avatarChangeCooldown = Number(value)
  if (
    isNaN(state.settings.avatarChangeCooldown) ||
    !Number.isInteger(state.settings.avatarChangeCooldown)
  ) {
    alert('Cooldown must be an integer')
    return
  }
  fetchw('/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state.settings),
  })
}

function updatePrimaryColor(value: string) {
  state.settings.colorPrimary = value
  const empty = value != null && value.length == 0
  if (!empty && !/^[0-9a-fA-F]{6}$/.test(state.settings.colorPrimary)) {
    alert('Color must be a hexadecimal color value, six characters in length.')
    return
  }
  theme.setColorPrimary(value)
  fetchw('/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state.settings),
  })
}
</script>

<template>
  <div class="col-6" v-if="state.settings">
    <div class="h5 mb-2">Other Settings</div>
    <div class="row align-items-center text-start mt-1">
      <div class="col-6">Avatar changing cooldown (seconds):</div>
      <div class="col-6">
        <div class="input-group">
          <Field
            :editable="true"
            :value="state.settings.avatarChangeCooldown"
            @change="updateAvatarChangeCooldown"
          />
        </div>
      </div>
    </div>
    <div class="row align-items-center text-start mt-1">
      <div class="col-6">Primary color (hexadecimal):</div>
      <div class="col-6">
        <div class="input-group">
          <Field
            :editable="true"
            :value="state.settings.colorPrimary"
            @change="updatePrimaryColor"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

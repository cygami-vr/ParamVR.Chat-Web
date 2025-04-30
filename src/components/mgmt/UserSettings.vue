<script setup lang="ts">
import { reactive } from 'vue'
import Field from '@/components/mgmt/Field.vue'
import fetchw from '@/fetchWrapper'
import { useThemeStore } from '@/stores/themeStore.ts'
import type Settings from '@/model/Settings.ts'

const theme = useThemeStore()

const state = reactive({ settings: null as unknown as Settings })

function getSettings() {
  fetchw('/settings', {
    method: 'GET',
  }).then(async (resp) => {
    state.settings = await resp.json()
    theme.setColors(state.settings)
  })
}
getSettings()

function updateSettings() {
  fetchw('/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state.settings),
  })
}

function updateAvatarChangeCooldown(value: string) {
  state.settings.avatarChangeCooldown = Number(value)
  if (
    isNaN(state.settings.avatarChangeCooldown) ||
    !Number.isInteger(state.settings.avatarChangeCooldown)
  ) {
    alert('Cooldown must be an integer')
    return
  }
  updateSettings()
}

function validateColor(color: string): boolean {
  const empty = !color || color.length == 0
  if (!empty && !/^[0-9a-fA-F]{6}$/.test(color)) {
    alert('Color must be a hexadecimal color value, six characters in length.')
    return false
  }
  return true
}

function updatePrimaryColor(value: string) {
  if (!validateColor(value)) {
    return
  }
  state.settings.colorPrimary = value
  theme.setColors(state.settings)
  updateSettings()
}

function updateSecondaryColor(value: string) {
  if (!validateColor(value)) {
    return
  }
  state.settings.colorSecondary = value
  theme.setColors(state.settings)
  updateSettings()
}

function updateDarkModePrimaryColor(value: string) {
  if (!validateColor(value)) {
    return
  }
  state.settings.darkModeColorPrimary = value
  theme.setColors(state.settings)
  updateSettings()
}

function updateDarkModeSecondaryColor(value: string) {
  if (!validateColor(value)) {
    return
  }
  state.settings.darkModeColorSecondary = value
  theme.setColors(state.settings)
  updateSettings()
}
</script>

<template>
  <div class="col-6" v-if="state.settings">
    <div class="h5 mb-2 text-body">Other Settings</div>
    <div class="row align-items-center text-start mt-1">
      <div class="col-6 text-body">Avatar changing cooldown (seconds):</div>
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
    <div class="h6 mb-2 mt-2 text-body">Color Theme Settings (hexadecimal)</div>
    <div class="row align-items-center text-start mt-1">
      <div class="col-6 text-body">Light theme primary color:</div>
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
    <div class="row align-items-center text-start mt-1">
      <div class="col-6 text-body">Dark theme primary color:</div>
      <div class="col-6">
        <div class="input-group">
          <Field
            :editable="true"
            :value="state.settings.darkModeColorPrimary"
            @change="updateDarkModePrimaryColor"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

<script setup lang="ts">
import { reactive } from 'vue'
import Field from '@/components/mgmt/Field.vue'
import fetchw from '@/fetchWrapper'
import { useThemeStore } from '@/stores/themeStore'
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

function validateEyeHeight(min: string, max: string): boolean {
  const minVal = Number(min)
  const maxVal = Number(max)
  if (isNaN(minVal) || isNaN(maxVal)) {
    alert('Avatar heights must be numbers')
    return false
  }
  if (minVal < 0 || maxVal < 0) {
    alert('Avatar heights must be non-negative')
    return false
  }
  if (minVal > maxVal) {
    alert('Minimum avatar height cannot be greater than maximum avatar height')
    return false
  }
  if (minVal < 0.01) {
    alert('Minimum avatar height must be at least 0.01 meters')
    return false
  }
  if (maxVal > 10000) {
    alert('Maximum avatar height must be less than 10,000 meters')
    return false
  }
  return true
}

function updateMinEyeHeight(value: string) {
  if (validateEyeHeight(value, state.settings.maxEyeHeight.toString())) {
    state.settings.minEyeHeight = Number(value)
    updateSettings()
  }
}

function updateMaxEyeHeight(value: string) {
  if (validateEyeHeight(state.settings.minEyeHeight.toString(), value)) {
    state.settings.maxEyeHeight = Number(value)
    updateSettings()
  }
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
    <div class="row align-items-center text-start mt-1">
      <div class="col-6 text-body">Minimum avatar (eye) height (meters):</div>
      <div class="col-6">
        <div class="input-group">
          <Field
            :editable="true"
            :value="state.settings.minEyeHeight"
            @change="updateMinEyeHeight"
          />
        </div>
      </div>
    </div>
    <div class="row align-items-center text-start mt-1">
      <div class="col-6 text-body">Maximum avatar (eye) height (meters):</div>
      <div class="col-6">
        <div class="input-group">
          <Field
            :editable="true"
            :value="state.settings.maxEyeHeight"
            @change="updateMaxEyeHeight"
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

<script setup lang="ts">
import { ref, watch } from 'vue'
import LockButton from '@/components/changer/LockButton.vue'
import ThemedCheckbox from '@/components/theme/ThemedCheckbox.vue'

const props = defineProps(['param'])
const emit = defineEmits(['change', 'lock'])
const input = ref(null as unknown as HTMLInputElement)

function onChange(evt: Event) {
  if (evt && evt.target && evt.target instanceof HTMLInputElement) {
    emit('change', props.param.name, evt.target.checked)
  }
}

function isTrue(val: boolean | string) {
  return val === true || val === 'true'
}

// The "checked" attribute can only control the initial value, so we need to update it this way.
watch(
  () => props.param.value,
  (after) => {
    input.value.checked = isTrue(after)
  },
)
</script>

<template>
  <div class="text-center mb-2" v-if="param.image">
    <img :src="param.image" class="rounded-3" />
  </div>
  <div class="row align-items-center justify-content-between">
    <div class="col-4 flex-grow-1">
      <label class="form-check form-switch" :for="param.name">
        <ThemedCheckbox
          :disabled="param.locked"
          :checked="isTrue(param.value)"
          :name="param.name"
          :id="param.name"
          @change="onChange"
          ref="input"
        />
        <div class="form-check-label h5 text-break" :title="param.description">
          {{ param.description }}
        </div>
      </label>
    </div>
    <LockButton :param="param" @lock="$emit('lock')" />
  </div>
</template>

<style></style>

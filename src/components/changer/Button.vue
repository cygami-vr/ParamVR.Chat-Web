<script setup lang="ts">
import LockButton from '@/components/changer/LockButton.vue'
import ThemedButton from '@/components/theme/ThemedButton.vue'

defineProps(['param'])
defineEmits(['click', 'lock', 'release'])
</script>

<template>
  <div class="text-center mb-2" v-if="param.image">
    <img :src="param.image" class="rounded-3" />
  </div>
  <div class="row align-items-center justify-content-between">
    <div class="col-4 flex-grow-1">
      <ThemedButton
        :disabled="param.locked"
        @mousedown="() => $emit('click', param.name)"
        @click="() => $emit('release', param.name)"
      >
        {{ param.description }}
      </ThemedButton>
    </div>
    <LockButton :param="param" @lock="$emit('lock')" />
  </div>
</template>

<style></style>

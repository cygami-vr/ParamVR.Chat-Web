<script setup lang='ts'>

const props = defineProps(['param'])
const emit = defineEmits(['change', 'lock'])

function onChange(evt: Event) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement) {
        emit('change', props.param.name, evt.target.value)
    }
}

</script>

<template>
    <div class="row">
        <div v-if="param.lockable == 'Y'" class="col-4"></div>
        <div class="col-4 flex-grow-1 h5">{{param.description}}</div>
        <div v-if="param.lockable == 'Y'" class="col-4 text-end">
            <button type="button" :class="`btn btn-primary-outline material-icons text-center
             ${param.locked ? (param.lockKey != null ? 'text-primary' : 'text-danger') : 'text-muted'}`" @click="$emit('lock')">
                {{param.locked ? 'lock' : 'lock_open'}}
            </button>
        </div>
    </div>
    <div class="text-center mb-2" v-if="param.image"><img :src="param.image" class="rounded-3" /></div>
    <div class="lov-scroll">
        <template v-for="value in param.values" :key="value.value">
            <div class="form-check text-start">
                <label :for="param.name + value.value" class="row justify-content-center">
                    <div class="col-1">
                      <input class="form-check-input" :disabled="param.locked" type="radio" :id="param.name + value.value"
                        :name="param.name" @change="onChange" :value="value.value" :checked="props.param.value == value.value" />
                    </div>
                    <div class="col-9 form-check-label text-center">{{value.description}}</div>
                    <div class="col-1" />
                </label>
            </div>
        </template>
    </div>
</template>

<style>
.lov-scroll {
    max-height: 150px;
    overflow-y: auto;
    overflow-x: clip;
}
</style>

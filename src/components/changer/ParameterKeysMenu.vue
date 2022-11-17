<script setup lang='ts'>
import { reactive } from 'vue'
import AboutButton from '@/components/AboutButton.vue'

const state = reactive({
    parameterKeys: (localStorage.getItem('parameterKeys') || '').split(',').filter(s => s.length > 0),
    parameterKey: ''
})
const emit = defineEmits(['change'])

function addParameterKey() {
    state.parameterKeys.push(state.parameterKey)
    save()
    state.parameterKey = ''
    emit('change')
}

function deleteParameterKey(key: string) {
    let idx = state.parameterKeys.indexOf(key)
    state.parameterKeys.splice(idx, 1)
    save()
}

function save() {
    localStorage.setItem('parameterKeys', state.parameterKeys.toString())
}

</script>

<template>
    <div class="fixed-top">
        <div class="float-end text-end">
            <div class="input-group float-end mt-1 me-1">
                <AboutButton />
                <button class="d-none d-lg-block btn btn-secondary" type="button" data-bs-toggle="modal" data-bs-target="#paramKeys">
                    Parameter passwords
                </button>
            </div>
        </div>
    </div>
    <div id="paramKeys" class="modal fade" tabindex="-1" aria-labelledby="paramKeysLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="paramKeysLabel">Parameter passwords</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col">
                            You can unlock hidden parameters if you have the correct parameter password.
                            Please enter any of these passwords here.
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col input-group">
                            <input type="text" class="form-control" v-model="state.parameterKey" placeholder="parameter password" />
                            <button type="button" @click="addParameterKey" class="btn btn-primary">Add password</button>
                        </div>
                    </div>
                    <ul class="list-group mt-3">
                        <li v-for="key in state.parameterKeys" :key="key" class="list-group-item">
                            <span>{{key}}</span>
                            <button type="button" class="btn-close float-end" @click="() => deleteParameterKey(key)" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
</style>

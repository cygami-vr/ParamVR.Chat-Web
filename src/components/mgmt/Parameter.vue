<script setup lang='ts'>
import { reactive, computed } from 'vue'
import Field from '@/components/mgmt/Field.vue'
import ImageInput from '@/components/mgmt/ImageInput.vue'
import fetchw from '@/fetchWrapper'

const state = reactive({ value: '' })
const props = defineProps(['parameter'])
const emit = defineEmits(['parameter-changed', 'drop'])

function changeParameter(url: string, method: string, body: any) {
    fetchw(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(resp => {
        emit('parameter-changed')
    })
}

function deleteParameter() {
    changeParameter('/parameter', 'DELETE', { parameterId: props.parameter.parameterId })
}

function addValue(parameterId: number) {

    if (!state.value) {
        alert('Value is required')
        return
    }

    changeParameter('/parameter/value', 'POST', {
        parameterId,
        value: state.value
    })

    state.value = ''
}

function updateParameter(prop: string, value: string) {
    const newParam = {...props.parameter}
    newParam[prop] = value
    changeParameter('/parameter', 'POST', newParam)
}

function deleteParameterValue(parameterId: number, value: string) {
    changeParameter('/parameter/value', 'DELETE', { parameterId, value })
}

function updateParameterValue(value: any, prop: string, newParamValue: string) {
    const newValue = {...value}
    newValue[prop] = newParamValue
    newValue.parameterId = props.parameter.parameterId
    changeParameter('/parameter/value', 'POST', newValue)
}

function dragStart(evt: DragEvent) {
    console.log('dragStart')
    if (evt.dataTransfer) {
        evt.dataTransfer.effectAllowed = 'move'
        evt.dataTransfer.dropEffect = 'move'
        evt.dataTransfer.setData('parameterId', props.parameter.parameterId)
        console.log('dataTransfer initialized')
    }
    return true
}

function dragOver(e: DragEvent) {
    console.log('dragOver')
}

function drop(evt: DragEvent) {
    console.log('drop')
    emit('drop', evt.dataTransfer?.getData('parameterId'), props.parameter.parameterId)
    evt.stopPropagation()
    return false
}

const typeString = computed(() => {
    switch (props.parameter.type) {
        case 1:
            return 'list of values'
        case 2:
            return 'toggle'
        case 3:
            return 'slider'
        case 4:
            return 'button'
        default:
            return 'unknown'
    }
})

const dataTypeString = computed(() => {
    switch (props.parameter.dataType) {
        case 1:
            return 'integer'
        case 2:
            return 'decimal'
        case 3:
            return 'boolean'
        default:
            return 'unknown'
    }
})

function onSavedChange(evt: Event) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement) {
        updateParameter('saved', evt.target.checked ? 'Y' : 'N')
    }
}

function onLockableChange(evt: Event) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement) {
        updateParameter('lockable', evt.target.checked ? 'Y' : 'N')
    }
}

function onRequiresInviteChange(evt: Event) {
    if (evt && evt.target && evt.target instanceof HTMLInputElement) {
        updateParameter('requiresInvite', evt.target.checked ? 'Y' : 'N')
    }
}

</script>

<template>
    <div class="col-6 text-center">
        <div class="p-3 border bg-light rounded-3">
            <div class="draggable" :draggable="true" @dragstart="e => dragStart(e)" @dragend="e => dragOver(e)" @drop="drop" @dragover.prevent @dragenter.prevent
                title="Click and drag to reorder your parameters">
                <span class="h5">{{parameter.name}}</span>{{` - ${typeString}, ${dataTypeString}`}}
            </div>
            <div class="row align-items-center text-start mt-1">
                <div class="col-3">Description:</div>
                <div class="col-9">
                    <div class="input-group">
                        <Field :editable="true" :value="parameter.description" @change="value => updateParameter('description', value)" label="description" />
                    </div>
                </div>
            </div>
            <div v-if="parameter.type != 4" class="row align-items-center text-start mt-1">
                <div class="col-3">Default value:</div>
                <div class="col-9">
                    <div class="input-group">
                        <Field :editable="true" :value="parameter.defaultValue" @change="value => updateParameter('defaultValue', value)" label="default value" />
                    </div>
                </div>
            </div>
            <template v-if="parameter.type == 3">
                <div class="row align-items-center text-start mt-1">
                    <div class="col-3">Min value:</div>
                    <div class="col-9">
                        <div class="input-group">
                            <Field :editable="true" :value="parameter.minValue" @change="value => updateParameter('minValue', value)" label="min value" />
                        </div>
                    </div>
                </div>
                <div class="row align-items-center text-start mt-1">
                    <div class="col-3">Max value:</div>
                    <div class="col-9">
                        <div class="input-group">
                            <Field :editable="true" :value="parameter.maxValue" @change="value => updateParameter('maxValue', value)" label="max value" />
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="parameter.type == 4">
                <div class="row align-items-center text-start mt-1">
                    <div class="col-3">Press value:</div>
                    <div class="col-9">
                        <div class="input-group">
                            <Field :editable="true" :value="parameter.pressValue" @change="value => updateParameter('pressValue', value)" label="press value" />
                        </div>
                    </div>
                </div>
                <div class="row align-items-center text-start mt-1">
                    <div class="col-3">Release value:</div>
                    <div class="col-9">
                        <div class="input-group">
                            <Field :editable="true" :value="parameter.defaultValue" @change="value => updateParameter('defaultValue', value)" label="release value" />
                        </div>
                    </div>
                </div>
                <div class="row align-items-center text-start mt-1">
                    <div class="col-3">Min press time (ms):</div>
                    <div class="col-9">
                        <div class="input-group">
                            <Field :editable="true" :value="parameter.minValue" @change="value => updateParameter('minValue', value)" label="min press time" />
                        </div>
                    </div>
                </div>
                <div class="row align-items-center text-start mt-1">
                    <div class="col-3">Max press time (ms):</div>
                    <div class="col-9">
                        <div class="input-group">
                            <Field :editable="true" :value="parameter.maxValue" @change="value => updateParameter('maxValue', value)" label="max press time" />
                        </div>
                    </div>
                </div>
            </template>
            <div class="row align-items-center ms-1 mt-2">
                <div class="col-3 form-check">
                    <input class="form-check-input" :checked="parameter.saved == 'Y'" type="checkbox"
                     :id="`savedCheckbox${parameter.parameterId}`" @change="evt => onSavedChange(evt)" />
                    <label class="form-check-label" :for="`savedCheckbox${parameter.parameterId}`">Is saved</label>
                </div>
                <div class="col-3 form-check">
                    <input class="form-check-input" :checked="parameter.lockable == 'Y'" type="checkbox"
                     :id="`lockableCheckbox${parameter.parameterId}`" @change="evt => onLockableChange(evt)" />
                    <label class="form-check-label" :for="`lockableCheckbox${parameter.parameterId}`">Is lockable</label>
                </div>
                <div class="col-3 form-check">
                    <input class="form-check-input" :checked="parameter.requiresInvite == 'Y'" type="checkbox"
                     :id="`requiresInviteCheckbox${parameter.parameterId}`" @change="evt => onRequiresInviteChange(evt)" />
                    <label class="form-check-label" :for="`requiresInviteCheckbox${parameter.parameterId}`">Requires invite</label>
                </div>
            </div>
            <template v-if="parameter.type == 1">
                <div class="h5 mt-1">Values</div>
                <div v-if="parameter.values.length == 0">No values added yet.</div>
                <div class="row mt-1">
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="state.value" v-on:keyup.enter="() => addValue(parameter.parameterId)" placeholder="parameter value" />
                        <button type="button" class="btn btn-primary" @click="() => addValue(parameter.parameterId)">Add Value</button>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12 mt-1" v-for="value in parameter.values" :key="value.value">
                        <div class="input-group">
                            <Field :editable="true" :value="value.description" label="Description" @change="desc => updateParameterValue(value, 'description', desc)" />
                            <Field :value="value.value" label="Value" />
                            <button type="button" class="btn btn-outline-danger" @click="() => deleteParameterValue(parameter.parameterId, value.value)">Delete</button>
                        </div>
                    </div>
                </div>
            </template>
            <div class="collapse" :id="`parameterImage${parameter.parameterId}`">
                <div v-if="parameter.image" class="row justify-content-center mt-2">
                    <div class="col-4 text-center">
                        <img class="img-thumbnail" :src="parameter.image" />
                    </div>
                </div>
                <div class="input-group mb-2 mt-2">
                    <ImageInput url="/parameter/image" idProperty="parameterId" :idValue="parameter.parameterId" @image-changed="() => $emit('parameter-changed')" />
                </div>
                <div>
                    Note: The image will be scaled to have a maximum width/height of 128, preserving aspect ratio.
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-6 text-start"><button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" :data-bs-target="`#parameterImage${parameter.parameterId}`">
                    Parameter image...
                </button></div>
                <div class="col-6 text-end"><button type="button" class="btn btn-outline-danger"
                 data-bs-toggle="modal" :data-bs-target="`#deleteParameter-confirm${parameter.parameterId}`">Delete Parameter</button></div>
            </div>
            <div :id="`deleteParameter-confirm${parameter.parameterId}`" class="modal fade" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Really delete this parameter?</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div class="modal-body">
                            <div class="row g-3 justify-content-start">
                                <div class="col-12">Parameter name: {{parameter.name}}</div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="row">
                                <div class="col">
                                    <button type="button" class="btn btn-primary" @click="deleteParameter" data-bs-dismiss="modal">Yes</button>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

.draggable:hover {
    cursor: move;
}

</style>

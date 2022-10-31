<script setup lang='ts'>
import { reactive } from 'vue'
import ImageInput from '@/components/mgmt/ImageInput.vue'
import Field from '@/components/mgmt/Field.vue'
import type ParameterObject from '@/ParameterObject'
import fetchw from '@/fetchWrapper'

const state = reactive({
    value: {
        desc: '', value: '', key: ''
    },
    error: ''
})
const props = defineProps(['parameter'])
const emit = defineEmits(['parameter-changed'])

function changeParameter(url: string, method: string, body: any) {
    fetchw(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(resp => {
        if (resp.ok) {
            emit('parameter-changed')
        } else {
            state.error = `Error: ${resp.statusText}`
        }
    }).catch(err => {
        state.error = `Error: ${err}`
    })
}

function deleteParameter(parameter : ParameterObject) {
    changeParameter('/parameter', 'DELETE', { parameterId: parameter.parameterId })
}

function addValue(parameterId: number) {

    if (!state.value.value) {
        alert('Value is required')
        return
    }

    changeParameter('/parameter/value', 'POST', {
        parameterId,
        description: state.value.desc,
        value: state.value.value,
        key: state.value.key
    })
    // state.value.desc = ''
    // state.value.value = ''
    // state.value.key = ''
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

</script>

<template>
    <Header :msg="state.error" @ack="() => state.error = ''" />
    <fieldset>
        <legend>{{ parameter.avatarName }} / {{ parameter.name }}</legend>
        <img v-if="parameter.image" class="avatar" :src="parameter.image" />
        <div><Field :editable="true" :value="parameter.description" label="Description" @change="value => updateParameter('description', value)" /></div>
        <div><Field :editable="true" :value="parameter.defaultValue" label="Default value" @change="value => updateParameter('defaultValue', value)" /></div>
        <div><Field :editable="true" :value="parameter.key" label="Password" @change="value => updateParameter('key', value)" /></div>
        <template v-if="parameter.type == 3">
            <div><Field :editable="true" type="float" :value="parameter.minValue" label="Min value" @change="value => updateParameter('minValue', value)" /></div>
            <div><Field :editable="true" type="float" :value="parameter.maxValue" label="Max value" @change="value => updateParameter('maxValue', value)" /></div>
        </template>
        <div v-if="parameter.type == 1">
            <input v-model="state.value.desc" name="valueDescription" type="text" placeholder="value description" />  
            <input v-model="state.value.value" name="value" type="text" placeholder="parameter value" />
            <input v-model="state.value.key" name="valueKey" type="text" placeholder="parameter password" />
            <button @click="() => addValue(parameter.parameterId)">Add value</button>
        </div>
        <div v-if="parameter.type == 1">
            <fieldset class="values">
                <legend>Values</legend>
                <div v-for="value in parameter.values" :key="value.value">
                    <Field :editable="true" :value="value.description" label="Description" @change="desc => updateParameterValue(value, 'description', desc)" />
                    <Field :value="value.value" label="Value" />
                    <Field :editable="true" :value="value.key" label="Password" @change="key => updateParameterValue(value, 'key', key)" />
                    <span title="Delete value" class="clickable delete-button material-icons" @click="() => deleteParameterValue(parameter.parameterId, value.value)">delete</span>
                </div>
            </fieldset>
        </div>
        <ImageInput url="/parameter/image" idProperty="parameterId" :idValue="parameter.parameterId" @image-uploaded="$emit('parameter-changed')" />
        <div><button @click="() => deleteParameter(parameter)">Delete Parameter</button></div>
    </fieldset>
</template>

<style>
.values div:nth-child(odd) {
    background-color: rgba(200, 200, 200, 0.25);
    border-radius: 10px;
}
</style>

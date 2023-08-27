<script setup lang='ts'>
import env from '@/environment'
import type ParameterObject from '@/model/ParameterObject'
import Status from '@/Status'
import { reactive, ref, computed, onUnmounted } from 'vue'
import Checkbox from '@/components/changer/Checkbox.vue'
import Slider from '@/components/changer/Slider.vue'
import LOV from '@/components/changer/LOV.vue'
import Button from '@/components/changer/Button.vue'
import StatusIcon from '@/components/changer/StatusIcon.vue'
import AboutButton from '@/components/AboutButton.vue'
import fetchw from '@/fetchWrapper'

const state = reactive({ wsConnected: false, error: '', targetUser: '', status: new Status() })
const parameters = ref(new Array<ParameterObject>())
const props = defineProps(['targetType', 'target'])
const updates = new Map<string, any>()
let connecting = false

let url: string
if (env.isProduction) {
    url = `wss://${location.host}/parameter-trigger`
} else {
    url = `ws://localhost:${env.developmentPort}/parameter-trigger`
}

const buttonClicks = new Map<string, number>()
const buttonTimeouts = new Map<string, number>()

console.log(`WebSocket URL = ${url}`)
let socket: WebSocket

function handleData(data: any) {
    if (data.constructor == Array) {
        parameters.value = data
        parameters.value.forEach(param => {
            param.value = param.defaultValue
        })
    } else {
        if (data.type == 'status') {
            state.status.update(data)
        } else if (data.type == 'parameter') {
            parameters.value.forEach(param => {
                if (param.name == data.name) {
                    switch (data['parameter-type']) {
                        case 'value':
                            param.value = data.value
                            break
                        case 'lock':
                            param.locked = data.locked
                            param.lockKey = data.lockKey
                            break
                    }
                }
            })
        }
    }
}

function createSession() {
    connecting = true
    let clientId = document.cookie.split('; ').find(row => row.startsWith('uuid='))?.substring(5)
    fetchw('/trigger-connect', {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                target: props.target,
                targetType: props.targetType,
                clientId: clientId
            })
    }).then(async resp => {
        let session = await resp.json()
        state.targetUser = session.targetUser
        document.cookie = `uuid=${session.clientId};max-age=2000000000`
        connect(session.sessionId)
    })
}

function connect(sessionId: string) {
    socket = new WebSocket(url)
    socket.addEventListener('open', evt => {
        console.log('WebSocket opened')
        socket.send(sessionId)
        state.wsConnected = true
        state.error = ''
        connecting = false
    })
    socket.addEventListener('close', evt => {
        console.log('WebSocket closed')
        state.wsConnected = false
        state.error = 'Server connection lost; you can refresh the page or we will try to reconnect automatically soon'
        state.status.resetAll()
        parameters.value = new Array<ParameterObject>()
        connecting = false
    })
    socket.addEventListener('message', evt => {
        console.log(`Message received: ${evt.data}`)
        let data = JSON.parse(evt.data)
        if (typeof data == 'object') {
            handleData(data)
        } else {
            console.warn('data is unexpected type')
        }
    })
    socket.addEventListener('error', evt => {
        // Surprisingly, most of the information in the error event seems useless.
        console.log('WebSocket error', evt)
    })
}

let sendTimeout: number = -1

function send(key: string, value: any) {

    console.log(`Scheduling send ${sendTimeout}`)
    updates.set(key, value)

    if (sendTimeout == -1) {
        sendTimeout = setTimeout(() => {

            console.log(`Sending ${updates.size} updates`)
            socket.send(JSON.stringify(Array.from(updates.values())))
            updates.clear()
            sendTimeout = -1

        }, 100)
    }
}

function triggerButton(name: string, value : string, dataType: number) {
    trigger(name, value, dataType)
    buttonClicks.set(name, Date.now())
}

function releaseButton(name: string, value: string, dataType: number, minPressTime: string) {

    // The release will most likely get delayed by an additional 100ms due to the sendTimeout
    let minPressTimeAsInt = parseInt(minPressTime)
    let timeRemaining = minPressTimeAsInt - 100
    let timePressStarted = buttonClicks.get(name)
    if (timePressStarted) {
        timeRemaining -= Date.now() - timePressStarted
    }

    console.log(`Releasing button ${name}. Time remaining = ${timeRemaining}`)
    if (timeRemaining <= 0) {
        trigger(name, value, dataType)
    } else {
        let timeout = buttonTimeouts.get(name)
        if (timeout) {
            clearInterval(timeout)
        }
        timeout = setTimeout(() => trigger(name, value, dataType), timeRemaining)
        buttonTimeouts.set(name, timeout)
    }
}

function trigger(name: string, value: string, dataType: number) {
    console.log(`Scheduling trigger ${name} = ${value}`)
    send(`trigger-${name}`, {
        change: {
            name, value, dataType
        }
    })
}

function lock(name: string, locked: boolean) {
    console.log(`Scheduling lock ${name} = ${locked}`)
    send(`lock-${name}`, {
        lock: {
            name, locked
        }
    })
}

function reconnect() {
    try {
        socket.close()
    } catch (err) {
        console.warn(`Error closing old websocket when reconnecting: ${err}`)
    } finally {
        createSession()
    }
}

const reconnectInterval = setInterval(() => {
    if (!state.wsConnected && !connecting) {
        console.log('Attempting auto reconnect')
        reconnect()
    }
}, 10000)

const pingInterval = setInterval(() => {
    if (state.wsConnected) {
        console.log('Pinging activity')
        send('activity-ping', {
            change: { name: 'chat-paramvr-activity', value: '', dataType: 0 }
        })
    }
}, 60000)

const connectionState = computed(() => {
    let connected = state.status.getProp('connected')
    let vrcOpen = state.status.getProp('vrcOpen')
    console.log(`Determining connection state. WS=${state.wsConnected}, Connected=${connected}, VRC=${vrcOpen}`)
    return state.wsConnected && connected && vrcOpen ? true : false
})

function statusComputed(prop: string) {
    return computed(() => {
        let val = state.status.getProp(prop) as string
        console.log(`Computing value of ${prop} = ${val}`)
        return val
    })
}
const imageState = statusComputed('image')
const afkState = statusComputed('afk')
const activeState = statusComputed('active')
const isPancakeState = statusComputed('isPancake')
const isMutedState = statusComputed('muted')

onUnmounted(() => {
    console.log('Component unmounting; closing websocket')
    socket.close()
    clearInterval(reconnectInterval)
    clearInterval(pingInterval)
    if (sendTimeout != -1)
        clearTimeout(sendTimeout)
    buttonTimeouts.forEach(timeout => {
        clearTimeout(timeout)
    })
})

createSession()

</script>

<template>
    <div class="container overflow-hidden">
        <div class="fixed-top">
            <div class="float-end text-end"><div class="input-group float-end mt-1 me-1"><AboutButton /></div></div>
        </div>
        <div v-if="state.error" class="row justify-content-center mt-1">
            <div class="p-3 w-75 rounded-3 alert alert-danger">{{ state.error }}</div>
        </div>
        <div class="row justify-content-center mt-1">
            <div v-if="imageState" class="row justify-content-center mb-2">
                <div class="col-6 text-center"><img class="img-thumbnail" :src="imageState" /></div>
            </div>
            <div class="p-3 w-50 text-center border bg-light rounded-3 h4">{{ state.targetUser }}'s avatar parameters</div>
        </div>
        <div class="row justify-content-center mt-1">
            <div class="p-3 w-50 border bg-light rounded-3">
                <div class="row justify-content-center text-center">
                    <!-- Alternatives: cloud & cloud_off, power & power_off -->
                    <StatusIcon name="connection" icon_on="wifi" icon_off="wifi_off" :status="connectionState"
                        on_status="Live connection" off_status="No connection" />

                    <StatusIcon name="AFK" icon_on="location_on" icon_off="location_off" :status="afkState"
                        on_status="Not AFK" off_status="AFK" invert="true" />

                    <StatusIcon name="activity" icon_on="directions_run" icon_off="bedtime" :status="activeState"
                        on_status="Active" off_status="Inactive" />

                    <StatusIcon name="desktop" icon_on="desktop_windows" icon_off="desktop_access_disabled" :status="isPancakeState"
                        on_status="On desktop" off_status="In VR" />

                    <StatusIcon name="microphone" icon_on="mic" icon_off="mic_off" :status="isMutedState"
                        on_status="Unmuted" off_status="Muted" invert="true" />
                </div>
            </div>
        </div>

        <div class="row gy-3 justify-content-center mt-1">
            <div class="col-6 text-center" v-if="parameters.length == 0">
                <div class="p-3 alert alert-warning rounded-3" role="alert">
                    There are currently no available parameters to change.
                </div>
            </div>
            <div class="col-6 text-center" v-for="param in parameters" :key="param.name">
                <div class="p-2 border bg-light rounded-3">
                    <LOV v-if="param.type == 1" :param="param"
                        @change="(name: string, selected: string) => trigger(name, selected, param.dataType)"
                        @lock="() => lock(param.name, !param.locked)" />

                    <Checkbox v-else-if="param.type == 2" :param="param"
                        @change="(name: string, selected: boolean) => trigger(name, selected.toString(), param.dataType)"
                        @lock="() => lock(param.name, !param.locked)" />
                    
                    <Slider v-else-if="param.type == 3" :param="param"
                        @change="(name: string, value: number) => trigger(name, value.toString(), param.dataType)"
                        @lock="() => lock(param.name, !param.locked)" />

                    <Button v-else-if="(param.type == 4)" :param="param"
                        @click="(name: string) => triggerButton(name, param.pressValue, param.dataType)"
                        @release="(name: string) => releaseButton(name, param.defaultValue, param.dataType, param.minValue)"
                        @lock="() => lock(param.name, !param.locked)" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
</style>

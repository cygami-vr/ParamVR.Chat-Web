<script setup lang='ts'>
import type ParameterObject from '@/ParameterObject'
import Status from '@/Status'
import { reactive, ref, computed, onUnmounted } from 'vue'
import Checkbox from '@/components/changer/Checkbox.vue'
import Slider from '@/components/changer/Slider.vue'
import ParameterKeysMenu from '@/components/changer/ParameterKeysMenu.vue'
import StatusIcon from '@/components/changer/StatusIcon.vue'

const state = reactive({ wsConnected: false, error: '' })
const parameters = ref(new Array<ParameterObject>())
const status = ref(new Status())
const props = defineProps(['targetUser'])
const updates = new Map()

const isDev = window.origin.indexOf('localhost') === 7 || window.origin.indexOf('127.0.0.1') === 7
let url: string
if (isDev) {
    // const module = await import('@/portConfig.js')
    url = 'ws://localhost:8093/parameter-trigger'
} else {
    url = `wss://${location.host}/parameter-trigger`
}

let socket: WebSocket

function handleData(data: any) {
    if (data.constructor == Array) {
        parameters.value = data
        parameters.value.forEach(param => {
            param.value = param.defaultValue
        })
    } else if (!status.value.update(data)) {
        parameters.value.forEach(param => {
            if (param.name == data.name) {
                param.value = data.value
            }
        })
    }
}

function connect() {
    socket = new WebSocket(url)
    socket.addEventListener('open', evt => {
        console.log('WebSocket opened')
        state.wsConnected = true
        state.error = ''
        socket.send(props.targetUser)
        socket.send(localStorage.getItem('parameterKeys') || '')
    })
    socket.addEventListener('close', evt => {
        console.log('WebSocket closed')
        state.wsConnected = false
        state.error = 'Server connection lost; you can refresh the page or we will try to reconnect automatically soon'
        status.value = new Status()
        parameters.value = new Array<ParameterObject>()
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
        console.log(`WebSocket error: ${evt}`)
    })
}

connect()

let sendTimeout: number = -1

function trigger(name: string, value: string, dataType: number) {

    console.log(`Scheduling trigger ${name} = ${value}`)

    if (updates.size == 0) {
        sendTimeout = setTimeout(() => {

            console.log(`Sending ${updates.size} triggers`)

            updates.forEach((value, key) => {
                socket.send(JSON.stringify(value))
            })

            updates.clear()
            sendTimeout = -1

        }, 100)
    }

    updates.set(name, {
        name, value, dataType
    })
}

function reconnect() {
    socket.close()
    connect()
}

const reconnectInterval = setInterval(() => {
    if (!state.wsConnected) {
        console.log('Attempting auto reconnect')
        connect()
    }
}, 10000)

const pingInterval = setInterval(() => {
    if (state.wsConnected) {
        console.log('Pinging activity')
        socket.send(JSON.stringify({name: 'minepop-activity', value: '', dataType: 0}))
    }
}, 60000)

const connectionState = computed(() => {
    if (!state.wsConnected) {
        return null
    }
    return status.value.connected
})

onUnmounted(() => {
    console.log('Component unmounting; closing websocket')
    socket.close()
    clearInterval(reconnectInterval)
    clearInterval(pingInterval)
    if (sendTimeout != -1)
        clearTimeout(sendTimeout)
})

</script>

<template>

    <Header :msg="state.error" @ack="() => state.error = ''" />
    <ParameterKeysMenu @change="reconnect" />

    <div class="parameters">Changing parameters on {{ targetUser }}'s avatar{{ status.avatar ? ` ${status.avatar}` : '' }}.</div>

    <div id="avatar" v-if="status.image"><img class="avatar" :src="status.image" /></div>

    <div id="status">
        <!-- Alternatives: cloud & cloud_off, power & power_off -->
        <StatusIcon name="connection" icon_on="wifi" icon_off="wifi_off" :status="connectionState"
         on_status="Live connection" off_status="No connection" />

        <StatusIcon name="VRChat" icon_on="login" icon_off="logout" :status="status.vrcOpen"
         on_status="VRChat is open" off_status="VRChat is closed" />

        <StatusIcon name="AFK" icon_on="location_on" icon_off="location_off" :status="status.afk"
         on_status="Not AFK" off_status="AFK" invert="true" />

        <StatusIcon name="activity" icon_on="directions_run" icon_off="bedtime" :status="status.active"
         on_status="Active" off_status="Inactive" />

        <StatusIcon name="desktop" icon_on="desktop_windows" icon_off="desktop_access_disabled" :status="status.isPancake"
         on_status="On desktop" off_status="In VR" />

        <StatusIcon name="microphone" icon_on="mic" icon_off="mic_off" :status="status.muted"
         on_status="Unmuted" off_status="Muted" invert="true" />
    </div>

    <div class="parameters">
        <span v-if="parameters.length == 0">There are currently no available parameters to change.</span>

        <div class="parameter" v-for="param in parameters" :key="param.name">

            <div v-if="param.image"><img class="avatar" :src="param.image" /></div>
            <span>{{param.description}}</span>
            <div v-if="param.type == 1">
                <!-- TODO change to radio button to allow selecting the active option? -->
                <button v-for="value in param.values" :key="value.value" @click="() => trigger(param.name, value.value, param.dataType)">{{value.description}}</button>
            </div>

            <Checkbox v-else-if="param.type == 2" :name="param.name" :value="param.value"
                @change="(name: string, selected: boolean) => trigger(name, selected.toString(), param.dataType)" />
            
            <Slider v-else-if="param.type == 3" :name="param.name" :value="param.value" :min="param.minValue" :max="param.maxValue"
                @change="(name: string, value: number) => trigger(name, value.toString(), param.dataType)" />
        </div>
    </div>
</template>

<style>
#avatar {
    margin: auto;
    width: 0px;
}
#status {
    margin-top: 8px;
    text-align: center;
}
.parameters {
    text-align: center;
}
.parameter {
    margin-top: 15px;
}
</style>

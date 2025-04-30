<script setup lang="ts">
import env from '@/environment'
import type ParameterObject from '@/model/ParameterObject'
import {
  type Change,
  ParameterChange,
  ParameterLock,
  type WebSocketMessage,
  type Status,
} from '@/model/WebSocketPayloads'
import { reactive, ref, computed, onUnmounted } from 'vue'
import Checkbox from '@/components/changer/Checkbox.vue'
import Slider from '@/components/changer/Slider.vue'
import LOV from '@/components/changer/LOV.vue'
import Button from '@/components/changer/Button.vue'
import StatusIcon from '@/components/changer/StatusIcon.vue'
import AboutButton from '@/components/AboutButton.vue'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher.vue'
import AvatarChanger from '@/components/changer/AvatarChanger.vue'
import fetchw from '@/fetchWrapper'
import type Avatar from '@/model/Avatar'
import { useThemeStore } from '@/stores/themeStore.ts'

const theme = useThemeStore()

const state = reactive({
  wsConnected: false,
  error: '',
  targetUser: '',
  status: {} as Status,
  changeableAvatars: [] as Array<Avatar>,
  changeAvatarCooldownActive: true,
})
const parameters = ref(new Array<ParameterObject>())
const props = defineProps(['targetType', 'target'])
const updates = new Map<string, Change>()
let connecting = false
let avatarChangeCooldownTimeout = -1

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

function handleParameters(params: Array<ParameterObject>) {
  parameters.value = params
  parameters.value.forEach((param) => {
    param.value = param.defaultValue
  })
}

function handleSingleParameter(data: WebSocketMessage) {
  parameters.value.forEach((param) => {
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

function handleStatus(status: Status) {
  const disconnected =
    status.connected !== undefined && state.status?.connected && !status?.connected
  const vrcClosed = status.vrcOpen !== undefined && state.status?.vrcOpen && !status?.vrcOpen
  console.log(`Handling status. Disconnected = ${disconnected}, VRC Closed = ${vrcClosed}`)
  if (disconnected || vrcClosed) {
    resetStatus()
  }
  Object.assign(state.status, status)
  if (status.avatarChangeCooldown !== undefined) {
    if (status.avatarChangeCooldown > 0) {
      state.changeAvatarCooldownActive = true

      if (avatarChangeCooldownTimeout != -1) {
        clearTimeout(avatarChangeCooldownTimeout)
        avatarChangeCooldownTimeout = -1
      }

      avatarChangeCooldownTimeout = setTimeout(() => {
        state.changeAvatarCooldownActive = false
      }, status.avatarChangeCooldown)
    } else {
      state.changeAvatarCooldownActive = false
    }
  }
  if (status.colors) {
    theme.setColors(status.colors)
  }
}

function getTitle() {
  if (state.status?.avatar?.title) {
    return state.status?.avatar?.title
  }
  return `${state.targetUser}'s avatar parameters`
}

function createSession() {
  connecting = true
  const clientId = document.cookie
    .split('; ')
    .find((row) => row.startsWith('uuid='))
    ?.substring(5)
  fetchw('/trigger-connect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target: props.target,
      targetType: props.targetType,
      clientId: clientId,
    }),
  }).then(async (resp) => {
    const session = await resp.json()
    state.targetUser = session.targetUser
    document.cookie = `uuid=${session.clientId};max-age=2000000000`
    connect(session.sessionId)
  })
}

function onSocketMessage(evt: MessageEvent) {
  console.log(`Message received: ${evt.data}`)
  const data = JSON.parse(evt.data)
  const type = typeof data
  if (type === 'object') {
    if (data.parameters) {
      handleParameters(data.parameters)
    } else if (data.status) {
      handleStatus(data.status)
    } else if (data.type == 'parameter') {
      handleSingleParameter(data)
    } else if (data.changeableAvatars) {
      state.changeableAvatars = data.changeableAvatars
    } else {
      console.warn('unrecognized data structure in websocket message')
    }
  } else if (data !== 'Connected') {
    console.warn('data is unexpected type: ' + type)
  }
}

function resetStatus() {
  state.status.muted = undefined
  state.status.isPancake = undefined
  state.status.afk = undefined
  state.status.active = undefined
}

function connect(sessionId: string) {
  socket = new WebSocket(url)
  socket.addEventListener('open', () => {
    console.log('WebSocket opened')
    socket.send(sessionId)
    state.wsConnected = true
    state.error = ''
    connecting = false
  })
  socket.addEventListener('close', () => {
    console.log('WebSocket closed')
    state.wsConnected = false
    state.error =
      'Server connection lost; you can refresh the page or we will try to reconnect automatically soon'
    resetStatus()
    parameters.value = new Array<ParameterObject>()
    connecting = false
  })
  socket.addEventListener('message', onSocketMessage)
  socket.addEventListener('error', (evt) => {
    // Surprisingly, most of the information in the error event seems useless.
    console.log('WebSocket error', evt)
  })
}

let sendTimeout: number = -1

function send(key: string, value: Change) {
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

function triggerButton(name: string, value: string, dataType: number) {
  trigger(name, value, dataType)
  buttonClicks.set(name, Date.now())
}

function releaseButton(name: string, value: string, dataType: number, minPressTime: string) {
  // The release will most likely get delayed by an additional 100ms due to the sendTimeout
  const minPressTimeAsInt = parseInt(minPressTime)
  let timeRemaining = minPressTimeAsInt - 100
  const timePressStarted = buttonClicks.get(name)
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
  send(`trigger-${name}`, new ParameterChange(name, value, dataType))
}

function lock(name: string, locked: boolean) {
  console.log(`Scheduling lock ${name} = ${locked}`)
  send(`lock-${name}`, new ParameterLock(name, locked))
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
      change: { name: 'chat-paramvr-activity', value: '', dataType: 0 },
    })
  }
}, 60000)

const connectionState = computed(() => {
  const connected = state.status?.connected
  const vrcOpen = state.status?.vrcOpen
  console.log(
    `Determining connection state. WS=${state.wsConnected}, Connected=${connected}, VRC=${vrcOpen}`,
  )
  return state.wsConnected && connected && vrcOpen ? true : false
})

onUnmounted(() => {
  console.log('Component unmounting; closing websocket')
  socket.close()
  clearInterval(reconnectInterval)
  clearInterval(pingInterval)
  if (sendTimeout != -1) clearTimeout(sendTimeout)
  buttonTimeouts.forEach((timeout) => {
    clearTimeout(timeout)
  })
  if (avatarChangeCooldownTimeout != -1) {
    clearTimeout(avatarChangeCooldownTimeout)
  }
})

createSession()
</script>

<template>
  <div class="container overflow-hidden">
    <div class="fixed-top">
      <div class="float-end text-end">
        <div class="input-group float-end mt-1 me-1"><ThemeSwitcher /><AboutButton /></div>
      </div>
    </div>
    <div v-if="state.error" class="row justify-content-center mt-1">
      <div class="p-3 w-75 rounded-3 alert alert-danger">{{ state.error }}</div>
    </div>
    <div class="row justify-content-center mt-1">
      <div v-if="state.status?.avatar?.image" class="row justify-content-center mb-2">
        <div class="col-6 text-center">
          <img id="avatarImage" class="img-thumbnail" :src="state.status?.avatar?.image" />
        </div>
      </div>
      <div class="p-3 w-50 text-center border bg-body rounded-3 h4 text-body">
        {{ getTitle() }}
      </div>
    </div>
    <div class="row justify-content-center mt-1">
      <div class="p-3 w-50 border bg-body rounded-3 text-body">
        <div class="row justify-content-center text-center">
          <!-- Alternatives: cloud & cloud_off, power & power_off -->
          <StatusIcon
            name="connection"
            icon_on="wifi"
            icon_off="wifi_off"
            :status="connectionState"
            on_status="Live connection"
            off_status="No connection"
          />

          <StatusIcon
            name="AFK"
            icon_on="location_on"
            icon_off="location_off"
            :status="state.status?.afk"
            on_status="Not AFK"
            off_status="AFK"
            invert="true"
          />

          <StatusIcon
            name="activity"
            icon_on="directions_run"
            icon_off="bedtime"
            :status="state.status?.active"
            on_status="Active"
            off_status="Inactive"
          />

          <StatusIcon
            name="desktop"
            icon_on="desktop_windows"
            icon_off="desktop_access_disabled"
            :status="state.status?.isPancake"
            on_status="On desktop"
            off_status="In VR"
          />

          <StatusIcon
            name="microphone"
            icon_on="mic"
            icon_off="mic_off"
            :status="state.status?.muted"
            on_status="Unmuted"
            off_status="Muted"
            invert="true"
          />
        </div>
      </div>
    </div>

    <AvatarChanger
      :changeable-avatars="state.changeableAvatars"
      :changeAvatarCooldownActive="state.changeAvatarCooldownActive"
      @avatar-change="(chg) => send('avatar', chg)"
    />

    <div class="row gy-3 justify-content-center mt-1 mb-1">
      <div class="col-6 text-center" v-if="parameters.length == 0">
        <div class="p-3 alert alert-warning rounded-3" role="alert">
          There are currently no available parameters to change.
        </div>
      </div>
      <div class="col-6 text-center" v-for="param in parameters" :key="param.name">
        <div class="p-2 border bg-body rounded-3">
          <LOV
            v-if="param.type == 1"
            :param="param"
            @change="(name: string, selected: string) => trigger(name, selected, param.dataType)"
            @lock="() => lock(param.name, !param.locked)"
          />

          <Checkbox
            v-else-if="param.type == 2"
            :param="param"
            @change="
              (name: string, selected: boolean) =>
                trigger(name, selected.toString(), param.dataType)
            "
            @lock="() => lock(param.name, !param.locked)"
          />

          <Slider
            v-else-if="param.type == 3"
            :param="param"
            @change="
              (name: string, value: number) => trigger(name, value.toString(), param.dataType)
            "
            @lock="() => lock(param.name, !param.locked)"
          />

          <Button
            v-else-if="param.type == 4"
            :param="param"
            @click="(name: string) => triggerButton(name, param.pressValue, param.dataType)"
            @release="
              (name: string) =>
                releaseButton(name, param.defaultValue, param.dataType, param.minValue)
            "
            @lock="() => lock(param.name, !param.locked)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#avatarImage {
  max-width: 256px;
  max-height: 256px;
}

.changeAvatarThumbnail {
  max-width: 128px;
  max-height: 128px;
  width: auto;
  height: auto;
}
</style>

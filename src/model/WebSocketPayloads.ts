import type Avatar from '@/model/Avatar'
import type Settings from '@/model/Settings'

export class Change {}

export class ParameterChange extends Change {
  change: ParameterChangePayload

  constructor(name: string, value: string, dataType: number) {
    super()
    this.change = new ParameterChangePayload(name, value, dataType)
  }
}

class ParameterChangePayload {
  name: string
  value: string
  dataType: number

  constructor(name: string, value: string, dataType: number) {
    this.name = name
    this.value = value
    this.dataType = dataType
  }
}

export class ParameterLock extends Change {
  lock: ParameterLockPayload

  constructor(name: string, locked: boolean) {
    super()
    this.lock = new ParameterLockPayload(name, locked)
  }
}

class ParameterLockPayload {
  name: string
  locked: boolean

  constructor(name: string, locked: boolean) {
    this.name = name
    this.locked = locked
  }
}

export class AvatarChange extends Change {
  vrcUuid: string

  constructor(vrcUuid: string) {
    super()
    this.vrcUuid = vrcUuid
  }
}

export interface Status {
  avatar: Avatar
  muted: boolean | undefined
  isPancake: boolean | undefined
  afk: boolean | undefined
  active: boolean | undefined
  vrcOpen: boolean
  connected: boolean
  avatarChangeCooldown: number
  colors: Settings
}

export interface WebSocketMessage {
  name: string
  type: string
  value: string
  locked: boolean
  lockKey: string
  'parameter-type': string
  status: Status
  changeableAvatars: Array<Avatar>
}

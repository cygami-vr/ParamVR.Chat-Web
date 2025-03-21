import { type WebSocketMessage } from '@/model/ParameterPayloads'

class StatusProperty {

    name: string
    resettable: boolean
    triggersReset: boolean
    status: boolean
    value?: string | boolean | undefined

    constructor(name: string, resettable?: boolean, triggersReset?: boolean, status?: boolean) {
        this.name = name
        this.resettable = resettable === undefined ? true : resettable
        this.triggersReset = triggersReset === undefined ? false : triggersReset
        this.status = status === undefined ? true : status
    }

    setValue(value: string | boolean | undefined) {
        this.value = value
    }
}

class Status {

    props: Map<string, StatusProperty> = new Map()

    constructor() {
        [ 'afk', 'active', 'isPancake', 'muted', 'avatar', 'avatarVrcUuid'
         ].forEach(s => this.initProp(s))
        this.initProp('image', false)
        this.initProp('connected', false, true, false)
        this.initProp('vrcOpen', false, true)
    }

    initProp(name: string, resettable?: boolean, triggersReset?: boolean, status?: boolean) {
        this.props.set(name, new StatusProperty(name, resettable, triggersReset, status))
    }

    resetAll() {
        console.log('Resetting props')
        this.props.forEach(prop => {
            if (prop.resettable) {
                prop.setValue(undefined)
            }
        })
    }

    getProp(name: string) {
        const prop = this.props.get(name)
        return prop ? prop.value : null
    }

    update(update: WebSocketMessage) {
        let resetAll = false
        let updateHandled
        if (update.status.size > 0) {
            this.props.forEach(prop => {
                if (prop.status) {
                  const val = update.status.get(prop.name)
                  prop.setValue(val)
                  if (!val && prop.triggersReset) {
                      resetAll = true
                  }
                }
            })
            updateHandled = true
        } else {
            const prop = this.props.get(update.name)
            if (prop) {
              prop.setValue(update.value)
              if (!update.value && prop.triggersReset) {
                  resetAll = true
              }
            }
            updateHandled = prop ? true : false
        }
        if (resetAll) {
            this.resetAll()
        }
        return updateHandled
    }
}

export default Status

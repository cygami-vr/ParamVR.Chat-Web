class StatusProperty {

    name: string
    shouldReset: boolean
    status: boolean
    value?: string | boolean | undefined

    constructor(name: string, reset?: boolean, status?: boolean) {
        this.name = name
        this.shouldReset = reset === undefined ? true : reset
        this.status = status === undefined ? true : status
    }

    reset() {
        if (this.shouldReset) {
            this.value = undefined
        }
    }

    setValue(value: string | boolean | undefined) {
        this.value = value
        this.handleValueChange()
    }

    handleValueChange() {}
}

class Status {

    props: Map<string, StatusProperty> = new Map()

    constructor() {
        [ 'afk', 'active', 'isPancake', 'muted', 'avatar'
         ].forEach(s => this.initSimpleProp(s))
        this.initSimpleProp('image', false)
        this.initResetProp('connected', false)
        this.initResetProp('vrcOpen', true)
    }

    initSimpleProp(name: string, reset?: boolean, status?: boolean) {
        this.props.set(name, new StatusProperty(name, reset, status))
    }

    initResetProp(name: string, isStatus: boolean) {
        let status = this
        this.props.set(name, new class extends StatusProperty {
            handleValueChange() {
                status.resetAll()
            }
        }(name, false, isStatus))
    }

    resetAll() {
        this.props.forEach(prop => prop.reset())
    }

    getProp(name: string) {
        let prop = this.props.get(name)
        return prop ? prop.value : null
    }

    update(update: any) {
        if (update.status) {
            this.props.forEach(prop => {
                if (prop.status) {
                    prop.setValue(update.status[prop.name])
                }
            })
            return true
        } else {
            let prop = this.props.get(update.name)
            if (prop) {
                prop.setValue(update.value)
            }
            return prop ? true : false
        }
    }
}

export default Status
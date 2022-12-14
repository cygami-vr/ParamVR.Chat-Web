import type ParameterValue from '@/ParameterValue'

class ParameterObject {

    description: string
    name: string
    key: string
    type: number
    dataType: number
    avatarName: string
    avatarVrcUuid: string
    defaultValue: string
    minValue: string
    maxValue: string
    pressValue: string
    values: Array<ParameterValue> = []
    value: string = ''
    parameterId: number
    saved: string
    lockable: string
    locked: boolean
    lockKey: string
    order: number
    image: string = ''
    
    constructor(description: string, name: string, key: string, type: number, dataType: number,
         avatarName: string, avatarVrcUuid: string,
         defaultValue: string, minValue: string, maxValue: string, pressValue: string,
         parameterId: number, saved: string, lockable: string, locked: boolean, lockKey: string,
         order: number, values?: Array<ParameterValue>) {

        this.description = description
        this.name = name
        this.key = key
        this.type = type
        this.dataType = dataType
        this.avatarName = avatarName
        this.avatarVrcUuid = avatarVrcUuid
        this.defaultValue = defaultValue
        this.minValue = minValue
        this.maxValue = maxValue
        this.pressValue = pressValue
        this.parameterId = parameterId
        this.saved = saved
        this.lockable = lockable
        this.locked = locked
        this.lockKey = lockKey
        this.order = order

        if (values) {
            this.values = values
        }
    }
}

export default ParameterObject